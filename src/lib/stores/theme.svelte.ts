import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

class ThemeManager {
	currentTheme = $state<Theme>('light');

	constructor() {
		if (browser) {
			// Initialize theme from localStorage or system preference
			const stored = localStorage.getItem('theme') as Theme | null;
			const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			
			this.currentTheme = stored || (systemPrefersDark ? 'dark' : 'light');
			this.applyTheme();
			
			// Listen for system theme changes
			window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
				if (!localStorage.getItem('theme')) {
					this.currentTheme = e.matches ? 'dark' : 'light';
					this.applyTheme();
				}
			});
		}
	}

	private applyTheme() {
		if (browser) {
			const root = document.documentElement;
			if (this.currentTheme === 'dark') {
				root.classList.add('dark');
			} else {
				root.classList.remove('dark');
			}
		}
	}

	toggleTheme() {
		this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
		this.applyTheme();
		
		if (browser) {
			localStorage.setItem('theme', this.currentTheme);
		}
	}

	setTheme(theme: Theme) {
		this.currentTheme = theme;
		this.applyTheme();
		
		if (browser) {
			localStorage.setItem('theme', theme);
		}
	}
}

export const themeManager = new ThemeManager();
