<script lang="ts">
	import { TrendingUp, Play, Users, Clock, ChevronRight } from 'lucide-svelte';
	import Card from '../ui/Card.svelte';
	import Button from '../ui/Button.svelte';
	import type { MusicTrendsResponse, Track, Artist, ApiError } from '$lib/types/music-api';

	interface Props {
		type?: 'tracks' | 'artists';
		period?: '' | '7day' | '1month' | '3month' | '6month' | '12month' | 'overall';
		limit?: number;
		autoLoad?: boolean;
	}

	let { type = 'tracks', period = '7day', limit = 10, autoLoad = true }: Props = $props();

	let loading = $state(false);
	let data = $state<MusicTrendsResponse | null>(null);
	let error = $state<string | null>(null);

	const periodLabels = {
		'': 'All Time',
		'7day': 'Last 7 Days',
		'1month': 'Last Month',
		'3month': 'Last 3 Months',
		'6month': 'Last 6 Months',
		'12month': 'Last Year',
		overall: 'Overall'
	};

	async function loadTrends() {
		loading = true;
		error = null;

		try {
			const params = new URLSearchParams({
				type,
				limit: limit.toString()
			});

			if (period) {
				params.set('period', period);
			}

			const response = await fetch(`/api/music/trends?${params}`);
			const result = await response.json();

			if (!response.ok) {
				error = (result as ApiError).error || 'Failed to fetch trends';
				return;
			}

			data = result as MusicTrendsResponse;
		} catch (err) {
			error = 'An unexpected error occurred';
			console.error('Trends error:', err);
		} finally {
			loading = false;
		}
	}

	// Auto-load on mount if enabled
	$effect(() => {
		if (autoLoad) {
			loadTrends();
		}
	});

	function formatNumber(num: string): string {
		const number = parseInt(num);
		if (number >= 1000000) {
			return `${(number / 1000000).toFixed(1)}M`;
		} else if (number >= 1000) {
			return `${(number / 1000).toFixed(1)}K`;
		}
		return number.toString();
	}

	function formatDuration(seconds: string): string {
		const secs = parseInt(seconds);
		const minutes = Math.floor(secs / 60);
		const remainingSecs = secs % 60;
		return `${minutes}:${remainingSecs.toString().padStart(2, '0')}`;
	}

	function getImageUrl(images: any[], size: 'small' | 'medium' | 'large' = 'medium'): string {
		const image = images?.find((img) => img.size === size) || images?.[0];
		return image?.['#text'] || '/placeholder-album.png';
	}

	const items = $derived(
		type === 'tracks' ? data?.trends?.tracks?.track || [] : data?.trends?.artists?.artist || []
	);
</script>

