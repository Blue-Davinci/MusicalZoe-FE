<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Newspaper,
		Filter,
		Calendar,
		ExternalLink,
		Search,
		Globe,
		Clock,
		RefreshCw
	} from 'lucide-svelte';
	import Card from '$lib/web-components/ui/Card.svelte';
	import Button from '$lib/web-components/ui/Button.svelte';
	import type { MusicNewsResponse } from '$lib/types/music-api';

	// State management
	let newsData = $state<MusicNewsResponse | null>(null);
	let loading = $state(false);
	let error = $state<string | null>(null);
	let searchTerm = $state('');

	// Filter options
	let selectedCountry = $state('us');
	let selectedType = $state('everything');
	let selectedGenre = $state('');
	let limit = $state(20);

	// Available options
	const countries = [
		{ code: 'us', name: 'United States' },
		{ code: 'gb', name: 'United Kingdom' },
		{ code: 'ca', name: 'Canada' },
		{ code: 'au', name: 'Australia' },
		{ code: 'de', name: 'Germany' },
		{ code: 'fr', name: 'France' },
		{ code: 'jp', name: 'Japan' }
	];

	const genres = [
		{ value: '', label: 'All Genres' },
		{ value: 'rock', label: 'Rock' },
		{ value: 'pop', label: 'Pop' },
		{ value: 'hip-hop', label: 'Hip Hop' },
		{ value: 'jazz', label: 'Jazz' },
		{ value: 'classical', label: 'Classical' },
		{ value: 'electronic', label: 'Electronic' },
		{ value: 'country', label: 'Country' },
		{ value: 'reggae', label: 'Reggae' },
		{ value: 'blues', label: 'Blues' }
	];

	const types = [
		{ value: 'everything', label: 'Everything' },
		{ value: 'headlines', label: 'Headlines Only' }
	];

	// Fetch news data
	async function fetchNews() {
		loading = true;
		error = null;

		try {
			const params = new URLSearchParams({
				limit: limit.toString(),
				country: selectedCountry,
				type: selectedType
			});

			if (selectedGenre) {
				params.append('genre', selectedGenre);
			}

			const response = await fetch(`/api/music/news?${params}`);

			if (!response.ok) {
				throw new Error(`Failed to fetch news: ${response.status}`);
			}

			const data = await response.json();
			newsData = data;
		} catch (err) {
			error = err instanceof Error ? err.message : 'An unexpected error occurred';
			newsData = null;
		} finally {
			loading = false;
		}
	}

	// Filter articles by search term
	const filteredArticles = $derived(() => {
		if (!newsData?.news?.articles || !searchTerm.trim()) {
			return newsData?.news?.articles || [];
		}

		const term = searchTerm.toLowerCase();
		return newsData.news.articles.filter(
			(article) =>
				article.title.toLowerCase().includes(term) ||
				article.description?.toLowerCase().includes(term) ||
				article.author?.toLowerCase().includes(term) ||
				article.source.name.toLowerCase().includes(term)
		);
	}) as () => Array<any>;

	// Format date
	function formatDate(dateString: string): string {
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			});
		} catch {
			return dateString;
		}
	}

	// Get time ago
	function getTimeAgo(dateString: string): string {
		try {
			const date = new Date(dateString);
			const now = new Date();
			const diffMs = now.getTime() - date.getTime();
			const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
			const diffDays = Math.floor(diffHours / 24);

			if (diffDays > 0) {
				return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
			} else if (diffHours > 0) {
				return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
			} else {
				const diffMinutes = Math.floor(diffMs / (1000 * 60));
				return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
			}
		} catch {
			return '';
		}
	}

	// Load initial data
	onMount(() => {
		fetchNews();
	});
</script>

<svelte:head>
	<title>Music News - Musical Zoe</title>
	<meta
		name="description"
		content="Stay updated with the latest music industry news from around the world."
	/>
</svelte:head>

