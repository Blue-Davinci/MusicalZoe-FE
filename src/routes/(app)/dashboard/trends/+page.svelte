<script lang="ts">
	import { onMount } from 'svelte';
	import {
		TrendingUp,
		Music,
		User,
		Calendar,
		ExternalLink,
		Search,
		Filter,
		RefreshCw,
		Play,
		Clock,
		BarChart3
	} from 'lucide-svelte';
	import Card from '$lib/web-components/ui/Card.svelte';
	import Button from '$lib/web-components/ui/Button.svelte';
	import type { MusicTrendsResponse } from '$lib/types/music-api';

	// State management
	let trendsData = $state<MusicTrendsResponse | null>(null);
	let loading = $state(false);
	let error = $state<string | null>(null);
	let searchTerm = $state('');

	// Filter options
	let selectedType = $state<'tracks' | 'artists'>('tracks');
	let selectedPeriod = $state('1month');
	let limit = $state(50);

	// Available options
	const periods = [
		{ value: '7day', label: '7 Days' },
		{ value: '1month', label: '1 Month' },
		{ value: '3month', label: '3 Months' },
		{ value: '6month', label: '6 Months' },
		{ value: '12month', label: '1 Year' },
		{ value: 'overall', label: 'All Time' }
	];

	const limits = [20, 50, 100, 200];

	// Fetch trends data
	async function fetchTrends() {
		loading = true;
		error = null;

		try {
			const params = new URLSearchParams({
				type: selectedType,
				period: selectedPeriod,
				limit: limit.toString()
			});

			const response = await fetch(`/api/music/trends?${params}`);

			if (!response.ok) {
				throw new Error(`Failed to fetch trends: ${response.status}`);
			}

			const data = await response.json();
			trendsData = data;
		} catch (err) {
			error = err instanceof Error ? err.message : 'An unexpected error occurred';
			trendsData = null;
		} finally {
			loading = false;
		}
	}

	// Get items based on type
	const items = $derived(() => {
		if (!trendsData?.trends) return [];
		return selectedType === 'tracks'
			? trendsData.trends.tracks?.track || []
			: trendsData.trends.artists?.artist || [];
	});

	// Filter items by search term
	const filteredItems = $derived(() => {
		if (!items() || !searchTerm.trim()) {
			return items();
		}

		const term = searchTerm.toLowerCase();
		return items().filter((item: any) => {
			if (selectedType === 'tracks') {
				return (
					item.name.toLowerCase().includes(term) || item.artist?.name?.toLowerCase().includes(term)
				);
			} else {
				return item.name.toLowerCase().includes(term);
			}
		});
	}) as () => Array<any>;

	// Get image URL with fallback
	function getImageUrl(images: any[], size: 'small' | 'medium' | 'large' = 'medium'): string {
		const image = images?.find((img) => img.size === size) || images?.[0];
		return image?.['#text'] || '/placeholder-album.png';
	}

	// Format number with K/M suffixes
	function formatNumber(num: string): string {
		const number = parseInt(num);
		if (isNaN(number)) return num;

		if (number >= 1000000) {
			return `${(number / 1000000).toFixed(1)}M`;
		} else if (number >= 1000) {
			return `${(number / 1000).toFixed(1)}K`;
		}
		return number.toLocaleString();
	}

	// Format duration
	function formatDuration(seconds: string): string {
		const num = parseInt(seconds);
		if (isNaN(num)) return seconds;
		const minutes = Math.floor(num / 60);
		const remainingSeconds = num % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	}

	// Get rank color
	function getRankColor(index: number): string {
		if (index < 3) return 'text-yellow-500';
		if (index < 10) return 'text-green-500';
		if (index < 25) return 'text-blue-500';
		return 'text-muted-foreground';
	}

	// Get rank background
	function getRankBackground(index: number): string {
		if (index < 3) return 'bg-yellow-100 dark:bg-yellow-900/20';
		if (index < 10) return 'bg-green-100 dark:bg-green-900/20';
		if (index < 25) return 'bg-blue-100 dark:bg-blue-900/20';
		return 'bg-muted';
	}

	// Load initial data
	onMount(() => {
		fetchTrends();
	});
</script>

<svelte:head>
	<title>Trending Music - Musical Zoe</title>
	<meta
		name="description"
		content="Discover trending tracks and artists with real-time music charts and analytics."
	/>
