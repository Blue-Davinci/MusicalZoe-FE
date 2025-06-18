<script lang="ts">
	import { onMount } from 'svelte';
	import { TrendingUp, Music, User, Calendar, ExternalLink, Search, Filter, RefreshCw, Play, Clock, BarChart3 } from 'lucide-svelte';
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
		{ value: 'overall', label: 'All Time' },
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
				limit: limit.toString(),
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
			? (trendsData.trends.tracks?.track || [])
			: (trendsData.trends.artists?.artist || []);
	});

	// Filter items by search term
	const filteredItems = $derived(() => {
		if (!items() || !searchTerm.trim()) {
			return items();
		}

		const term = searchTerm.toLowerCase();
		return items().filter((item: any) => {
			if (selectedType === 'tracks') {
				return item.name.toLowerCase().includes(term) ||
					   item.artist?.name?.toLowerCase().includes(term);
			} else {
				return item.name.toLowerCase().includes(term);
			}
		});
	}) as () => Array<any>;

	// Get image URL with fallback
	function getImageUrl(images: any[], size: 'small' | 'medium' | 'large' = 'medium'): string {
		const image = images?.find(img => img.size === size) || images?.[0];
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
	<title>Music Trends - MusicalZoe</title>
</svelte:head>

<div class="container mx-auto space-y-8 px-4 py-8">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-foreground text-3xl font-bold flex items-center gap-2">
				<TrendingUp class="h-8 w-8 text-green-600" />
				Music Trends
			</h1>
			<p class="text-muted-foreground mt-1">Discover what's trending in music right now</p>
		</div>
		<div class="flex gap-2">
			<Button variant="outline" onclick={fetchTrends} disabled={loading}>
				<RefreshCw class="h-4 w-4 mr-1 {loading ? 'animate-spin' : ''}" />
				Refresh
			</Button>
			<Button variant="outline" href="/dashboard">
				← Back to Dashboard
			</Button>
		</div>
	</div>

	<!-- Filters and Search -->
	<Card class="p-6">
		<div class="space-y-6">
			<!-- Search Bar -->
			<div>
				<label for="trends-search" class="block text-sm font-medium text-foreground mb-2">
					Search {selectedType === 'tracks' ? 'Tracks & Artists' : 'Artists'}
				</label>
				<div class="relative">
					<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<input
						id="trends-search"
						type="text"
						bind:value={searchTerm}
						placeholder="Search by {selectedType === 'tracks' ? 'track or artist' : 'artist'} name..."
						class="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
					/>
				</div>
			</div>

			<!-- Filter Controls -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div>
					<label class="block text-sm font-medium text-foreground mb-2">
						<Filter class="inline h-4 w-4 mr-1" />
						Content Type
					</label>
					<div class="flex rounded-md border border-input overflow-hidden">
						<button
							onclick={() => {selectedType = 'tracks'; fetchTrends();}}
							class="flex-1 px-4 py-2 text-sm font-medium transition-colors {selectedType === 'tracks' ? 'bg-green-600 text-white' : 'bg-background text-foreground hover:bg-muted'}"
						>
							<Music class="inline h-4 w-4 mr-1" />
							Tracks
						</button>
						<button
							onclick={() => {selectedType = 'artists'; fetchTrends();}}
							class="flex-1 px-4 py-2 text-sm font-medium transition-colors {selectedType === 'artists' ? 'bg-green-600 text-white' : 'bg-background text-foreground hover:bg-muted'}"
						>
							<User class="inline h-4 w-4 mr-1" />
							Artists
						</button>
					</div>
				</div>

				<div>
					<label class="block text-sm font-medium text-foreground mb-2">
						<Calendar class="inline h-4 w-4 mr-1" />
						Time Period
					</label>
					<select
						bind:value={selectedPeriod}
						class="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
						onchange={fetchTrends}
					>
						{#each periods as period}
							<option value={period.value}>{period.label}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="limit-trends" class="block text-sm font-medium text-foreground mb-2">
						Limit Results
					</label>
					<select
						id="limit-trends"
						bind:value={limit}
						class="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
				<RefreshCw class="h-6 w-6 animate-spin text-green-600 mr-2" />
				<span class="text-foreground">Loading trending {selectedType}...</span>
			</div>
		</Card>
	{/if}

	<!-- Error State -->
	{#if error}
		<Card class="p-4 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
			<p class="text-red-600 dark:text-red-400">{error}</p>
		</Card>
	{/if}

	<!-- Results Summary -->
	{#if filteredItems().length > 0 && !loading}
		<div class="flex items-center justify-between text-sm text-muted-foreground">
			<span>
				Showing {filteredItems().length} trending {selectedType}
				{#if searchTerm}(filtered by "{searchTerm}"){/if}
			</span>
			<span>
				Period: {periods.find(p => p.value === selectedPeriod)?.label}
			</span>
		</div>
	{/if}

	<!-- Trending Items -->
	{#if filteredItems().length > 0}
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
			{#each filteredItems() as item, index}
				<Card class="overflow-hidden hover:shadow-lg transition-shadow duration-200">
					<div class="p-4">
						<div class="flex items-center space-x-4">
							<!-- Rank -->
							<div class="flex-shrink-0 w-12 h-12 rounded-full {getRankBackground(index)} flex items-center justify-center">
								<span class="font-bold text-lg {getRankColor(index)}">
									#{index + 1}
								</span>
							</div>

							<!-- Image -->
							<div class="flex-shrink-0">
								<img 
									src={getImageUrl(item.image, 'medium')}
									alt={item.name}
									class="w-16 h-16 rounded-lg object-cover"
									loading={index < 10 ? 'eager' : 'lazy'}
								/>
							</div>

							<!-- Content -->
							<div class="flex-grow min-w-0">
								<h3 class="font-semibold text-foreground truncate">
									{item.name}
								</h3>
								
								{#if selectedType === 'tracks' && item.artist}
									<p class="text-muted-foreground text-sm truncate">
										by {item.artist.name}
									</p>
								{/if}

								<!-- Stats -->
								<div class="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
									{#if item.playcount}
										<span class="flex items-center">
											<Play class="h-3 w-3 mr-1" />
											{formatNumber(item.playcount)} plays
										</span>
									{/if}
									{#if item.listeners}
										<span class="flex items-center">
											<User class="h-3 w-3 mr-1" />
											{formatNumber(item.listeners)} listeners
										</span>
									{/if}
									{#if selectedType === 'tracks' && item.duration}
										<span class="flex items-center">
											<Clock class="h-3 w-3 mr-1" />
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
										class="inline-flex items-center px-3 py-1.5 text-sm border border-input rounded-md bg-background hover:bg-muted transition-colors"
									>
										<ExternalLink class="h-3 w-3 mr-1" />
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
			<div class="text-center text-muted-foreground">
				<BarChart3 class="h-12 w-12 mx-auto mb-4 opacity-50" />
				<h3 class="text-lg font-medium mb-2">No trends found</h3>
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
			<h2 class="text-xl font-semibold text-foreground mb-4 flex items-center">
				<TrendingUp class="h-5 w-5 mr-2 text-green-600" />
				Top 10 {selectedType === 'tracks' ? 'Tracks' : 'Artists'}
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
				{#each filteredItems().slice(0, 10) as item, index}
					<div class="text-center p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
						<div class="mb-3">
							<img 
								src={getImageUrl(item.image, 'large')}
								alt={item.name}
								class="w-20 h-20 mx-auto rounded-lg object-cover"
							/>
						</div>
						<div class="space-y-1">
							<div class="font-bold text-2xl {getRankColor(index)}">
								#{index + 1}
							</div>
							<div class="font-medium text-sm text-foreground truncate">
								{item.name}
							</div>
							{#if selectedType === 'tracks' && item.artist}
								<div class="text-xs text-muted-foreground truncate">
									{item.artist.name}
								</div>
							{/if}
							{#if item.playcount}
								<div class="text-xs text-muted-foreground">
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
