// Shared authentication utilities and rate limiting functions

import { logAuth, logError } from './logger';
import { dev } from '$app/environment';

// Rate limiting storage (in production, use Redis)
const attemptStorage = new Map<string, { count: number; lastAttempt: number }>();

export interface RateLimitConfig {
	maxAttempts: number;
	lockoutDuration: number; // in milliseconds
}

export interface RateLimitResult {
	allowed: boolean;
	attempts: number;
	waitTime: number;
}

// Generic rate limiting function
export function checkRateLimit(
	key: string,
	config: RateLimitConfig
): RateLimitResult {
	const now = Date.now();
	const attempt = attemptStorage.get(key);

	if (!attempt) {
		return { allowed: true, attempts: 0, waitTime: 0 };
	}

	// Reset if lockout period has passed
	if (now - attempt.lastAttempt > config.lockoutDuration) {
		attemptStorage.delete(key);
		return { allowed: true, attempts: 0, waitTime: 0 };
	}

	if (attempt.count >= config.maxAttempts) {
		const waitTime = config.lockoutDuration - (now - attempt.lastAttempt);
		return { allowed: false, attempts: attempt.count, waitTime };
	}

	return { allowed: true, attempts: attempt.count, waitTime: 0 };
}

export function recordFailedAttempt(key: string): void {
	const now = Date.now();
	const attempt = attemptStorage.get(key);

	if (!attempt) {
		attemptStorage.set(key, { count: 1, lastAttempt: now });
	} else {
		attemptStorage.set(key, { count: attempt.count + 1, lastAttempt: now });
	}
}

export function clearFailedAttempts(key: string): void {
	attemptStorage.delete(key);
}

// Specific rate limit configurations
export const RATE_LIMITS = {
	SIGNUP: {
		maxAttempts: 3,
		lockoutDuration: 60 * 60 * 1000 // 1 hour
	},
	ACTIVATION: {
		maxAttempts: 5,
		lockoutDuration: 15 * 60 * 1000 // 15 minutes
	},
	LOGIN: {
		maxAttempts: 5,
		lockoutDuration: 30 * 60 * 1000 // 30 minutes
	}
} as const;

// API Response types
export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	message?: string;
	error?: string;
}

export interface ActivationResult {
	success: boolean;
	user?: {
		id: string;
		name: string;
		email: string;
		email_confirmed_at: string;
	};
	error?: string;
	message?: string;
}

// Common API call wrapper with error handling
export async function makeApiCall<T>(
	url: string,
	options: RequestInit,
	context: {
		operation: string;
		email?: string;
		clientIP?: string;
	}
): Promise<ApiResponse<T>> {
	try {
		logAuth(`${context.operation}_API_CALL_START`, {
			url: dev ? url : '[REDACTED]',
			method: options.method || 'GET',
			email: context.email,
			clientIP: context.clientIP
		});

		const response = await fetch(url, options);
		const result = await response.json();

		if (!response.ok) {
			logAuth(`${context.operation}_API_FAILED`, {
				email: context.email,
				clientIP: context.clientIP,
				status: response.status,
				statusText: response.statusText,
				error: result.message || result.error
			});

			return {
				success: false,
				error: result.message || result.error || `${context.operation} failed`
			};
		}

		logAuth(`${context.operation}_API_SUCCESS`, {
			email: context.email,
			clientIP: context.clientIP,
			status: response.status
		});

		return {
			success: true,
			data: result
		};
	} catch (error) {
		logError(`${context.operation}_API_ERROR`, {
			message: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			email: context.email,
			clientIP: context.clientIP
		});

		return {
			success: false,
			error: dev
				? `${context.operation} service error: ${error instanceof Error ? error.message : 'Unknown error'}`
				: `${context.operation} service is temporarily unavailable. Please try again later.`
		};
	}
}

// Token validation helper
export function validateToken(token: string | null): { isValid: boolean; error?: string } {
	if (!token) {
		return { isValid: false, error: 'Activation token is missing' };
	}

	if (token.length < 10) {
		return { isValid: false, error: 'Invalid activation token format' };
	}

	// Basic token format validation (alphanumeric)
	if (!/^[A-Z0-9]+$/i.test(token)) {
		return { isValid: false, error: 'Invalid activation token format' };
	}

	return { isValid: true };
}

// Helper to generate rate limit key
export function generateRateLimitKey(type: string, identifier: string, clientIP: string): string {
	return `${type}:${identifier}:${clientIP}`;
}
