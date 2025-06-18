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
		limit = 4,
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
		<div class="mb-6 flex items-center justify-between">
			<div class="flex items-center space-x-3">
				<div class="rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 p-2">
					<Newspaper class="h-5 w-5 text-white" />
				</div>
				<div>
					<h3 class="text-foreground text-lg font-semibold">Music News</h3>
					<p class="text-muted-foreground text-sm">
						Latest {type} from {countryOptions.find((c) => c.code === country)?.name}
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
					class="border-border bg-background text-foreground focus:ring-primary rounded-md border px-2 py-1 text-sm focus:ring-2 focus:outline-none"
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
					class="border-border bg-background text-foreground focus:ring-primary rounded-md border px-2 py-1 text-sm focus:ring-2 focus:outline-none"
				>
					{#each countryOptions as option}
						<option value={option.code}>{option.name}</option>
					{/each}
				</select>

				<!-- Type Toggle -->
				<div class="border-border flex overflow-hidden rounded-md border">
					<button
						onclick={() => {
							type = 'headlines';
							loadNews();
						}}
						class="px-3 py-1 text-sm {type === 'headlines'
							? 'bg-primary text-primary-foreground'
							: 'bg-background text-muted-foreground hover:text-foreground'} transition-colors"
						disabled={loading}
					>
						Headlines
					</button>
					<button
						onclick={() => {
							type = 'everything';
							loadNews();
						}}
						class="px-3 py-1 text-sm {type === 'everything'
							? 'bg-primary text-primary-foreground'
							: 'bg-background text-muted-foreground hover:text-foreground'} transition-colors"
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
					<div class="flex animate-pulse space-x-4">
						<div class="bg-muted h-16 w-24 rounded-md"></div>
						<div class="flex-1">
							<div class="bg-muted mb-2 h-4 w-3/4 rounded"></div>
							<div class="bg-muted mb-2 h-3 w-full rounded"></div>
							<div class="bg-muted h-3 w-1/2 rounded"></div>
						</div>
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
				<Button variant="outline" onclick={loadNews} class="mt-4">Try Again</Button>
			</div>
		{/if}

		<!-- News Articles -->
		{#if data && data.news.articles.length > 0 && !loading}
			<div class="space-y-3">
				{#each data.news.articles.slice(0, limit) as article}
					<article
						class="group border-border hover:border-primary/50 cursor-pointer rounded-lg border p-3 transition-all hover:shadow-md"
					>
						<div class="space-y-3">
							<!-- Article Image -->
							{#if article.urlToImage}
								<div class="h-32 w-full flex-shrink-0">
									<img
										src={article.urlToImage}
										alt={article.title}
										class="h-full w-full rounded-md object-cover transition-transform group-hover:scale-105"
										loading="lazy"
									/>
								</div>
							{/if}

							<!-- Article Content -->
							<div class="space-y-2">
								<h4
									class="text-foreground group-hover:text-primary line-clamp-2 text-sm font-semibold transition-colors"
								>
									{article.title}
								</h4>

								{#if article.description}
									<p class="text-muted-foreground line-clamp-2 text-xs">
										{truncateText(article.description, 100)}
									</p>
								{/if}

								<!-- Article Meta -->
								<div class="flex items-center justify-between">
									<div class="text-muted-foreground flex items-center space-x-2 text-xs">
										{#if article.source.name}
											<span class="truncate font-medium">{article.source.name}</span>
										{/if}
										<span>•</span>
										<span>{formatDate(article.publishedAt)}</span>
									</div>

									<a
										href={article.url}
										target="_blank"
										rel="noopener noreferrer"
										class="text-primary hover:text-primary/80 flex items-center space-x-1 text-xs transition-colors"
										onclick={(e) => e.stopPropagation()}
									>
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
			<div class="py-8 text-center">
				<Newspaper class="text-muted-foreground mx-auto mb-4 h-12 w-12" />
				<p class="text-muted-foreground">No news articles found for the selected filters.</p>
				<Button variant="outline" onclick={loadNews} class="mt-4">Refresh</Button>
			</div>
		{/if}
	</div>
</Card>
