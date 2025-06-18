<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from './Button.svelte';
	import { LogOut } from 'lucide-svelte';

	let {
		variant = 'ghost',
		size = 'md',
		showIcon = true,
		showText = true
	}: {
		variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		showIcon?: boolean;
		showText?: boolean;
	} = $props();

	let isLoggingOut = $state(false);
</script>

<form
	method="POST"
	action="/logout"
	use:enhance={() => {
		isLoggingOut = true;
		return async ({ update }) => {
			await update();
			isLoggingOut = false;
		};
	}}
>
	<Button type="submit" {variant} {size} disabled={isLoggingOut} class="flex items-center gap-2">
		{#if showIcon}
			<LogOut class="h-4 w-4" />
		{/if}
		{#if showText}
			{isLoggingOut ? 'Logging out...' : 'Logout'}
		{/if}
	</Button>
</form>
