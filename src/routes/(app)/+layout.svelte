<script lang="ts">
	import Header from '$lib/web-components/ui/Header.svelte';
	import { getContext } from 'svelte';
	import type { User } from '$lib/utils/token-helpers';

	let { children } = $props();

	// Get authentication context function
	const getAuth = getContext<
		() => {
			user: User | null;
			isAuthenticated: boolean;
			isAdmin: boolean;
			isVerified: boolean;
		}
	>('auth');

	// Create reactive auth data using $derived
	const auth = $derived(getAuth());
</script>

<Header
	user={auth.user}
	isAuthenticated={auth.isAuthenticated}
	isAdmin={auth.isAdmin}
	variant="dashboard"
/>

<main class="bg-background min-h-screen">
	{@render children()}
</main>
