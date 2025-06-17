/**
 * Format date to a readable format
 */
export function formatDate(date: string | Date): string {
	const dateObj = typeof date === 'string' ? new Date(date) : date;
	return dateObj.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

/**
 * Format number with commas
 */
export function formatNumber(num: number | string): string {
	const number = typeof num === 'string' ? parseInt(num) : num;
	return number.toLocaleString();
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, length: number): string {
	if (text.length <= length) return text;
	return text.slice(0, length) + '...';
}
