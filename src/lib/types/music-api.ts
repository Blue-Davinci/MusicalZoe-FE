import type { ComponentType } from 'svelte';

// Musical Zoe API Response Types
export interface MusicNewsResponse {
	news: {
		status: string;
		totalResults: number;
		articles: NewsArticle[];
	};
}

export interface NewsArticle {
	source: {
		id: string;
		name: string;
	};
	author: string;
	title: string;
	description: string;
	url: string;
	urlToImage: string;
	publishedAt: string;
	content: string;
}

export interface MusicTrendsResponse {
	trends: {
		tracks?: {
			track: Track[];
		};
		artists?: {
			artist: Artist[];
		};
	};
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
	artist: {
		name: string;
		mbid: string;
		url: string;
	};
	image: LastFmImage[];
}

export interface Artist {
	name: string;
	playcount: string;
	listeners: string;
	mbid: string;
	url: string;
	image: LastFmImage[];
}

export interface LastFmImage {
	'#text': string;
	size: 'small' | 'medium' | 'large';
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
		metadata?: TrackMetadata;
	};
}

export interface TrackInfoResponse {
	track_info: {
		artist: string;
		title: string;
		lastfm: TrackMetadata;
		has_lyrics: boolean;
		status: string;
		sources: string[];
		lyrics_url: string;
	};
}

export interface TrackMetadata {
	duration: string;
	playcount: string;
	listeners: string;
	url: string;
	album: string;
	images: LastFmImage[];
	tags: string[];
	summary: string;
}

export interface ApiError {
	error: string;
}

// Dashboard Component Props
export interface MusicServiceCard {
	title: string;
	description: string;
	icon: ComponentType; // Svelte component type
	href: string;
	color: string;
	stats?: {
		label: string;
		value: string | number;
	}[];
}

// Form types for search
export interface LyricsSearchForm {
	artist: string;
	title: string;
	metadata: boolean;
}

export interface NewsFilterForm {
	limit: number;
	country: string;
	type: 'headlines' | 'everything';
	genre: string;
}

export interface TrendsFilterForm {
	limit: number;
	period: '' | '7day' | '1month' | '3month' | '6month' | '12month' | 'overall';
	type: 'tracks' | 'artists';
}
