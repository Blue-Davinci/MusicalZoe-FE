import { logAuth, logError, logSecurity } from './logger';
import { API_BASE_URL } from '$env/static/private';
import type { Cookies } from '@sveltejs/kit';

// Interface for user data structure (matching your API response)
export interface User {
	name: string;
	email: string;
	activated: boolean;
	created_at: string;
	// Optional fields for future expansion
	id?: string;
	first_name?: string;
	last_name?: string;
	role?: string;
}

// Interface for API key structure (matching your API response)
export interface ApiKey {
	token: string;
	expiry: string; // ISO date string
}

// Interface for authentication response (matching your API response)
export interface AuthResponse {
	api_key: ApiKey;
	user: User;
}

// Interface for token validation response
interface TokenValidationResponse {
	success?: boolean;
	user?: User;
	message?: string;
	error?: string;
}

/**
 * Validate bearer token by calling the backend API
 */
export async function validateBearerToken(token: string): Promise<User | null> {
	try {
		if (!API_BASE_URL) {
			logError('MISSING_API_CONFIG', {
				message: 'API_BASE_URL not configured for token validation'
			});
			return null;
		}

		const response = await fetch(`${API_BASE_URL}/auth/validate`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			logSecurity('TOKEN_VALIDATION_FAILED', {
				status: response.status,
				statusText: response.statusText,
				timestamp: new Date().toISOString()
			});
			return null;
		}

		const result: TokenValidationResponse = await response.json();

		// Check if the API returned user data directly or wrapped in a response
		let user: User | null = null;

		if (result.user) {
			user = result.user;
		} else if (result && typeof result === 'object' && 'email' in result && 'name' in result) {
			user = result as User;
		}

		if (user) {
			logAuth('TOKEN_VALIDATED', {
				userEmail: user.email,
				userName: user.name,
				timestamp: new Date().toISOString()
			});
			return user;
		}

		logSecurity('TOKEN_VALIDATION_REJECTED', {
			reason: result.message || result.error || 'No user data returned',
			timestamp: new Date().toISOString()
		});

		return null;
	} catch (err) {
		logError('TOKEN_VALIDATION_ERROR', {
			error: err instanceof Error ? err.message : 'Unknown error',
			stack: err instanceof Error ? err.stack : undefined,
			timestamp: new Date().toISOString()
		});
		return null;
	}
}

/**
 * Check if bearer token is expired based on the expiry date stored in cookies
 */
export function isBearerTokenExpired(expiryString: string): boolean {
	try {
		const expiryDate = new Date(expiryString);
		const currentTime = new Date();
		return expiryDate <= currentTime;
	} catch (err) {
		logError('TOKEN_EXPIRY_CHECK_ERROR', {
			error: err instanceof Error ? err.message : 'Unknown error',
			expiryString,
			timestamp: new Date().toISOString()
		});
		return true; // Assume expired on error
	}
}

/**
 * Helper function to get the current bearer token from cookies
 */
export function getBearerToken(cookies: Cookies): string | null {
	return cookies.get('bearer_token') || null;
}

/**
 * Helper function to get the token expiry from cookies
 */
export function getTokenExpiry(cookies: Cookies): string | null {
	return cookies.get('token_expiry') || null;
}

/**
 * Helper function to clear all authentication cookies
 */
export function clearAuthCookies(cookies: Cookies): void {
	cookies.delete('bearer_token', { path: '/' });
	cookies.delete('token_expiry', { path: '/' });
	cookies.delete('user_data', { path: '/' });
	cookies.delete('remember_me', { path: '/' });
}
