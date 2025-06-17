import { logSecurity } from './logger';
import { dev } from '$app/environment';

// Types
export interface AuthResult {
	success: boolean;
	user?: {
		id: string;
		name: string;
		email: string;
		created_at: string;
		email_confirmed_at?: string;
	} | null;
	error?: string | object;
	message?: string;
	requiresVerification?: boolean;
	session?: {
		access_token: string;
		refresh_token?: string;
		expires_at?: number;
	} | null;
}

// Rate limiting storage (in production, use Redis)
const authAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_AUTH_ATTEMPTS = 5;
const AUTH_LOCKOUT_DURATION = 60 * 60 * 1000; // 1 hour

// Rate Limiting Functions
export function checkAuthRateLimit(
	identifier: string, // email or IP
	clientIP: string,
	operation: 'signup' | 'activation' | 'login'
): { allowed: boolean; attempts: number; waitTime: number } {
	const key = `${operation}:${identifier}:${clientIP}`;
	const now = Date.now();
	const attempt = authAttempts.get(key);

	if (!attempt) {
		return { allowed: true, attempts: 0, waitTime: 0 };
	}

	// Check if lockout period has expired
	if (now - attempt.lastAttempt > AUTH_LOCKOUT_DURATION) {
		authAttempts.delete(key);
		return { allowed: true, attempts: 0, waitTime: 0 };
	}

	// Check if max attempts exceeded
	if (attempt.count >= MAX_AUTH_ATTEMPTS) {
		const waitTime = AUTH_LOCKOUT_DURATION - (now - attempt.lastAttempt);
		logSecurity('AUTH_RATE_LIMIT_EXCEEDED', {
			operation,
			identifier: dev ? identifier : '[REDACTED]',
			clientIP,
			attempts: attempt.count,
			waitTime
		});
		return { allowed: false, attempts: attempt.count, waitTime };
	}

	return { allowed: true, attempts: attempt.count, waitTime: 0 };
}

export function recordFailedAuthAttempt(
	identifier: string,
	clientIP: string,
	operation: 'signup' | 'activation' | 'login'
): void {
	const key = `${operation}:${identifier}:${clientIP}`;
	const now = Date.now();
	const attempt = authAttempts.get(key);

	if (attempt) {
		attempt.count += 1;
		attempt.lastAttempt = now;
	} else {
		authAttempts.set(key, { count: 1, lastAttempt: now });
	}

	logSecurity('AUTH_ATTEMPT_FAILED_RECORDED', {
		operation,
		identifier: dev ? identifier : '[REDACTED]',
		clientIP,
		attempts: authAttempts.get(key)?.count || 1
	});
}

export function clearFailedAuthAttempts(
	identifier: string,
	clientIP: string,
	operation: 'signup' | 'activation' | 'login'
): void {
	const key = `${operation}:${identifier}:${clientIP}`;
	authAttempts.delete(key);

	logSecurity('AUTH_ATTEMPTS_CLEARED', {
		operation,
		identifier: dev ? identifier : '[REDACTED]',
		clientIP
	});
}

// API Helper Functions
export function sanitizeInput(input: string): string {
	return input.trim().toLowerCase();
}

// Token validation helper
export function validateToken(token: string | null): { isValid: boolean; error?: string } {
	if (!token) {
		return { isValid: false, error: 'No activation token provided' };
	}

	if (token.length < 10) {
		return { isValid: false, error: 'Invalid activation token format' };
	}

	// Basic token format validation (alphanumeric)
	if (!/^[A-Za-z0-9]+$/.test(token)) {
		return { isValid: false, error: 'Invalid activation token format' };
	}

	return { isValid: true };
}

// Utility function to extract error messages from various formats
export function extractErrorMessage(error: string | object | undefined, fallback: string = 'An error occurred'): string {
	if (!error) return fallback;
	
	if (typeof error === 'string') {
		return error;
	}
	
	if (typeof error === 'object') {
		// Handle object errors like { "token": "invalid or expired activation token" }
		const values = Object.values(error);
		if (values.length > 0) {
			return values.join(', ');
		}
	}
	
	return fallback;
}
