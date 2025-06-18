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
				return `${diffMinutes}m ago`;
			}
			return `${diffHours}h ago`;
		} else if (diffDays === 1) {
			return 'Yesterday';
		} else if (diffDays < 7) {
			return `${diffDays}d ago`;
		} else {
			return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
		}
	}

	function truncateText(text: string, maxLength: number): string {
		if (text.length <= maxLength) return text;
		return text.slice(0, maxLength) + '...';
	}
</script>

<Card class="flex h-full flex-col">
	<div class="flex flex-1 flex-col overflow-y-auto p-6">
		<!-- Header -->
		<div class="mb-4 flex items-center justify-between">
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
		</div>

		<!-- Compact Filters -->
		<div class="mb-4 flex flex-wrap items-center gap-2">
			<!-- Genre Filter -->
			<select
				bind:value={genre}
				onchange={loadNews}
				disabled={loading}
				class="border-border bg-background text-foreground focus:ring-primary rounded-md border px-2 py-1 text-xs focus:ring-2 focus:outline-none"
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
				class="border-border bg-background text-foreground focus:ring-primary rounded-md border px-2 py-1 text-xs focus:ring-2 focus:outline-none"
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
					class="px-2 py-1 text-xs {type === 'headlines'
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
					class="px-2 py-1 text-xs {type === 'everything'
						? 'bg-primary text-primary-foreground'
						: 'bg-background text-muted-foreground hover:text-foreground'} transition-colors"
					disabled={loading}
				>
					All
				</button>
			</div>
		</div>

		<!-- Content Area -->
		<div class="flex-shrink-0">
			<!-- Loading State -->
			{#if loading}
				<div class="space-y-3">
					{#each Array(4) as _}
						<div class="flex animate-pulse space-x-3">
							<div class="bg-muted h-12 w-16 flex-shrink-0 rounded-md"></div>
							<div class="min-w-0 flex-1">
								<div class="bg-muted mb-2 h-3 w-3/4 rounded"></div>
								<div class="bg-muted mb-1 h-2 w-full rounded"></div>
								<div class="bg-muted h-2 w-1/2 rounded"></div>
							</div>
						</div>
					{/each}
				</div>
			{:else if error}
				<!-- Error State -->
				<div class="py-8 text-center">
					<div class="bg-destructive/10 border-destructive/20 rounded-md border p-3">
						<p class="text-destructive text-sm">{error}</p>
					</div>
					<Button variant="outline" onclick={loadNews} class="mt-4" size="sm">Try Again</Button>
				</div>
			{:else if data && data.news.articles.length > 0}
				<!-- News Articles -->
				<div class="mb-4 space-y-3">
					{#each data.news.articles.slice(0, limit) as article}
						<article
							class="group border-border hover:border-primary/50 bg-card/50 hover:bg-card relative rounded-lg border transition-all hover:shadow-md"
						>
							<div class="p-3">
								<div class="flex space-x-3">
									{#if article.urlToImage}
										<img
											src={article.urlToImage}
											alt={article.title}
											class="h-14 w-20 flex-shrink-0 rounded-md object-cover"
											loading="lazy"
										/>
									{:else}
										<div
											class="bg-muted flex h-14 w-20 flex-shrink-0 items-center justify-center rounded-md"
										>
											<Newspaper class="text-muted-foreground h-5 w-5" />
										</div>
									{/if}

									<div class="min-w-0 flex-1">
										<h4
											class="text-foreground group-hover:text-primary text-sm leading-tight font-medium transition-colors"
										>
											<span class="line-clamp-2">{article.title}</span>
										</h4>

										{#if article.description}
											<p class="text-muted-foreground mt-1 text-xs leading-relaxed">
												<span class="line-clamp-2">{truncateText(article.description, 100)}</span>
											</p>
										{/if}

										<div class="mt-2 flex items-center justify-between">
											<div class="text-muted-foreground flex items-center space-x-2 text-xs">
												{#if article.source?.name}
													<span class="max-w-20 truncate font-medium">{article.source.name}</span>
													<span>•</span>
												{/if}
												<span>{formatDate(article.publishedAt)}</span>
											</div>

											<ExternalLink
												class="text-muted-foreground group-hover:text-primary h-3 w-3 flex-shrink-0 transition-colors"
											/>
										</div>
									</div>
								</div>
							</div>

							<!-- Accessible overlay button -->
							{#if article.url}
								<a
									href={article.url}
									target="_blank"
									rel="noopener noreferrer"
									class="focus:ring-primary absolute inset-0 rounded-lg focus:ring-2 focus:ring-offset-2 focus:outline-none"
									aria-label="Read article: {article.title}"
								>
									<span class="sr-only">Read full article</span>
								</a>
							{/if}
						</article>
					{/each}
				</div>

				<!-- View More Button -->
				<div class="border-border border-t pt-3">
					<Button
						variant="outline"
						href="/dashboard/news?country={country}&type={type}&genre={genre}"
						class="w-full text-xs"
						size="sm"
					>
						View All News ({data.news.totalResults})
					</Button>
				</div>
			{:else}
				<!-- No Results State -->
				<div class="py-8 text-center">
					<Newspaper class="text-muted-foreground mx-auto mb-4 h-12 w-12" />
					<p class="text-muted-foreground text-sm">No news articles found</p>
					<Button variant="outline" onclick={loadNews} class="mt-4" size="sm">Refresh</Button>
				</div>
			{/if}
		</div>
	</div>
</Card>
