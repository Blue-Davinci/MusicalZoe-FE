<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { setContext } from 'svelte';
	import type { LayoutData } from './$types';

	let { children, data }: { children: any; data: LayoutData } = $props();

	// Set authentication context for child components using a getter function
	// This ensures the context stays reactive to data changes
	setContext('auth', () => ({
		user: data.user,
		isAuthenticated: data.isAuthenticated,
		isAdmin: data.isAdmin,
		isVerified: data.isVerified
	}));
</script>

<ModeWatcher />
{@render children()}
