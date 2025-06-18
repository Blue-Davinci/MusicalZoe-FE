import { redirect, type RequestEvent } from '@sveltejs/kit';
import { logAuth, logSecurity } from '$lib/utils/logger';

export const POST = async ({ cookies, locals, getClientAddress }: RequestEvent) => {
	const clientIP = getClientAddress();

	// Log logout attempt
	logAuth('LOGOUT_ATTEMPT', {
		userId: locals.user?.id || 'unknown',
		email: locals.user?.email || 'unknown',
		clientIP,
		timestamp: new Date().toISOString()
	});

	// Clear authentication cookies
	cookies.delete('access_token', { path: '/' });
	cookies.delete('refresh_token', { path: '/' });
	cookies.delete('remember_me', { path: '/' });

	// Log successful logout
	logSecurity('LOGOUT_SUCCESS', {
		userId: locals.user?.id || 'unknown',
		clientIP,
		timestamp: new Date().toISOString()
	});

	// Redirect to home page
	return redirect(303, '/');
};

// Also handle GET requests for logout links
export const GET = async ({ cookies, locals, getClientAddress }: RequestEvent) => {
	const clientIP = getClientAddress();

	// Log logout attempt
	logAuth('LOGOUT_ATTEMPT_GET', {
		userId: locals.user?.id || 'unknown',
		email: locals.user?.email || 'unknown',
		clientIP,
		timestamp: new Date().toISOString()
	});

	// Clear authentication cookies
	cookies.delete('access_token', { path: '/' });
	cookies.delete('refresh_token', { path: '/' });
	cookies.delete('remember_me', { path: '/' });

	// Log successful logout
	logSecurity('LOGOUT_SUCCESS_GET', {
		userId: locals.user?.id || 'unknown',
		clientIP,
		timestamp: new Date().toISOString()
	});

	// Redirect to home page
	return redirect(303, '/');
};