<div class="container mx-auto space-y-8 px-4 py-8">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-foreground flex items-center gap-2 text-3xl font-bold">
				<Newspaper class="h-8 w-8 text-blue-600" />
				Music News
			</h1>
			<p class="text-muted-foreground mt-1">Stay updated with the latest music industry news</p>
		</div>
		<div class="flex gap-2">
			<Button variant="outline" onclick={fetchNews} disabled={loading}>
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
				<label for="news-search" class="text-foreground mb-2 block text-sm font-medium">
					Search Articles
				</label>
				<div class="relative">
					<Search
						class="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform"
					/>
					<input
						id="news-search"
						type="text"
						bind:value={searchTerm}
						placeholder="Search by title, content, author, or source..."
						class="border-input bg-background w-full rounded-md border py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
				</div>
			</div>

			<!-- Filter Controls -->
			<div class="grid grid-cols-1 gap-4 md:grid-cols-4">
				<div>
					<label class="text-foreground mb-2 block text-sm font-medium">
						<Globe class="mr-1 inline h-4 w-4" />
						Country
					</label>
					<select
						bind:value={selectedCountry}
						class="border-input bg-background w-full rounded-md border px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
						onchange={fetchNews}
					>
						{#each countries as country}
							<option value={country.code}>{country.name}</option>
						{/each}
					</select>
				</div>

				<div>
					<label class="text-foreground mb-2 block text-sm font-medium">
						<Filter class="mr-1 inline h-4 w-4" />
						Type
					</label>
					<select
						bind:value={selectedType}
						class="border-input bg-background w-full rounded-md border px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
						onchange={fetchNews}
					>
						{#each types as type}
							<option value={type.value}>{type.label}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="genre-filter" class="text-foreground mb-2 block text-sm font-medium">
						Genre Filter
					</label>
					<select
						id="genre-filter"
						bind:value={selectedGenre}
						class="border-input bg-background w-full rounded-md border px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
						onchange={fetchNews}
					>
						{#each genres as genre}
							<option value={genre.value}>{genre.label}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="limit-filter" class="text-foreground mb-2 block text-sm font-medium">
						Articles Limit
					</label>
					<select
						id="limit-filter"
						bind:value={limit}
						class="border-input bg-background w-full rounded-md border px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
						onchange={fetchNews}
					>
						<option value={10}>10 articles</option>
						<option value={20}>20 articles</option>
						<option value={50}>50 articles</option>
						<option value={100}>100 articles</option>
					</select>
				</div>
			</div>
		</div>
	</Card>

	<!-- Loading State -->
	{#if loading}
		<Card class="p-8">
			<div class="flex items-center justify-center">
				<RefreshCw class="mr-2 h-6 w-6 animate-spin text-blue-600" />
				<span class="text-foreground">Loading news articles...</span>
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
	{#if newsData && !loading}
		<div class="text-muted-foreground flex items-center justify-between text-sm">
			<span>
				Showing {filteredArticles().length} of {newsData.news.totalResults} articles
				{#if searchTerm}(filtered by "{searchTerm}"){/if}
			</span>
			<span>
				Source: {selectedCountry.toUpperCase()} • {selectedType}
				{#if selectedGenre}
					• {genres.find((g) => g.value === selectedGenre)?.label}{/if}
			</span>
		</div>
	{/if}

	<!-- News Articles -->
	{#if filteredArticles().length > 0}
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
			{#each filteredArticles() as article, index}
				<Card class="overflow-hidden transition-shadow duration-200 hover:shadow-lg">
					<!-- Article Image -->
					{#if article.urlToImage}
						<div class="aspect-video overflow-hidden">
							<img
								src={article.urlToImage}
								alt={article.title}
								class="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
								loading={index < 4 ? 'eager' : 'lazy'}
							/>
						</div>
					{/if}

					<div class="p-6">
						<!-- Source and Date -->
						<div class="text-muted-foreground mb-3 flex items-center justify-between text-sm">
							<span class="font-medium">{article.source.name}</span>
							<span class="flex items-center">
								<Clock class="mr-1 h-3 w-3" />
								{getTimeAgo(article.publishedAt)}
							</span>
						</div>

						<!-- Title -->
						<h3 class="text-foreground mb-2 line-clamp-2 text-lg font-semibold">
							{article.title}
						</h3>

						<!-- Description -->
						{#if article.description}
							<p class="text-muted-foreground mb-4 line-clamp-3 text-sm">
								{article.description}
							</p>
						{/if}

						<!-- Author and Actions -->
						<div class="flex items-center justify-between">
							<div class="text-muted-foreground text-xs">
								{#if article.author}
									By {article.author}
								{/if}
								<span class="ml-2">{formatDate(article.publishedAt)}</span>
							</div>
							<Button variant="outline" size="sm">
								<a
									href={article.url}
									target="_blank"
									rel="noopener noreferrer"
									class="flex items-center"
								>
									<ExternalLink class="mr-1 h-3 w-3" />
									Read More
								</a>
							</Button>
						</div>
					</div>
				</Card>
			{/each}
		</div>
	{:else if newsData && !loading}
		<Card class="p-8">
			<div class="text-muted-foreground text-center">
				<Newspaper class="mx-auto mb-4 h-12 w-12 opacity-50" />
				<h3 class="mb-2 text-lg font-medium">No articles found</h3>
				<p class="text-sm">
					{#if searchTerm}
						Try adjusting your search term or filters.
					{:else}
						No news articles available with the current filters.
					{/if}
				</p>
			</div>
		</Card>
	{/if}
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
