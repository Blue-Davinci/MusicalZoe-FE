<script lang="ts">
	import Card from './Card.svelte';
	import Button from './Button.svelte';
	import type { ComponentType } from 'svelte';

	interface Props {
		title: string;
		description: string;
		icon: ComponentType;
		href?: string;
		color: string;
		stats?: {
			label: string;
			value: string | number;
		}[];
		loading?: boolean;
		class?: string;
	}

	let {
		title,
		description,
		icon: Icon,
		href,
		color,
		stats = [],
		loading = false,
		class: className = ''
	}: Props = $props();
</script>

<Card class="group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg {className}">
	<div class="p-6">
		<!-- Header -->
		<div class="flex items-start justify-between">
			<div class="flex items-center space-x-3">
				<div class="rounded-lg bg-gradient-to-br p-3 {color}">
					<Icon class="h-6 w-6 text-white" />
				</div>
				<div>
					<h3
						class="text-foreground group-hover:text-primary text-lg font-semibold transition-colors"
					>
						{title}
					</h3>
					<p class="text-muted-foreground mt-1 text-sm">
						{description}
					</p>
				</div>
			</div>
		</div>

		<!-- Stats -->
		{#if stats.length > 0}
			<div class="mt-6 grid grid-cols-2 gap-4">
				{#each stats as stat}
					<div class="bg-muted/30 rounded-md p-3 text-center">
						<div class="text-foreground text-lg font-bold">
							{#if loading}
								<div class="bg-muted mx-auto h-5 w-12 animate-pulse rounded"></div>
							{:else}
								{stat.value}
							{/if}
						</div>
						<div class="text-muted-foreground mt-1 text-xs">
							{stat.label}
						</div>
					</div>
				{/each}
			</div>
		{/if}

		<!-- Action Button -->
		{#if href}
			<div class="mt-6">
				<Button
					variant="outline"
					{href}
					class="group-hover:bg-primary group-hover:text-primary-foreground w-full transition-colors"
					disabled={loading}
				>
					{#if loading}
						<div
							class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
						></div>
						Loading...
					{:else}
						Explore {title}
					{/if}
				</Button>
			</div>
		{/if}

		<!-- Loading Overlay -->
		{#if loading}
			<div
				class="bg-background/50 absolute inset-0 flex items-center justify-center rounded-lg backdrop-blur-sm"
			>
				<div class="text-center">
					<div
						class="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
					></div>
					<p class="text-muted-foreground mt-2 text-sm">Loading...</p>
				</div>
			</div>
		{/if}
	</div>
</Card>
