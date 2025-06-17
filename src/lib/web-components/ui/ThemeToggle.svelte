<!-- Theme Toggle Component -->
<script lang="ts">
	import { Sun, Moon } from 'lucide-svelte';
	import { themeManager } from '$lib/stores/theme.svelte.js';

	function handleToggle() {
		themeManager.toggleTheme();
	}
</script>

<button
	onclick={handleToggle}
	class="inline-flex items-center justify-center p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
	aria-label="Toggle theme"
	title="Switch theme"
>
	{#if themeManager.currentTheme === 'dark'}
		<Sun class="h-5 w-5" />
	{:else}
		<Moon class="h-5 w-5" />
	{/if}
</button>
