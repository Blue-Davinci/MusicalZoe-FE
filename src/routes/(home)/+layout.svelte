<script lang="ts">
	import Header from '$lib/web-components/ui/Header.svelte';

	let { children } = $props();
</script>

<Header />
{@render children()}
