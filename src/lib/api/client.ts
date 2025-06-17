import { env } from '$env/dynamic/public';
import type {
	HealthResponse,
	NewsResponse,
	TrendsResponse,
	LyricsResponse,
	LyricsRawResponse,
	TrackInfoResponse,
	ApiError,
	NewsParams,
	TrendsParams,
	LyricsParams,
	TrackInfoParams
} from './types.js';

export class ApiClient {
	private baseUrl: string;

	constructor(baseUrl?: string) {
		this.baseUrl = baseUrl || env.VITE_API_BASE_URL || 'http://localhost:4000/v1';
	}

	private async makeRequest<T>(
		endpoint: string,
		params?: Record<string, string | number | boolean>,
		authToken?: string
	): Promise<T> {
		const url = new URL(`${this.baseUrl}${endpoint}`);
		
		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					url.searchParams.append(key, String(value));
				}
			});
		}

		const headers: Record<string, string> = {
			'Content-Type': 'application/json'
		};

		// Add auth header for all endpoints except health
		if (endpoint !== '/health') {
			headers['Authorization'] = `Bearer ${this.authToken}`;
		}

		try {
			const response = await fetch(url.toString(), {
				method: 'GET',
				headers
			});

			if (!response.ok) {
				const error: ApiError = await response.json();
				throw new Error(error.error || `HTTP error! status: ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			}
			throw new Error('An unexpected error occurred');
		}
	}

	async health(): Promise<HealthResponse> {
		return this.makeRequest<HealthResponse>('/health');
	}

	async getNews(params?: NewsParams): Promise<NewsResponse> {
		return this.makeRequest<NewsResponse>('/musical/news', params as unknown as Record<string, string | number | boolean>);
	}

	async getTrends(params?: TrendsParams): Promise<TrendsResponse> {
		return this.makeRequest<TrendsResponse>('/musical/trends', params as unknown as Record<string, string | number | boolean>);
	}

	async getLyrics(params: LyricsParams): Promise<LyricsResponse | LyricsRawResponse> {
		if (params.format === 'raw') {
			return this.makeRequest<LyricsRawResponse>('/musical/lyrics', params as unknown as Record<string, string | number | boolean>);
		}
		return this.makeRequest<LyricsResponse>('/musical/lyrics', params as unknown as Record<string, string | number | boolean>);
	}

	async getTrackInfo(params: TrackInfoParams): Promise<TrackInfoResponse> {
		return this.makeRequest<TrackInfoResponse>('/musical/track-info', params as unknown as Record<string, string | number | boolean>);
	}
}

// Export a singleton instance
export const apiClient = new ApiClient();
