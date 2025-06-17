import { browser } from '$app/environment';

export type Theme = 'light' | 'dark' | 'auto';

class ThemeManager {
	private _theme = $state<Theme>('auto');
	private _resolvedTheme = $state<'light' | 'dark'>('light');
	private storageKey = 'musical-zoe-theme';

	constructor() {
		if (browser) {
			this.initializeTheme();
			this.watchSystemTheme();
		}
	}

	private initializeTheme() {
		// Get saved theme from localStorage or default to 'auto'
		const savedTheme = localStorage.getItem(this.storageKey) as Theme | null;
		this._theme = savedTheme || 'auto';
		this.applyTheme();
	}

	private watchSystemTheme() {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		mediaQuery.addEventListener('change', () => {
			if (this._theme === 'auto') {
				this.applyTheme();
			}
		});
	}

	private applyTheme() {
		const isDark = this._theme === 'dark' || 
			(this._theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
		
		this._resolvedTheme = isDark ? 'dark' : 'light';
		
		// Apply theme using data-theme attribute for CSS variables
		document.documentElement.setAttribute('data-theme', this._resolvedTheme);
		
		// Also add class for Tailwind compatibility
		if (isDark) {
			document.documentElement.classList.add('dark');
			document.documentElement.classList.remove('light');
		} else {
			document.documentElement.classList.add('light');
			document.documentElement.classList.remove('dark');
		}
	}

	// Getters
	get theme() {
		return this._theme;
	}

	get resolvedTheme() {
		return this._resolvedTheme;
	}

	get isDark() {
		return this._resolvedTheme === 'dark';
	}

	get isLight() {
		return this._resolvedTheme === 'light';
	}

	// Actions
	setTheme(newTheme: Theme) {
		this._theme = newTheme;
		if (browser) {
			localStorage.setItem(this.storageKey, newTheme);
			this.applyTheme();
		}
	}

	toggleTheme() {
		const newTheme = this._resolvedTheme === 'light' ? 'dark' : 'light';
		this.setTheme(newTheme);
	}

	// Musical-themed methods for future enhancements
	setVibeMode(vibe: 'chill' | 'energetic' | 'ambient') {
		switch (vibe) {
			case 'chill':
				this.setTheme('light');
				break;
			case 'energetic': 
				this.setTheme('dark');
				break;
			case 'ambient':
				this.setTheme('auto');
				break;
		}
	}
}

// Export singleton instance
export const themeManager = new ThemeManager();
