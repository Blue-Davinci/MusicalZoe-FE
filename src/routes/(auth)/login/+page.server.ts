import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema } from '$lib/schemas/auth';
import { fail, type RequestEvent } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { logAuth, logSecurity, logError, generateErrorId } from '$lib/utils/logger';
import { 
	type AuthResult, 
	checkAuthRateLimit, 
	recordFailedAuthAttempt, 
	clearFailedAuthAttempts,
	extractErrorMessage
} from '$lib/utils/auth-helpers';
import { VITE_API_AUTHENTICATION_URL } from '$env/static/private';

export const load = async ({ url, locals }: RequestEvent) => {
	// Check if user is already logged in (uncomment when auth is implemented)
	/*if (locals.user) {
		const redirectTo = url.searchParams.get('redirectTo') || '/dashboard';
		return redirect(303, redirectTo);
	}*/

	logSecurity('LOGIN_PAGE_ACCESS', {
		timestamp: new Date().toISOString(),
		locals_vars: locals
	});

	const form = await superValidate(zod(loginSchema));
	return {
		form,
		redirectTo: url.searchParams.get('redirectTo') || '/'
	};
};

export const actions = {
	default: async (event: RequestEvent) => {
		const startTime = Date.now();
		const { request, getClientAddress, cookies } = event;
		const clientIP = getClientAddress();

		// Validate form data
		const form = await superValidate(request, zod(loginSchema));

		if (!form.valid) {
			logSecurity('INVALID_FORM_DATA', { clientIP, errors: form.errors });
			return fail(400, { form });
		}

		try {
			const { email, password, rememberMe } = form.data;

			// Input sanitization
			const sanitizedEmail = email.toLowerCase().trim();

			// Rate limiting check
			const rateLimit = checkAuthRateLimit(sanitizedEmail, clientIP, 'login');
			if (!rateLimit.allowed) {
				const waitMinutes = Math.ceil(rateLimit.waitTime / (1000 * 60));
				
				logSecurity('LOGIN_RATE_LIMITED', {
					email: sanitizedEmail,
					clientIP,
					attempts: rateLimit.attempts,
					waitTime: rateLimit.waitTime
				});

				return message(form, {
					success: false,
					message: `Too many login attempts. Please try again in ${waitMinutes} minutes.`
				});
			}

			logAuth('LOGIN_ATTEMPT', {
				email: sanitizedEmail,
				clientIP,
				userAgent: request.headers.get('user-agent'),
				rememberMe
			});

			// Authenticate user
			const authResult = await authenticateUser({
				email: sanitizedEmail,
				password,
				rememberMe
			}, clientIP);

			// Handle authentication result
			if (!authResult.success) {
				recordFailedAuthAttempt(sanitizedEmail, clientIP, 'login');

				const errorMessage = extractErrorMessage(authResult.error, 'Login failed. Please try again.');

				logAuth('LOGIN_FAILED', {
					email: sanitizedEmail,
					clientIP,
					error: authResult.error,
					errorMessage,
					duration: Date.now() - startTime
				});

				return message(form, {
					success: false,
					message: errorMessage
				});
			}

			// Success - clear failed attempts
			clearFailedAuthAttempts(sanitizedEmail, clientIP, 'login');

			// Set authentication cookies
			if (authResult.session?.access_token) {
				const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24; // 30 days or 1 day

				cookies.set('access_token', authResult.session.access_token, {
					path: '/',
					httpOnly: true,
					secure: !dev,
					sameSite: 'lax',
					maxAge
				});

				if (authResult.session.refresh_token) {
					cookies.set('refresh_token', authResult.session.refresh_token, {
						path: '/',
						httpOnly: true,
						secure: !dev,
						sameSite: 'lax',
						maxAge: 60 * 60 * 24 * 30 // 30 days for refresh token
					});
				}

				// Set remember preference
				if (rememberMe) {
					cookies.set('remember_me', 'true', {
						path: '/',
						httpOnly: true,
						secure: !dev,
						sameSite: 'lax',
						maxAge: 60 * 60 * 24 * 365 // 1 year
					});
				}
			}

			// Log successful login
			logAuth('LOGIN_SUCCESS', {
				userId: authResult.user?.id,
				email: sanitizedEmail,
				clientIP,
				duration: Date.now() - startTime,
				rememberMe
			});

			return message(form, {
				success: true,
				message: 'Login successful! Welcome back.',
				data: authResult.user
			});

		} catch (error) {
			const errorId = generateErrorId();

			logError('UNEXPECTED_LOGIN_ERROR', {
				errorId,
				error: error instanceof Error ? error.message : 'Unknown error',
				stack: error instanceof Error ? error.stack : undefined,
				clientIP,
				timestamp: new Date().toISOString()
			});

			return message(form, {
				success: false,
				message: dev
					? `An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`
					: 'An unexpected error occurred. Please try again.'
			});
		}
	}
}

// Helper function to call the authentication API
async function authenticateUser(
	loginData: { email: string; password: string; rememberMe: boolean },
	clientIP: string
): Promise<AuthResult> {
	try {
		logAuth('BACKEND_LOGIN_ATTEMPT', {
			email: loginData.email,
			timestamp: new Date().toISOString(),
			clientIP
		});

		// Validate environment configuration
		if (!VITE_API_AUTHENTICATION_URL) {
			logError('MISSING_API_CONFIG', {
				message: 'VITE_API_AUTHENTICATION_URL not configured',
				email: loginData.email
			});
			return {
				success: false,
				error: 'Service configuration error. Please contact support.'
			};
		}

		logAuth('API_CALL_START', {
			url: dev ? VITE_API_AUTHENTICATION_URL : '[REDACTED]',
			method: 'POST'
		});

		const response = await fetch(VITE_API_AUTHENTICATION_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify({
				email: loginData.email,
				password: loginData.password
			})
		});

		const result = await response.json();

		if (!response.ok) {
			logAuth('BACKEND_LOGIN_FAILED', {
				email: loginData.email,
				status: response.status,
				statusText: response.statusText,
				error: result.message || result.error,
				clientIP
			});
			
			// Extract proper error message
			const errorMessage = extractErrorMessage(
				result.message || result.error, 
				'Invalid email or password'
			);
			
			return { 
				success: false, 
				error: errorMessage
			};
		}

		logAuth('BACKEND_LOGIN_SUCCESS', {
			userId: result.user?.id,
			email: result.user?.email,
			status: response.status,
			clientIP
		});

		return {
			success: true,
			message: result.message || 'Login successful!',
			user: result.user,
			session: result.session || {
				access_token: result.access_token,
				refresh_token: result.refresh_token
			}
		};

	} catch (error) {
		logError('LOGIN_API_ERROR', {
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			clientIP
		});

		return {
			success: false,
			error: 'Unable to connect to authentication service. Please try again later.'
		};
	}
}
