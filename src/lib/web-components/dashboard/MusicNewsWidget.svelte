<script lang="ts">
	import { Newspaper, ExternalLink, Calendar, User } from 'lucide-svelte';
	import Card from '../ui/Card.svelte';
	import Button from '../ui/Button.svelte';
	import type { MusicNewsResponse, NewsArticle, ApiError } from '$lib/types/music-api';

	interface Props {
		limit?: number;
		country?: string;
		type?: 'headlines' | 'everything';
		genre?: string;
		autoLoad?: boolean;
	}

	let {
		limit = 6,
		country = 'us',
		type = 'everything',
		genre = '',
		autoLoad = true
	}: Props = $props();

	let loading = $state(false);
	let data = $state<MusicNewsResponse | null>(null);
	let error = $state<string | null>(null);

	const countryOptions = [
		{ code: 'us', name: 'United States' },
		{ code: 'gb', name: 'United Kingdom' },
		{ code: 'ca', name: 'Canada' },
		{ code: 'au', name: 'Australia' },
		{ code: 'de', name: 'Germany' },
		{ code: 'fr', name: 'France' }
	];

	const genreOptions = [
		{ value: '', name: 'All Genres' },
		{ value: 'rock', name: 'Rock' },
		{ value: 'pop', name: 'Pop' },
		{ value: 'hip-hop', name: 'Hip Hop' },
		{ value: 'jazz', name: 'Jazz' },
		{ value: 'classical', name: 'Classical' },
		{ value: 'electronic', name: 'Electronic' },
		{ value: 'country', name: 'Country' },
		{ value: 'r&b', name: 'R&B' }
	];

	async function loadNews() {
		loading = true;
		error = null;

		try {
			const params = new URLSearchParams({
				limit: limit.toString(),
				country,
				type
			});

			if (genre) {
				params.set('genre', genre);
			}

			const response = await fetch(`/api/music/news?${params}`);
			const result = await response.json();

			if (!response.ok) {
				error = (result as ApiError).error || 'Failed to fetch news';
				return;
			}

			data = result as MusicNewsResponse;
		} catch (err) {
			error = 'An unexpected error occurred';
			console.error('News error:', err);
		} finally {
			loading = false;
		}
	}

	// Auto-load on mount if enabled
	$effect(() => {
		if (autoLoad) {
			loadNews();
		}
	});

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

		if (diffDays === 0) {
			if (diffHours === 0) {
				const diffMinutes = Math.floor(diffMs / (1000 * 60));
				return `${diffMinutes} minutes ago`;
			}
			return `${diffHours} hours ago`;
		} else if (diffDays === 1) {
			return 'Yesterday';
		} else if (diffDays < 7) {
			return `${diffDays} days ago`;
		} else {
			return date.toLocaleDateString();
		}
	}

	function truncateText(text: string, maxLength: number): string {
		if (text.length <= maxLength) return text;
		return text.slice(0, maxLength) + '...';
	}
</script>

