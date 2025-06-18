<!-- BackButton Component -->
<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { cn } from '$lib/utils';

	interface Props {
		href?: string;
		class?: string;
		variant?: 'default' | 'ghost' | 'minimal';
		size?: 'sm' | 'md' | 'lg';
		text?: string;
	}

	let {
		href,
		class: className,
		variant = 'ghost',
		size = 'md',
		text = 'Go Back',
		...restProps
	}: Props = $props();

	function handleBack() {
		if (href) {
			goto(href);
		} else {
			// Go back in browser history
			history.back();
		}
	}

	const variants = {
		default: 'bg-muted hover:bg-muted/80 text-foreground',
		ghost: 'hover:bg-muted/50 text-muted-foreground hover:text-foreground',
		minimal: 'text-muted-foreground hover:text-foreground'
	};

	const sizes = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-base',
		lg: 'px-6 py-3 text-lg'
	};

	const iconSizes = {
		sm: 'w-4 h-4',
		md: 'w-5 h-5',
		lg: 'w-6 h-6'
	};

	const classes = cn(
		'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
		variants[variant],
		sizes[size],
		className
	);
</script>

<button onclick={handleBack} class={classes} aria-label="Go back to previous page" {...restProps}>
	<ArrowLeft class={cn(iconSizes[size], 'mr-2')} />
	{text}
</button>
