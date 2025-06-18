import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getBearerToken } from '$lib/utils/token-helpers';
import { logAuth, logError, generateErrorId } from '$lib/utils/logger';
import { MUSIC_API_TRENDS_URL } from '$env/static/private';

export const GET: RequestHandler = async ({ cookies, url }) => {
	const startTime = Date.now();

	try {
		// Extract authentication token
		const bearerToken = getBearerToken(cookies);

		if (!bearerToken) {
			logAuth('TRENDS_API_NO_TOKEN', {
				timestamp: new Date().toISOString()
			});

			return json({ error: 'Authentication required' }, { status: 401 });
		}

		// Extract query parameters
		const limit = url.searchParams.get('limit') || '50';
		const period = url.searchParams.get('period') || '';
		const type = url.searchParams.get('type') || 'tracks';

		// Build API URL
		const apiUrl = new URL(MUSIC_API_TRENDS_URL);
		apiUrl.searchParams.set('limit', limit);
		apiUrl.searchParams.set('type', type);
		if (period) {
			apiUrl.searchParams.set('period', period);
		}

		logAuth('TRENDS_API_REQUEST', {
			url: apiUrl.toString(),
			limit,
			period,
			type
		});

		// Make API request
		const response = await fetch(apiUrl.toString(), {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${bearerToken}`,
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});

		const data = await response.json();

		if (!response.ok) {
			logError('TRENDS_API_ERROR', {
				status: response.status,
				statusText: response.statusText,
				error: data.error || 'Unknown error',
				duration: Date.now() - startTime
			});

			return json(
				{ error: data.error || 'Failed to fetch music trends' },
				{ status: response.status }
			);
		}

		logAuth('TRENDS_API_SUCCESS', {
			itemsCount: data.trends?.tracks?.track?.length || data.trends?.artists?.artist?.length || 0,
			type,
			period,
			duration: Date.now() - startTime
		});

		return json(data);
	} catch (error) {
		const errorId = generateErrorId();

		logError('TRENDS_API_UNEXPECTED_ERROR', {
			errorId,
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			duration: Date.now() - startTime
		});

		return json({ error: 'An unexpected error occurred while fetching trends' }, { status: 500 });
	}
};
