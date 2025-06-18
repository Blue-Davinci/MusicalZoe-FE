import { type RequestEvent } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { logAuth, logSecurity, logError, generateErrorId } from '$lib/utils/logger';
import {
	type AuthResult,
	checkAuthRateLimit,
	recordFailedAuthAttempt,
	clearFailedAuthAttempts,
	validateToken,
	extractErrorMessage
} from '$lib/utils/auth-helpers';
import { API_ACTIVATION_URL } from '$env/static/private';

export const load = async ({ url, getClientAddress }: RequestEvent) => {
	const startTime = Date.now();
	const clientIP = getClientAddress();

	// Log activation page access
	logSecurity('ACTIVATION_PAGE_ACCESS', {
		timestamp: new Date().toISOString(),
		clientIP,
		userAgent: url.searchParams.get('user-agent')
	});

	// Get activation token from URL parameters
	const token = url.searchParams.get('token');

	// Validate token format
	const tokenValidation = validateToken(token);
	if (!tokenValidation.isValid) {
		logAuth('ACTIVATION_INVALID_TOKEN', {
			clientIP,
			error: tokenValidation.error,
			tokenProvided: !!token
		});

		return {
			success: false,
			error: tokenValidation.error,
			token: null,
			showRetry: false
		};
	}

	// Check rate limiting for activation attempts
	const rateLimit = checkAuthRateLimit(token!, clientIP, 'activation');
	if (!rateLimit.allowed) {
		const waitMinutes = Math.ceil(rateLimit.waitTime / (1000 * 60));

		logSecurity('ACTIVATION_RATE_LIMITED', {
			clientIP,
			attempts: rateLimit.attempts,
			waitTime: rateLimit.waitTime
		});

		return {
			success: false,
			error: `Too many activation attempts. Please try again in ${waitMinutes} minutes.`,
			token: null,
			showRetry: false
		};
	}

	try {
		// Attempt to activate the account
		logAuth('ACTIVATION_ATTEMPT', {
			clientIP,
			timestamp: new Date().toISOString()
		});

		const activationResult = await activateAccount(token!, clientIP);

		// Handle activation result
		if (!activationResult.success) {
			recordFailedAuthAttempt(token!, clientIP, 'activation');

			// Extract proper error message from the result
			const errorMessage = extractErrorMessage(
				activationResult.error,
				'Account activation failed. Please try again.'
			);

			logAuth('ACTIVATION_FAILED', {
				clientIP,
				error: activationResult.error,
				errorMessage,
				duration: Date.now() - startTime
			});

			return {
				success: false,
				error: errorMessage,
				token: token,
				showRetry: true
			};
		}

		// Success - clear failed attempts
		clearFailedAuthAttempts(token!, clientIP, 'activation');

		// Log successful activation
		logAuth('ACTIVATION_SUCCESS', {
			userId: activationResult.user?.id,
			email: activationResult.user?.email,
			clientIP,
			duration: Date.now() - startTime
		});

		return {
			success: true,
			message: activationResult.message || 'Account activated successfully! You can now sign in.',
			user: activationResult.user,
			token: null
		};
	} catch (error) {
		const errorId = generateErrorId();

		logError('UNEXPECTED_ACTIVATION_ERROR', {
			errorId,
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			clientIP,
			timestamp: new Date().toISOString()
		});

		return {
			success: false,
			error: dev
				? `An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`
				: 'An unexpected error occurred. Please try again or contact support.',
			token: token,
			showRetry: true
		};
	}
};

// Helper function to call the activation API
async function activateAccount(token: string, clientIP: string): Promise<AuthResult> {
	try {
		logAuth('BACKEND_ACTIVATION_ATTEMPT', {
			timestamp: new Date().toISOString(),
			clientIP
		});

		// Use the direct activation URL from environment
		if (!API_ACTIVATION_URL) {
			logError('MISSING_API_CONFIG', {
				message: 'API_ACTIVATION_URL not configured'
			});
			return {
				success: false,
				error: 'Service configuration error. Please contact support.'
			};
		}

		logAuth('API_CALL_START', {
			url: dev ? API_ACTIVATION_URL : '[REDACTED]',
			method: 'PUT'
		});

		const response = await fetch(API_ACTIVATION_URL, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify({ token })
		});

		const result = await response.json();

		if (!response.ok) {
			logAuth('BACKEND_ACTIVATION_FAILED', {
				status: response.status,
				statusText: response.statusText,
				error: result.message || result.error,
				clientIP
			});

			// Extract proper error message
			const errorMessage = extractErrorMessage(
				result.message || result.error,
				'Account activation failed'
			);

			return {
				success: false,
				error: errorMessage
			};
		}

		logAuth('BACKEND_ACTIVATION_SUCCESS', {
			userId: result.user?.id,
			email: result.user?.email,
			status: response.status,
			clientIP
		});

		return {
			success: true,
			message: result.message || 'Account activated successfully!',
			user: result.user
		};
	} catch (error) {
		logError('ACTIVATION_API_ERROR', {
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			clientIP
		});

		return {
			success: false,
			error: 'Unable to connect to activation service. Please try again later.'
		};
	}
}
