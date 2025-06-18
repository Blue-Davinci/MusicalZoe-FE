<script lang="ts">
	import Header from '$lib/web-components/ui/Header.svelte';
	import { getContext } from 'svelte';
	import type { User } from '$lib/utils/token-helpers';

	let { children } = $props();

	// Get authentication context
	const auth = getContext<{
		user: User | null;
		isAuthenticated: boolean;
		isAdmin: boolean;
		isVerified: boolean;
	}>('auth');
</script>

<Header 
	user={auth?.user} 
	isAuthenticated={auth?.isAuthenticated ?? false} 
	isAdmin={auth?.isAdmin ?? false} 
/>

<main class="min-h-screen bg-background">
	{@render children()}
</main>