import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getBearerToken } from '$lib/utils/token-helpers';
import { logAuth, logError, generateErrorId } from '$lib/utils/logger';
import { MUSIC_API_LYRICS_URL } from '$env/static/private';

export const GET: RequestHandler = async ({ cookies, url }) => {
	const startTime = Date.now();

	try {
		// Extract authentication token
		const bearerToken = getBearerToken(cookies);

		if (!bearerToken) {
			logAuth('LYRICS_API_NO_TOKEN', {
				timestamp: new Date().toISOString()
			});

			return json({ error: 'Authentication required' }, { status: 401 });
		}

		// Extract query parameters
		const artist = url.searchParams.get('artist');
		const title = url.searchParams.get('title');
		const song = url.searchParams.get('song');
		const metadata = url.searchParams.get('metadata') === 'true';
		const format = url.searchParams.get('format') || 'processed';

		// Validate required parameters
		if (!artist) {
			return json({ error: 'Artist parameter is required' }, { status: 400 });
		}

		if (!title && !song) {
			return json({ error: 'Title or song parameter is required' }, { status: 400 });
		}

		// Build API URL
		const apiUrl = new URL(MUSIC_API_LYRICS_URL);
		apiUrl.searchParams.set('artist', artist);
		if (title) {
			apiUrl.searchParams.set('title', title);
		} else if (song) {
			apiUrl.searchParams.set('song', song);
		}
		apiUrl.searchParams.set('metadata', metadata.toString());
		apiUrl.searchParams.set('format', format);

		logAuth('LYRICS_API_REQUEST', {
			url: apiUrl.toString(),
			artist,
			title: title || song,
			metadata,
			format
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
			logError('LYRICS_API_ERROR', {
				status: response.status,
				statusText: response.statusText,
				error: data.error || 'Unknown error',
				artist,
				title: title || song,
				duration: Date.now() - startTime
			});

			return json({ error: data.error || 'Failed to fetch lyrics' }, { status: response.status });
		}

		logAuth('LYRICS_API_SUCCESS', {
			artist,
			title: title || song,
			hasLyrics: !!data.lyrics?.lyrics,
			hasMetadata: !!data.lyrics?.metadata,
			wordCount: data.lyrics?.word_count || 0,
			duration: Date.now() - startTime
		});

		return json(data);
	} catch (error) {
		const errorId = generateErrorId();

		logError('LYRICS_API_UNEXPECTED_ERROR', {
			errorId,
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			duration: Date.now() - startTime
		});

		return json({ error: 'An unexpected error occurred while fetching lyrics' }, { status: 500 });
	}
};
