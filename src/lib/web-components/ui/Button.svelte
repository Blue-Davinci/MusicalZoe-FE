<!-- Button Component -->
<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		href?: string;
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		class?: string;
		children: any;
		onclick?: () => void;
	}

	let {
		variant = 'primary',
		size = 'md',
		href,
		type = 'button',
		disabled,
		class: className,
		children,
		onclick,
		...restProps
	}: Props = $props();

	const baseClasses =
		'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

	const variants = {
		primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white focus:ring-primary',
		secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary',
		outline: 'border border-border text-foreground hover:bg-muted focus:ring-ring',
		ghost: 'text-foreground hover:bg-muted focus:ring-ring'
	};

	const sizes = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-base',
		lg: 'px-6 py-3 text-lg'
	};

	const classes = cn(baseClasses, variants[variant], sizes[size], className);
</script>

{#if href}
	<a {href} class={classes} {...restProps}>
		{@render children()}
	</a>
{:else}
	<button {type} class={classes} {disabled} {onclick} {...restProps}>
		{@render children()}
	</button>
{/if}
