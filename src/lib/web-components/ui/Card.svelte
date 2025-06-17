<!-- Card Component -->
<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		class?: string;
		children: any;
	}

	let { class: className, children, ...restProps }: Props = $props();

	const classes = cn(
		'rounded-xl bg-card p-6 shadow-sm border border-border hover:shadow-md transition-shadow duration-200',
		className
	);
</script>

<div class={classes} {...restProps}>
	{@render children()}
</div>
