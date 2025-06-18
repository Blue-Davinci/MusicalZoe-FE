import { redirect, type RequestEvent } from '@sveltejs/kit';
import { logAuth, logSecurity } from '$lib/utils/logger';
import { clearAuthCookies } from '$lib/utils/token-helpers';

export const actions = {
	default: async ({ cookies, locals, getClientAddress }: RequestEvent) => {
		const clientIP = getClientAddress();

	// Log logout attempt
	logAuth('LOGOUT_ATTEMPT', {
		userEmail: locals.user?.email || 'unknown',
		userName: locals.user?.name || 'unknown',
		clientIP,
		timestamp: new Date().toISOString()
	});

	// Clear authentication cookies using helper function
	clearAuthCookies(cookies);

	// Log successful logout
	logSecurity('LOGOUT_SUCCESS', {
		userEmail: locals.user?.email || 'unknown',
		clientIP,
		timestamp: new Date().toISOString()
	});

		// Redirect to home page
		return redirect(303, '/');
	}
};
