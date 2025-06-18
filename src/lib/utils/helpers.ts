import { clsx, type ClassValue } from 'clsx';

/**
 * Utility function to merge class names conditionally
 */
export function cn(...inputs: ClassValue[]) {
	return clsx(inputs);
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeout: ReturnType<typeof setTimeout>;
	return (...args: Parameters<T>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
}

/**
 * Format duration from seconds to mm:ss format
 */
export function formatDuration(seconds: string | number): string {
	const sec = typeof seconds === 'string' ? parseInt(seconds) : seconds;
	const minutes = Math.floor(sec / 60);
	const remainingSeconds = sec % 60;
	return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Format large numbers (e.g., play counts)
 */
export function formatNumber(num: string | number): string {
	const n = typeof num === 'string' ? parseInt(num) : num;
	if (n >= 1000000) {
		return (n / 1000000).toFixed(1) + 'M';
	}
	if (n >= 1000) {
		return (n / 1000).toFixed(1) + 'K';
	}
	return n.toString();
}

/**
 * Truncate text to a specified length
 */
export function truncateText(text: string, length: number): string {
	if (text.length <= length) return text;
	return text.slice(0, length).trim() + '...';
}

/**
 * Get the best quality image from Last.fm image array
 */
export function getBestImage(images: Array<{ '#text': string; size: string }>): string {
	if (!images || images.length === 0) return '';

	// Try to get large first, then medium, then small
	const large = images.find((img) => img.size === 'large');
	if (large && large['#text']) return large['#text'];

	const medium = images.find((img) => img.size === 'medium');
	if (medium && medium['#text']) return medium['#text'];

	const small = images.find((img) => img.size === 'small');
	if (small && small['#text']) return small['#text'];

	return '';
}

/**
 * Validate if a string is a valid URL
 */
export function isValidUrl(string: string): boolean {
	try {
		new URL(string);
		return true;
	} catch {
		return false;
	}
}

/**
 * Sleep function for delays
 */
export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