<Card class="overflow-hidden">
	<div class="p-6">
		<!-- Header -->
		<div class="flex items-center justify-between mb-6">
			<div class="flex items-center space-x-3">
				<div class="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500">
					<Newspaper class="h-5 w-5 text-white" />
				</div>
				<div>
					<h3 class="text-lg font-semibold text-foreground">Music News</h3>
					<p class="text-sm text-muted-foreground">
						Latest {type} from {countryOptions.find(c => c.code === country)?.name}
					</p>
				</div>
			</div>

			<!-- Filters -->
			<div class="flex items-center space-x-2">
				<!-- Genre Filter -->
				<select
					bind:value={genre}
					onchange={loadNews}
					disabled={loading}
					class="text-sm border border-border rounded-md px-2 py-1 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
				>
					{#each genreOptions as option}
						<option value={option.value}>{option.name}</option>
					{/each}
				</select>

				<!-- Country Filter -->
				<select
					bind:value={country}
					onchange={loadNews}
					disabled={loading}
					class="text-sm border border-border rounded-md px-2 py-1 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
				>
					{#each countryOptions as option}
						<option value={option.code}>{option.name}</option>
					{/each}
				</select>

				<!-- Type Toggle -->
				<div class="flex border border-border rounded-md overflow-hidden">
					<button
						onclick={() => { type = 'headlines'; loadNews(); }}
						class="px-3 py-1 text-sm {type === 'headlines' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:text-foreground'} transition-colors"
						disabled={loading}
					>
						Headlines
					</button>
					<button
						onclick={() => { type = 'everything'; loadNews(); }}
						class="px-3 py-1 text-sm {type === 'everything' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:text-foreground'} transition-colors"
						disabled={loading}
					>
						All
					</button>
				</div>
			</div>
		</div>

		<!-- Loading State -->
		{#if loading}
			<div class="space-y-4">
				{#each Array(3) as _}
					<div class="flex space-x-4 animate-pulse">
						<div class="w-24 h-16 bg-muted rounded-md"></div>
						<div class="flex-1">
							<div class="h-4 bg-muted rounded w-3/4 mb-2"></div>
							<div class="h-3 bg-muted rounded w-full mb-2"></div>
							<div class="h-3 bg-muted rounded w-1/2"></div>
						</div>
					</div>
				{/each}
			</div>
		{/if}

		<!-- Error State -->
		{#if error}
			<div class="text-center py-8">
				<div class="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
					<p class="text-sm text-destructive">{error}</p>
				</div>
				<Button variant="outline" onclick={loadNews} class="mt-4">
					Try Again
				</Button>
			</div>
		{/if}

		<!-- News Articles -->
		{#if data && data.news.articles.length > 0 && !loading}
			<div class="space-y-4">
				{#each data.news.articles.slice(0, limit) as article}
					<article class="group cursor-pointer border border-border rounded-lg p-4 hover:shadow-md hover:border-primary/50 transition-all">
						<div class="flex space-x-4">
							<!-- Article Image -->
							{#if article.urlToImage}
								<div class="w-24 h-16 flex-shrink-0">
									<img
										src={article.urlToImage}
										alt={article.title}
										class="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform"
										loading="lazy"
									/>
								</div>
							{:else}
								<div class="w-24 h-16 flex-shrink-0 bg-muted rounded-md flex items-center justify-center">
									<Newspaper class="h-6 w-6 text-muted-foreground" />
								</div>
							{/if}

							<!-- Article Content -->
							<div class="flex-1 min-w-0">
								<h4 class="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
									{article.title}
								</h4>
								
								{#if article.description}
									<p class="text-xs text-muted-foreground mt-2 line-clamp-2">
										{truncateText(article.description, 120)}
									</p>
								{/if}

								<!-- Article Meta -->
								<div class="flex items-center justify-between mt-3">
									<div class="flex items-center space-x-3 text-xs text-muted-foreground">
										{#if article.source.name}
											<span class="font-medium">{article.source.name}</span>
										{/if}
										{#if article.author}
											<div class="flex items-center space-x-1">
												<User class="h-3 w-3" />
												<span>{article.author}</span>
											</div>
										{/if}
										<div class="flex items-center space-x-1">
											<Calendar class="h-3 w-3" />
											<span>{formatDate(article.publishedAt)}</span>
										</div>
									</div>

									<a
										href={article.url}
										target="_blank"
										rel="noopener noreferrer"
										class="flex items-center space-x-1 text-xs text-primary hover:text-primary/80 transition-colors"
										onclick={(e) => e.stopPropagation()}
									>
										<span>Read more</span>
										<ExternalLink class="h-3 w-3" />
									</a>
								</div>
							</div>
						</div>
					</article>
				{/each}
			</div>

			<!-- View More Button -->
			<div class="mt-6 text-center">
				<Button 
					variant="outline" 
					href="/dashboard/news?country={country}&type={type}&genre={genre}"
					class="w-full"
				>
					View All Music News ({data.news.totalResults} articles)
				</Button>
			</div>
		{/if}

		<!-- Empty State -->
		{#if data && data.news.articles.length === 0 && !loading && !error}
			<div class="text-center py-8">
				<Newspaper class="h-12 w-12 text-muted-foreground mx-auto mb-4" />
				<p class="text-muted-foreground">No news articles found for the selected filters.</p>
				<Button variant="outline" onclick={loadNews} class="mt-4">
					Refresh
				</Button>
			</div>
		{/if}
	</div>
</Card>
