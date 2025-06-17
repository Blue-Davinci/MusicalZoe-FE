// Simple theme management using browser's built-in APIs
import { browser } from '$app/environment';

let isDark = $state(false);

// Initialize theme on page load
if (browser) {
	// Check localStorage first, then system preference
	const saved = localStorage.getItem('darkMode');
	if (saved !== null) {
		isDark = saved === 'true';
	} else {
		isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	}
	
	// Apply initial theme
	updateDOM();
}

function updateDOM() {
	if (!browser) return;
	
	if (isDark) {
		document.documentElement.classList.add('dark');
	} else {
		document.documentElement.classList.remove('dark');
	}
}

export function toggleTheme() {
	isDark = !isDark;
	updateDOM();
	
	if (browser) {
		localStorage.setItem('darkMode', isDark.toString());
	}
}

export function getCurrentTheme() {
	return isDark ? 'dark' : 'light';
}

export { isDark };
