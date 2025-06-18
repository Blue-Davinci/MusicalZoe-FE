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

<Card class="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 {className}">
	<div class="p-6">
		<!-- Header -->
		<div class="flex items-start justify-between">
			<div class="flex items-center space-x-3">
				<div class="p-3 rounded-lg bg-gradient-to-br {color}">
					<Icon class="h-6 w-6 text-white" />
				</div>
				<div>
					<h3 class="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
						{title}
					</h3>
					<p class="text-sm text-muted-foreground mt-1">
						{description}
					</p>
				</div>
			</div>
		</div>

		<!-- Stats -->
		{#if stats.length > 0}
			<div class="mt-6 grid grid-cols-2 gap-4">
				{#each stats as stat}
					<div class="text-center p-3 rounded-md bg-muted/30">
						<div class="text-lg font-bold text-foreground">
							{#if loading}
								<div class="h-5 w-12 bg-muted rounded animate-pulse mx-auto"></div>
							{:else}
								{stat.value}
							{/if}
						</div>
						<div class="text-xs text-muted-foreground mt-1">
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
					class="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
					disabled={loading}
				>
					{#if loading}
						<div class="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
						Loading...
					{:else}
						Explore {title}
					{/if}
				</Button>
			</div>
		{/if}

		<!-- Loading Overlay -->
		{#if loading}
			<div class="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
				<div class="text-center">
					<div class="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
					<p class="text-sm text-muted-foreground mt-2">Loading...</p>
				</div>
			</div>
		{/if}
	</div>
</Card>
