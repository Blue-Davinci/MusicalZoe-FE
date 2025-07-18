import { redirect, error, type Handle } from '@sveltejs/kit';
import { logAuth, logSecurity, logError, generateErrorId } from '$lib/utils/logger';
import {
	getBearerToken,
	getTokenExpiry,
	isBearerTokenExpired,
	clearAuthCookies,
	type User
} from '$lib/utils/token-helpers';
import { dev } from '$app/environment';
import type { RequestEvent } from '@sveltejs/kit';

// Define route categories
const PROTECTED_ROUTES = ['/dashboard', '/profile', '/settings', '/api'];
const AUTH_ROUTES = ['/login', '/signup', '/activation'];
const ADMIN_ROUTES = ['/admin'];

// Interface for authentication result
interface AuthResult {
	isAuthenticated: boolean;
	user: User | null;
	isAdmin: boolean;
	isVerified: boolean;
}

// Custom response interface to avoid try/catch issues
interface RouteAction {
	type: 'redirect' | 'error' | 'continue';
	status?: number;
	location?: string;
	message?: string;
}

export const handle: Handle = async ({ event, resolve }) => {
	const startTime = Date.now();
	const requestedPath = event.url.pathname;
	const userAgent = event.request.headers.get('user-agent') || 'Unknown';

	// Get client IP address with fallback
	let clientIP: string;
	try {
		clientIP = event.getClientAddress();
	} catch (err) {
		const forwardedFor = event.request.headers.get('x-forwarded-for');
		clientIP = forwardedFor ? forwardedFor.split(',')[0].trim() : 'Unknown';

		logError('CLIENT_IP_ERROR', {
			error: err instanceof Error ? err.message : 'Unknown error',
			stack: err instanceof Error ? err.stack : undefined,
			timestamp: new Date().toISOString()
		});
	}

	// Log the incoming request
	logAuth('REQUEST_RECEIVED', {
		path: requestedPath === '/' ? '/home' : requestedPath,
		clientIP,
		userAgent: userAgent.substring(0, 100),
		timestamp: new Date().toISOString()
	});

	// Declare variables outside try block to avoid scope issues
	let authResult: AuthResult;
	let routeAction: RouteAction = { type: 'continue' };

	try {
		// Check authentication status
		authResult = await checkAuthentication(event);

		// Set locals with proper typing
		event.locals.user = authResult.user;
		event.locals.isAuthenticated = authResult.isAuthenticated;
		event.locals.isAdmin = authResult.isAdmin;
		event.locals.isVerified = authResult.isVerified;

		// Get route action but don't execute redirects/errors yet
		routeAction = handleRouteProtection(
			requestedPath,
			authResult,
			clientIP,
			event.url.searchParams
		);
	} catch (err) {
		const errorId = generateErrorId();

		logError('HOOKS_SERVER_ERROR', {
			errorId,
			path: requestedPath,
			clientIP,
			error: err instanceof Error ? err.message : 'Unknown error',
			stack: err instanceof Error ? err.stack : undefined,
			timestamp: new Date().toISOString()
		});

		// Return a generic error response
		if (dev) {
			return error(
				500,
				`Server error: ${err instanceof Error ? err.message : 'Unknown error'} (ID: ${errorId})`
			);
		}

		return error(
			500,
			`An internal server error occurred. Please try again later. (ID: ${errorId})`
		);
	}

	// Handle redirects and errors OUTSIDE the try block
	if (routeAction.type === 'redirect' && routeAction.location) {
		return redirect(routeAction.status || 303, routeAction.location);
	}

	if (routeAction.type === 'error') {
		return error(routeAction.status || 500, routeAction.message || 'Access denied');
	}

	// Continue with the request
	try {
		const response = await resolve(event);

		// Log successful request completion
		const duration = Date.now() - startTime;
		logAuth('REQUEST_COMPLETED', {
			path: requestedPath,
			duration,
			status: response.status,
			authenticated: authResult.isAuthenticated,
			userId: authResult.user?.id || 'anonymous'
		});

		return response;
	} catch (err) {
		const errorId = generateErrorId();

		logError('RESOLVE_ERROR', {
			errorId,
			path: requestedPath,
			clientIP,
			error: err instanceof Error ? err.message : 'Unknown error',
			stack: err instanceof Error ? err.stack : undefined,
			timestamp: new Date().toISOString()
		});

		if (dev) {
			error(
				500,
				`Resolve error: ${err instanceof Error ? err.message : 'Unknown error'} (ID: ${errorId})`
			);
		}

		error(500, `An internal server error occurred. Please try again later. (ID: ${errorId})`);
	}
};

/**
 * Check if user is authenticated by validating bearer token from cookies
 */
