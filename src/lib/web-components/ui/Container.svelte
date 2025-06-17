<!-- Container Component -->
<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
		class?: string;
		children: any;
	}

	let { size = 'lg', class: className, children, ...restProps }: Props = $props();

	const sizes = {
		sm: 'max-w-3xl',
		md: 'max-w-5xl',
		lg: 'max-w-7xl',
		xl: 'max-w-[1400px]',
		full: 'max-w-none'
	};

	const classes = cn('mx-auto px-4 sm:px-6 lg:px-8', sizes[size], className);
</script>

<div class={classes} {...restProps}>
	{@render children()}
</div>