<Card class="overflow-hidden">
	<div class="p-6">
		<!-- Header -->
		<div class="mb-6 flex items-center justify-between">
			<div class="flex items-center space-x-3">
				<div class="rounded-lg bg-gradient-to-br from-green-500 to-teal-500 p-2">
					<TrendingUp class="h-5 w-5 text-white" />
				</div>
				<div>
					<h3 class="text-foreground text-lg font-semibold">
						Trending {type === 'tracks' ? 'Tracks' : 'Artists'}
					</h3>
					<p class="text-muted-foreground text-sm">
						{periodLabels[period]} • Top {limit}
					</p>
				</div>
			</div>

			<div class="flex items-center space-x-2">
				<!-- Period Selector -->
				<select
					bind:value={period}
					onchange={loadTrends}
					disabled={loading}
					class="border-border bg-background text-foreground focus:ring-primary rounded-md border px-2 py-1 text-sm focus:ring-2 focus:outline-none"
				>
					<option value="">All Time</option>
					<option value="7day">Last 7 Days</option>
					<option value="1month">Last Month</option>
					<option value="3month">Last 3 Months</option>
					<option value="6month">Last 6 Months</option>
					<option value="12month">Last Year</option>
					<option value="overall">Overall</option>
				</select>

				<!-- Type Toggle -->
				<div class="border-border flex overflow-hidden rounded-md border">
					<button
						onclick={() => {
							type = 'tracks';
							loadTrends();
						}}
						class="px-3 py-1 text-sm {type === 'tracks'
							? 'bg-primary text-primary-foreground'
							: 'bg-background text-muted-foreground hover:text-foreground'} transition-colors"
						disabled={loading}
					>
						Tracks
					</button>
					<button
						onclick={() => {
							type = 'artists';
							loadTrends();
						}}
						class="px-3 py-1 text-sm {type === 'artists'
							? 'bg-primary text-primary-foreground'
							: 'bg-background text-muted-foreground hover:text-foreground'} transition-colors"
						disabled={loading}
					>
						Artists
					</button>
				</div>
			</div>
		</div>

		<!-- Loading State -->
		{#if loading}
			<div class="space-y-3">
				{#each Array(5) as _}
					<div class="flex animate-pulse items-center space-x-3">
						<div class="bg-muted h-12 w-12 rounded-md"></div>
						<div class="flex-1">
							<div class="bg-muted mb-2 h-4 w-3/4 rounded"></div>
							<div class="bg-muted h-3 w-1/2 rounded"></div>
						</div>
						<div class="bg-muted h-3 w-16 rounded"></div>
					</div>
				{/each}
			</div>
		{/if}

		<!-- Error State -->
		{#if error}
			<div class="py-8 text-center">
				<div class="bg-destructive/10 border-destructive/20 rounded-md border p-3">
					<p class="text-destructive text-sm">{error}</p>
				</div>
				<Button variant="outline" onclick={loadTrends} class="mt-4">Try Again</Button>
			</div>
		{/if}

		<!-- Trends List -->
		{#if data && items.length > 0 && !loading}
			<div class="space-y-3">
				{#each items.slice(0, limit) as item, index}
					{@const track = item as Track}
					{@const artist = item as Artist}

					<div
						class="hover:bg-muted/50 group flex cursor-pointer items-center space-x-3 rounded-lg p-3 transition-colors"
					>
						<!-- Rank -->
						<div class="w-6 text-center">
							<span class="text-muted-foreground text-sm font-medium">
								{index + 1}
							</span>
						</div>

						<!-- Image -->
						<div class="relative">
							<img
								src={getImageUrl(item.image)}
								alt={type === 'tracks' ? track.name : artist.name}
								class="h-12 w-12 rounded-md object-cover"
								loading="lazy"
							/>
							{#if type === 'tracks'}
								<div
									class="absolute inset-0 flex items-center justify-center rounded-md bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
								>
									<Play class="h-4 w-4 text-white" />
								</div>
							{/if}
						</div>

						<!-- Content -->
						<div class="min-w-0 flex-1">
							<h4
								class="text-foreground group-hover:text-primary truncate text-sm font-medium transition-colors"
							>
								{type === 'tracks' ? track.name : artist.name}
							</h4>
							<p class="text-muted-foreground truncate text-xs">
								{type === 'tracks'
									? track.artist.name
									: `${formatNumber(artist.listeners)} listeners`}
							</p>
						</div>

						<!-- Stats -->
						<div class="text-right">
							<div class="text-muted-foreground flex items-center space-x-2 text-xs">
								{#if type === 'tracks'}
									<div class="flex items-center space-x-1">
										<Users class="h-3 w-3" />
										<span>{formatNumber(track.listeners)}</span>
									</div>
									{#if track.duration}
										<div class="flex items-center space-x-1">
											<Clock class="h-3 w-3" />
											<span>{formatDuration(track.duration)}</span>
										</div>
									{/if}
								{:else}
									<div class="flex items-center space-x-1">
										<TrendingUp class="h-3 w-3" />
										<span>{formatNumber(artist.playcount)}</span>
									</div>
								{/if}
							</div>
						</div>

						<!-- Arrow -->
						<ChevronRight
							class="text-muted-foreground h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100"
						/>
					</div>
				{/each}
			</div>

			<!-- View More Button -->
			<div class="mt-6 text-center">
				<Button
					variant="outline"
					href="/dashboard/trends?type={type}&period={period}"
					class="w-full"
				>
					View All Trending {type === 'tracks' ? 'Tracks' : 'Artists'}
				</Button>
			</div>
		{/if}

		<!-- Empty State -->
		{#if data && items.length === 0 && !loading && !error}
			<div class="py-8 text-center">
				<TrendingUp class="text-muted-foreground mx-auto mb-4 h-12 w-12" />
				<p class="text-muted-foreground">No trending {type} found for this period.</p>
				<Button variant="outline" onclick={loadTrends} class="mt-4">Refresh</Button>
			</div>
		{/if}
	</div>
</Card>