</svelte:head>

<div class="container mx-auto space-y-8 px-4 py-8">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-foreground flex items-center gap-2 text-3xl font-bold">
				<TrendingUp class="h-8 w-8 text-green-600" />
				Music Trends
			</h1>
			<p class="text-muted-foreground mt-1">Discover what's trending in music right now</p>
		</div>
		<div class="flex gap-2">
			<Button variant="outline" onclick={fetchTrends} disabled={loading}>
				<RefreshCw class="mr-1 h-4 w-4 {loading ? 'animate-spin' : ''}" />
				Refresh
			</Button>
			<Button variant="outline" href="/dashboard">← Back to Dashboard</Button>
		</div>
	</div>

	<!-- Filters and Search -->
	<Card class="p-6">
		<div class="space-y-6">
			<!-- Search Bar -->
			<div>
				<label for="trends-search" class="text-foreground mb-2 block text-sm font-medium">
					Search {selectedType === 'tracks' ? 'Tracks & Artists' : 'Artists'}
				</label>
				<div class="relative">
					<Search
						class="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform"
					/>
					<input
						id="trends-search"
						type="text"
						bind:value={searchTerm}
						placeholder="Search by {selectedType === 'tracks'
							? 'track or artist'
							: 'artist'} name..."
						class="border-input bg-background w-full rounded-md border py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-green-500 focus:outline-none"
					/>
				</div>
			</div>

			<!-- Filter Controls -->
			<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
				<div>
					<label class="text-foreground mb-2 block text-sm font-medium">
						<Filter class="mr-1 inline h-4 w-4" />
						Content Type
					</label>
					<div class="border-input flex overflow-hidden rounded-md border">
						<button
							onclick={() => {
								selectedType = 'tracks';
								fetchTrends();
							}}
							class="flex-1 px-4 py-2 text-sm font-medium transition-colors {selectedType ===
							'tracks'
								? 'bg-green-600 text-white'
								: 'bg-background text-foreground hover:bg-muted'}"
						>
							<Music class="mr-1 inline h-4 w-4" />
							Tracks
						</button>
						<button
							onclick={() => {
								selectedType = 'artists';
								fetchTrends();
							}}
							class="flex-1 px-4 py-2 text-sm font-medium transition-colors {selectedType ===
							'artists'
								? 'bg-green-600 text-white'
								: 'bg-background text-foreground hover:bg-muted'}"
						>
							<User class="mr-1 inline h-4 w-4" />
							Artists
						</button>
					</div>
				</div>

				<div>
					<label class="text-foreground mb-2 block text-sm font-medium">
						<Calendar class="mr-1 inline h-4 w-4" />
						Time Period
					</label>
					<select
						bind:value={selectedPeriod}
						class="border-input bg-background w-full rounded-md border px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500 focus:outline-none"
						onchange={fetchTrends}
					>
						{#each periods as period}
							<option value={period.value}>{period.label}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="limit-trends" class="text-foreground mb-2 block text-sm font-medium">
						Limit Results
					</label>
					<select
						id="limit-trends"
						bind:value={limit}
						class="border-input bg-background w-full rounded-md border px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500 focus:outline-none"
						onchange={fetchTrends}
					>
						{#each limits as limitOption}
							<option value={limitOption}>Top {limitOption}</option>
						{/each}
					</select>
				</div>
			</div>
		</div>
	</Card>

	<!-- Loading State -->
	{#if loading}
		<Card class="p-8">
			<div class="flex items-center justify-center">
				<RefreshCw class="mr-2 h-6 w-6 animate-spin text-green-600" />
				<span class="text-foreground">Loading trending {selectedType}...</span>
			</div>
		</Card>
	{/if}

	<!-- Error State -->
	{#if error}
		<Card class="border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
			<p class="text-red-600 dark:text-red-400">{error}</p>
		</Card>
	{/if}

	<!-- Results Summary -->
	{#if filteredItems().length > 0 && !loading}
		<div class="text-muted-foreground flex items-center justify-between text-sm">
			<span>
				Showing {filteredItems().length} trending {selectedType}
				{#if searchTerm}(filtered by "{searchTerm}"){/if}
			</span>
			<span>
				Period: {periods.find((p) => p.value === selectedPeriod)?.label}
			</span>
		</div>
	{/if}

	<!-- Trending Items -->
	{#if filteredItems().length > 0}
		<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
			{#each filteredItems() as item, index}
				<Card class="overflow-hidden transition-shadow duration-200 hover:shadow-lg">
					<div class="p-4">
						<div class="flex items-center space-x-4">
							<!-- Rank -->
							<div
								class="h-12 w-12 flex-shrink-0 rounded-full {getRankBackground(
									index
								)} flex items-center justify-center"
							>
								<span class="text-lg font-bold {getRankColor(index)}">
									#{index + 1}
								</span>
							</div>

							<!-- Image -->
							<div class="flex-shrink-0">
								<img
									src={getImageUrl(item.image, 'medium')}
									alt={item.name}
									class="h-16 w-16 rounded-lg object-cover"
									loading={index < 10 ? 'eager' : 'lazy'}
								/>
							</div>

							<!-- Content -->
							<div class="min-w-0 flex-grow">
								<h3 class="text-foreground truncate font-semibold">
									{item.name}
								</h3>

								{#if selectedType === 'tracks' && item.artist}
									<p class="text-muted-foreground truncate text-sm">
										by {item.artist.name}
									</p>
								{/if}

								<!-- Stats -->
								<div class="text-muted-foreground mt-2 flex items-center space-x-4 text-xs">
									{#if item.playcount}
										<span class="flex items-center">
											<Play class="mr-1 h-3 w-3" />
											{formatNumber(item.playcount)} plays
										</span>
									{/if}
									{#if item.listeners}
										<span class="flex items-center">
											<User class="mr-1 h-3 w-3" />
											{formatNumber(item.listeners)} listeners
										</span>
									{/if}
									{#if selectedType === 'tracks' && item.duration}
										<span class="flex items-center">
											<Clock class="mr-1 h-3 w-3" />
											{formatDuration(item.duration)}
										</span>
									{/if}
								</div>
							</div>

							<!-- Actions -->
							<div class="flex-shrink-0">
								{#if item.url}
									<a
										href={item.url}
										target="_blank"
										rel="noopener noreferrer"
										class="border-input bg-background hover:bg-muted inline-flex items-center rounded-md border px-3 py-1.5 text-sm transition-colors"
									>
										<ExternalLink class="mr-1 h-3 w-3" />
										Last.fm
									</a>
								{/if}
							</div>
						</div>
					</div>
				</Card>
			{/each}
		</div>
	{:else if trendsData && !loading}
		<Card class="p-8">
			<div class="text-muted-foreground text-center">
				<BarChart3 class="mx-auto mb-4 h-12 w-12 opacity-50" />
				<h3 class="mb-2 text-lg font-medium">No trends found</h3>
				<p class="text-sm">
					{#if searchTerm}
						Try adjusting your search term or filters.
					{:else}
						No trending {selectedType} available for the selected period.
					{/if}
				</p>
			</div>
		</Card>
	{/if}

	<!-- Top Performers Section -->
	{#if filteredItems().length >= 10 && !searchTerm}
		<Card class="p-6">
			<h2 class="text-foreground mb-4 flex items-center text-xl font-semibold">
				<TrendingUp class="mr-2 h-5 w-5 text-green-600" />
				Top 10 {selectedType === 'tracks' ? 'Tracks' : 'Artists'}
			</h2>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
				{#each filteredItems().slice(0, 10) as item, index}
					<div class="bg-muted hover:bg-muted/80 rounded-lg p-4 text-center transition-colors">
						<div class="mb-3">
							<img
								src={getImageUrl(item.image, 'large')}
								alt={item.name}
								class="mx-auto h-20 w-20 rounded-lg object-cover"
							/>
						</div>
						<div class="space-y-1">
							<div class="text-2xl font-bold {getRankColor(index)}">
								#{index + 1}
							</div>
							<div class="text-foreground truncate text-sm font-medium">
								{item.name}
							</div>
							{#if selectedType === 'tracks' && item.artist}
								<div class="text-muted-foreground truncate text-xs">
									{item.artist.name}
								</div>
							{/if}
							{#if item.playcount}
								<div class="text-muted-foreground text-xs">
									{formatNumber(item.playcount)} plays
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</Card>
	{/if}
</div>
