// Simple dark mode toggle using vanilla JS and DOM manipulation
import { browser } from '$app/environment';

let isDark = false;

// Initialize theme
export function initTheme(): boolean {
  if (!browser) return false;
  
  const stored = localStorage.getItem('theme');
  if (stored) {
    isDark = stored === 'dark';
  } else {
    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  
  applyTheme();
  return isDark;
}

// Apply theme to document
function applyTheme() {
  if (!browser) return;
  
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// Toggle function
export function toggleTheme() {
  isDark = !isDark;
  applyTheme();
  
  if (browser) {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
  
  // Trigger custom event to notify components
  if (browser && window) {
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: { isDark } }));
  }
  
  return isDark;
}

// Getter for current theme state
export function getIsDark() {
  return isDark;
}
