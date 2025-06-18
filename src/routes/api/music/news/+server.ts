import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getBearerToken } from '$lib/utils/token-helpers';
import { logAuth, logError, generateErrorId } from '$lib/utils/logger';
import { MUSIC_API_NEWS_URL } from '$env/static/private';

export const GET: RequestHandler = async ({ cookies, url }) => {
	const startTime = Date.now();

	try {
		// Extract authentication token
		const bearerToken = getBearerToken(cookies);

		if (!bearerToken) {
			logAuth('NEWS_API_NO_TOKEN', {
				timestamp: new Date().toISOString()
			});

			return json({ error: 'Authentication required' }, { status: 401 });
		}

		// Extract query parameters
		const limit = url.searchParams.get('limit') || '20';
		const country = url.searchParams.get('country') || 'us';
		const type = url.searchParams.get('type') || 'everything';
		const genre = url.searchParams.get('genre') || '';

		// Build API URL
		const apiUrl = new URL(MUSIC_API_NEWS_URL);
		apiUrl.searchParams.set('limit', limit);
		apiUrl.searchParams.set('country', country);
		apiUrl.searchParams.set('type', type);
		if (genre) {
			apiUrl.searchParams.set('genre', genre);
		}

		logAuth('NEWS_API_REQUEST', {
			url: apiUrl.toString(),
			limit,
			country,
			type,
			genre
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
			logError('NEWS_API_ERROR', {
				status: response.status,
				statusText: response.statusText,
				error: data.error || 'Unknown error',
				duration: Date.now() - startTime
			});

			return json(
				{ error: data.error || 'Failed to fetch music news' },
				{ status: response.status }
			);
		}

		logAuth('NEWS_API_SUCCESS', {
			articlesCount: data.news?.articles?.length || 0,
			totalResults: data.news?.totalResults || 0,
			duration: Date.now() - startTime
		});

		return json(data);
	} catch (error) {
		const errorId = generateErrorId();

		logError('NEWS_API_UNEXPECTED_ERROR', {
			errorId,
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			duration: Date.now() - startTime
		});

		return json({ error: 'An unexpected error occurred while fetching news' }, { status: 500 });
	}
};