async function checkAuthentication(event: RequestEvent): Promise<AuthResult> {
	try {
		const { cookies } = event;
		const bearerToken = getBearerToken(cookies);
		const tokenExpiry = getTokenExpiry(cookies);

		// Debug: Log all cookies to see what's available
		const allCookies = Object.fromEntries(
			event.request.headers
				.get('cookie')
				?.split(';')
				.map((cookie) => {
					const [name, value] = cookie.trim().split('=');
					return [name, value];
				}) || []
		);

		logAuth('DEBUG_COOKIES_READ', {
			bearerToken: bearerToken ? 'exists' : 'missing',
			tokenExpiry: tokenExpiry ? 'exists' : 'missing',
			allCookies: Object.keys(allCookies),
			rawCookieHeader: event.request.headers.get('cookie')
		});

		if (!bearerToken || !tokenExpiry) {
			return {
				isAuthenticated: false,
				user: null,
				isAdmin: false,
				isVerified: false
			};
		}

		// Check if token is expired
		if (isBearerTokenExpired(tokenExpiry)) {
			logSecurity('TOKEN_EXPIRED_CLEARED', {
				timestamp: new Date().toISOString(),
				reason: 'Bearer token expired'
			});

			// Clear expired token cookies
			clearAuthCookies(cookies);

			return {
				isAuthenticated: false,
				user: null,
				isAdmin: false,
				isVerified: false
			};
		}

		// Validate the bearer token
		// Since we don't have a validation endpoint, we trust the bearer token
		// if it exists and hasn't expired. We'll extract user data from the user_data cookie
		const userData = cookies.get('user_data');
		let userInfo = null;

		if (userData) {
			try {
				userInfo = JSON.parse(decodeURIComponent(userData));
			} catch (err) {
				logError('USER_DATA_PARSE_ERROR', {
					error: err instanceof Error ? err.message : 'Unknown error',
					rawUserData: userData
				});
			}
		}

		if (!userInfo) {
			// Token exists but no user data found, clear auth cookies
			clearAuthCookies(cookies);

			logSecurity('INVALID_TOKEN_CLEARED', {
				timestamp: new Date().toISOString(),
				reason: 'Bearer token exists but no user data found'
			});

			return {
				isAuthenticated: false,
				user: null,
				isAdmin: false,
				isVerified: false
			};
		}

		const isAdmin = userInfo.role === 'admin';
		const isVerified = userInfo.activated === true;

		logAuth('USER_AUTHENTICATED', {
			userEmail: userInfo.email,
			userName: userInfo.name,
			isAdmin,
			isVerified,
			activated: userInfo.activated,
			timestamp: new Date().toISOString()
		});

		return {
			isAuthenticated: true,
			user: userInfo,
			isAdmin,
			isVerified
		};
	} catch (err) {
		logError('AUTH_CHECK_ERROR', {
			error: err instanceof Error ? err.message : 'Unknown error',
			stack: err instanceof Error ? err.stack : undefined,
			timestamp: new Date().toISOString()
		});

		return {
			isAuthenticated: false,
			user: null,
			isAdmin: false,
			isVerified: false
		};
	}
}

/**
 * Handle route protection and redirects
 * This function only returns Response objects, doesn't throw
 */
function handleRouteProtection(
	requestedPath: string,
	authResult: AuthResult,
	clientIP: string,
	searchParams: URLSearchParams
): RouteAction {
	const { isAuthenticated, user, isAdmin } = authResult;

	// Check route types
	const isHealthEndpoint = requestedPath === '/api/health' || requestedPath === '/health';
	const requiresAuth =
		!isHealthEndpoint && PROTECTED_ROUTES.some((route) => requestedPath.startsWith(route));
	const isAuthRoute = AUTH_ROUTES.some((route) => requestedPath.startsWith(route));
	const isAdminRoute = ADMIN_ROUTES.some((route) => requestedPath.startsWith(route));

	// Handle admin routes
	if (isAdminRoute) {
		if (!isAuthenticated) {
			logSecurity('UNAUTHORIZED_ADMIN_ACCESS', {
				path: requestedPath,
				clientIP,
				reason: 'Not authenticated'
			});
			return {
				type: 'redirect',
				status: 303,
				location: `/login?redirectTo=${encodeURIComponent(requestedPath)}`
			};
		}

		if (!isAdmin) {
			logSecurity('FORBIDDEN_ADMIN_ACCESS', {
				path: requestedPath,
				clientIP,
				userId: user?.id,
				reason: 'Not admin user'
			});

			return {
				type: 'error',
				status: 403,
				message:
					'Access Denied: You do not have permission to access this page. Admin privileges required.'
			};
		}
	}

	// Handle protected routes
	if (requiresAuth && !isAuthenticated) {
		logSecurity('UNAUTHORIZED_ACCESS_ATTEMPT', {
			path: requestedPath,
			clientIP,
			reason: 'Not authenticated'
		});

		// Special handling for API routes
		if (requestedPath.startsWith('/api')) {
			return {
				type: 'error',
				status: 401,
				message: 'Authentication required. You must be logged in to access this resource.'
			};
		}

		// Redirect to login with return path
		const redirectTo = requestedPath === '/dashboard' ? '/dashboard' : requestedPath;
		return {
			type: 'redirect',
			status: 303,
			location: `/login?redirectTo=${encodeURIComponent(redirectTo)}`
		};
	}

	// Handle auth routes when already authenticated
	if (isAuthenticated && isAuthRoute) {
		const intendedDestination = searchParams.get('redirectTo') || '/dashboard';

		logAuth('AUTHENTICATED_USER_REDIRECT', {
			from: requestedPath,
			to: intendedDestination,
			userId: user?.id,
			reason: 'Already authenticated'
		});

		return {
			type: 'redirect',
			status: 303,
			location: intendedDestination
		};
	}

	// Continue normally - no action needed
	return { type: 'continue' };
}
