// API Response Types for Musical-Zoe Backend
export interface HealthResponse {
	database: string;
	environment: string;
	status: string;
	version: string;
}

export interface NewsSource {
	id: string | null;
	name: string;
}

export interface NewsArticle {
	source: NewsSource;
	author: string | null;
	title: string;
	description: string | null;
	url: string;
	urlToImage: string | null;
	publishedAt: string;
	content: string | null;
}

export interface NewsResponse {
	news: {
		status: string;
		totalResults: number;
		articles: NewsArticle[];
	};
}

export interface ImageData {
	'#text': string;
	size: 'small' | 'medium' | 'large';
}

export interface TrackArtist {
	name: string;
	mbid: string;
	url: string;
}

export interface Track {
	name: string;
	duration: string;
	playcount: string;
	listeners: string;
	mbid: string;
	url: string;
	streamable: {
		'#text': string;
		fulltrack: string;
	};
	artist: TrackArtist;
	image: ImageData[];
}

export interface Artist {
	name: string;
	playcount: string;
	listeners: string;
	mbid: string;
	url: string;
	image: ImageData[];
}

export interface TrendsResponse {
	trends: {
		tracks?: {
			track: Track[];
		};
		artists?: {
			artist: Artist[];
		};
	};
}

export interface LyricsMetadata {
	duration: string;
	playcount: string;
	listeners: string;
	url: string;
	album: string;
	images: ImageData[];
	tags: string[];
	summary: string;
}

export interface LyricsResponse {
	lyrics: {
		artist: string;
		title: string;
		lyrics: string;
		cleaned_lyrics: string[];
		lines_count: number;
		verses_count: number;
		has_chorus: boolean;
		word_count: number;
		source: string;
		status: string;
		metadata?: LyricsMetadata;
	};
}

export interface LyricsRawResponse {
	artist: string;
	title: string;
	lyrics: string;
	source: string;
}

export interface TrackInfoResponse {
	track_info: {
		artist: string;
		title: string;
		lastfm: LyricsMetadata;
		has_lyrics: boolean;
		status: string;
		sources: string[];
		lyrics_url: string;
	};
}

export interface ApiError {
	error: string;
}

// Request parameter types
export interface NewsParams {
	limit?: number;
	country?: string;
	type?: 'headlines' | 'everything';
	genre?: string;
}

export interface TrendsParams {
	limit?: number;
	period?: '7day' | '1month' | '3month' | '6month' | '12month' | 'overall';
	type?: 'tracks' | 'artists';
}

export interface LyricsParams {
	artist: string;
	title?: string;
	song?: string;
	metadata?: boolean;
	format?: 'processed' | 'raw';
}

export interface TrackInfoParams {
	artist: string;
	title?: string;
	song?: string;
}
