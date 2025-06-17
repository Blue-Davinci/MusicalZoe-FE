import { clsx, type ClassValue } from 'clsx';

/**
 * Utility function to merge class names conditionally
 */
export function cn(...inputs: ClassValue[]) {
	return clsx(inputs);
}
