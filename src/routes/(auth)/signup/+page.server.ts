import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { signupSchema } from '$lib/schemas/auth';
import { fail, type RequestEvent } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { logAuth, logSecurity, logError, generateErrorId } from '$lib/utils/logger';
import { API_SIGNUP_URL } from '$env/static/private';

// Types for better code organization
interface SignupResult {
	success: boolean;
	user?: {
		id: string;
		name: string;
		email: string;
		created_at: string;
	} | null;
	error?: string;
	requiresVerification?: boolean;
}

// Rate limiting storage for signup attempts (in production, use Redis)
const signupAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_SIGNUP_ATTEMPTS = 3;
const SIGNUP_LOCKOUT_DURATION = 60 * 60 * 1000; // 1 hour

export const load = async ({ url, locals }) => {
	// Check if user is already logged in (uncomment when auth is implemented)
	/*if (locals.user) {
		const redirectTo = url.searchParams.get('redirectTo') || '/dashboard';
		throw redirect(303, redirectTo);
	}*/

	logSecurity('SIGNUP_PAGE_ACCESS', {
		timestamp: new Date().toISOString(),
		locals_vars: locals
	});

	const form = await superValidate(zod(signupSchema));
	return {
		form,
		redirectTo: url.searchParams.get('redirectTo') || '/'
	};
};

export const actions = {
	default: async (event: RequestEvent) => {
		const startTime = Date.now();
		const { request, getClientAddress } = event;
		const clientIP = getClientAddress();

		// Validate form data
		const form = await superValidate(request, zod(signupSchema));

		if (!form.valid) {
			logSecurity('INVALID_SIGNUP_FORM_DATA', { clientIP, errors: form.errors });
			return fail(400, { form });
		}

		try {
			const { name, email, password } = form.data;

			// Rate limiting check
			const rateLimitResult = checkSignupRateLimit(email, clientIP);
			if (!rateLimitResult.allowed) {
				logSecurity('SIGNUP_RATE_LIMIT_EXCEEDED', {
					email,
					clientIP,
					attempts: rateLimitResult.attempts
				});
				return message(form, {
					success: false,
					message: `Too many signup attempts. Please try again in ${Math.ceil(rateLimitResult.waitTime / 60000)} minutes.`
				});
			}

			// Input sanitization and validation
			const sanitizedEmail = email.toLowerCase().trim();
			const sanitizedName = name.trim();

			logAuth('SIGNUP_ATTEMPT', {
				email: sanitizedEmail,
				clientIP,
				userAgent: request.headers.get('user-agent')
			});

			// Simulate user registration (replace with actual backend API call)
			const signupResult = await registerUser({
				name: sanitizedName,
				email: sanitizedEmail,
				password
			});

			// Handle signup result
			if (!signupResult.success) {
				recordFailedSignupAttempt(sanitizedEmail, clientIP);

				logAuth('SIGNUP_FAILED', {
					email: sanitizedEmail,
					clientIP,
					error: signupResult.error
				});
				return message(form, {
					success: false,
					message: signupResult.error || 'Signup failed. Please try again.'
				});
			}

			// Success - clear failed attempts
			clearFailedSignupAttempts(sanitizedEmail, clientIP);

			// Log successful signup
			logAuth('SIGNUP_SUCCESS', {
				userId: signupResult.user?.id,
				email: sanitizedEmail,
				clientIP,
				duration: Date.now() - startTime
			});

			return message(form, {
				success: true,
				message:
					'Account created successfully! Please check your email to verify your account before signing in.',
				data: {
					email: sanitizedEmail,
					requiresVerification: true
				}
			});
		} catch (error) {
			const errorId = generateErrorId();

			logError('UNEXPECTED_SIGNUP_ERROR', {
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
};

// Helper Functions

async function registerUser(userData: {
	name: string;
	email: string;
	password: string;
}): Promise<SignupResult> {
	try {
		logAuth('BACKEND_SIGNUP_ATTEMPT', {
			email: userData.email,
			timestamp: new Date().toISOString()
		});

		// Validate environment configuration
		if (!API_SIGNUP_URL) {
			logError('MISSING_API_CONFIG', {
				message: 'API_SIGNUP_URL not configured',
				email: userData.email
			});
			return {
				success: false,
				error: 'Service configuration error. Please contact support.'
			};
		}

		logAuth('API_CALL_START', {
			url: dev ? API_SIGNUP_URL : '[REDACTED]', // Don't log full URL in production
			method: 'POST'
		});

		const response = await fetch(API_SIGNUP_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify(userData)
		});

		const result = await response.json();

		if (!response.ok) {
			logAuth('BACKEND_SIGNUP_FAILED', {
				email: userData.email,
				status: response.status,
				statusText: response.statusText,
				error: result.message || result.error
			});

			return {
				success: false,
				error: result.message || result.error || 'Registration failed'
			};
		}

		logAuth('BACKEND_SIGNUP_SUCCESS', {
			email: userData.email,
			userId: result.user?.id,
			status: response.status
		});

		return {
			success: true,
			user: result.user
		};
	} catch (error) {
		logError('BACKEND_SIGNUP_ERROR', {
			message: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			email: userData.email
		});

		return {
			success: false,
			error: dev
				? `Registration service error: ${error instanceof Error ? error.message : 'Unknown error'}`
				: 'Registration service is temporarily unavailable. Please try again later.'
		};
	}
}

// Rate Limiting Functions

function checkSignupRateLimit(
	email: string,
	clientIP: string
): { allowed: boolean; attempts: number; waitTime: number } {
	const key = `${email}:${clientIP}`;
	const now = Date.now();
	const attempt = signupAttempts.get(key);

	if (!attempt) {
		return { allowed: true, attempts: 0, waitTime: 0 };
	}

	// Reset if lockout period has passed
	if (now - attempt.lastAttempt > SIGNUP_LOCKOUT_DURATION) {
		signupAttempts.delete(key);
		return { allowed: true, attempts: 0, waitTime: 0 };
	}

	if (attempt.count >= MAX_SIGNUP_ATTEMPTS) {
		const waitTime = SIGNUP_LOCKOUT_DURATION - (now - attempt.lastAttempt);
		return { allowed: false, attempts: attempt.count, waitTime };
	}

	return { allowed: true, attempts: attempt.count, waitTime: 0 };
}

function recordFailedSignupAttempt(email: string, clientIP: string): void {
	const key = `${email}:${clientIP}`;
	const now = Date.now();
	const attempt = signupAttempts.get(key);

	if (!attempt) {
		signupAttempts.set(key, { count: 1, lastAttempt: now });
	} else {
		signupAttempts.set(key, { count: attempt.count + 1, lastAttempt: now });
	}
}

function clearFailedSignupAttempts(email: string, clientIP: string): void {
	const key = `${email}:${clientIP}`;
	signupAttempts.delete(key);
}
