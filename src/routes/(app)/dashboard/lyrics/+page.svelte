<script lang="ts">
	import { onMount } from 'svelte';
	import { Music, Search, Clock, Album, User, ExternalLink, Copy, Heart } from 'lucide-svelte';
	import Card from '$lib/web-components/ui/Card.svelte';
	import Button from '$lib/web-components/ui/Button.svelte';
	import type { LyricsResponse, TrackInfoResponse } from '$lib/types/music-api';

	// State management
	let searchQuery = $state('');
	let artist = $state('');
	let title = $state('');
	let loading = $state(false);
	let error = $state<string | null>(null);
	let lyricsData = $state<LyricsResponse | null>(null);
	let includeMetadata = $state(true);
	let searchHistory = $state<Array<{ artist: string; title: string; timestamp: Date }>>([]);

	// Load search history from localStorage on mount
	onMount(() => {
		const saved = localStorage.getItem('lyrics-search-history');
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				searchHistory = parsed.map((item: any) => ({
					...item,
					timestamp: new Date(item.timestamp)
				}));
			} catch (e) {
				console.warn('Failed to parse search history:', e);
			}
		}
	});

	// Save search to history
	function addToHistory(artist: string, title: string) {
		const newEntry = { artist, title, timestamp: new Date() };
		searchHistory = [newEntry, ...searchHistory.slice(0, 9)]; // Keep last 10
		localStorage.setItem('lyrics-search-history', JSON.stringify(searchHistory));
	}

	// Parse search query for artist and title
	function parseSearchQuery(query: string) {
		const parts = query.split(' - ');
		if (parts.length >= 2) {
			return { artist: parts[0].trim(), title: parts.slice(1).join(' - ').trim() };
		}
		// Try other common separators
		const byMatch = query.match(/(.+?)\s+by\s+(.+)/i);
		if (byMatch) {
			return { artist: byMatch[2].trim(), title: byMatch[1].trim() };
		}
		return { artist: '', title: query.trim() };
	}

	// Search for lyrics
	async function searchLyrics() {
		if (!searchQuery.trim() && (!artist.trim() || !title.trim())) {
			error = 'Please enter a search query or artist and title';
			return;
		}

		loading = true;
		error = null;

		try {
			let searchArtist = artist;
			let searchTitle = title;

			// If using combined search, parse it
			if (searchQuery.trim() && !artist.trim() && !title.trim()) {
				const parsed = parseSearchQuery(searchQuery);
				searchArtist = parsed.artist;
				searchTitle = parsed.title;
			}

			if (!searchArtist || !searchTitle) {
				throw new Error('Both artist and title are required');
			}

			const params = new URLSearchParams({
				artist: searchArtist,
				title: searchTitle,
				metadata: includeMetadata.toString()
			});

			const response = await fetch(`/api/music/lyrics?${params}`);

			if (!response.ok) {
				if (response.status === 404) {
					throw new Error('Lyrics not found for this song');
				}
				throw new Error(`Search failed: ${response.status}`);
			}

			const data = await response.json();
			lyricsData = data;

			// Add to search history
			addToHistory(searchArtist, searchTitle);
		} catch (err) {
			error = err instanceof Error ? err.message : 'An unexpected error occurred';
			lyricsData = null;
		} finally {
			loading = false;
		}
	}

	// Copy lyrics to clipboard
	async function copyLyrics() {
		if (!lyricsData?.lyrics?.lyrics) return;

		try {
			await navigator.clipboard.writeText(lyricsData.lyrics.lyrics);
			// Show success feedback (you could add a toast here)
		} catch (err) {
			console.error('Failed to copy lyrics:', err);
		}
	}

	// Search from history
	function searchFromHistory(item: (typeof searchHistory)[0]) {
		artist = item.artist;
		title = item.title;
		searchQuery = '';
		searchLyrics();
	}

	// Format duration
	function formatDuration(seconds: string): string {
		const num = parseInt(seconds);
		if (isNaN(num)) return seconds;
		const minutes = Math.floor(num / 60);
		const remainingSeconds = num % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	}

	// Format play count
	function formatPlayCount(count: string): string {
		const num = parseInt(count);
		if (isNaN(num)) return count;
		if (num >= 1000000) {
			return `${(num / 1000000).toFixed(1)}M`;
		} else if (num >= 1000) {
			return `${(num / 1000).toFixed(1)}K`;
		}
		return count;
	}
</script>

<svelte:head>
	<title>Lyrics Search - MusicalZoe</title>
</svelte:head>

<div class="container mx-auto space-y-8 px-4 py-8">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-foreground flex items-center gap-2 text-3xl font-bold">
				<Music class="h-8 w-8 text-purple-600" />
				Lyrics Search
			</h1>
			<p class="text-muted-foreground mt-1">Find lyrics and track information for any song</p>
		</div>
		<Button variant="outline" href="/dashboard">← Back to Dashboard</Button>
	</div>

	<!-- Search Section -->
	<Card class="p-6">
		<div class="space-y-6">
			<!-- Search Methods Toggle -->
			<div class="flex flex-col gap-4 sm:flex-row">
				<div class="flex-1">
					<label for="quick-search" class="text-foreground mb-2 block text-sm font-medium">
						Quick Search (Artist - Title)
					</label>
					<div class="relative">
						<Search
							class="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform"
						/>
						<input
							id="quick-search"
							type="text"
							bind:value={searchQuery}
							placeholder="e.g., Coldplay - Yellow"
							class="border-input bg-background w-full rounded-md border py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-purple-500 focus:outline-none"
							onkeypress={(e) => e.key === 'Enter' && searchLyrics()}
						/>
					</div>
				</div>
				<div class="flex items-end">
					<span class="text-muted-foreground mb-2 px-4 text-sm">OR</span>
				</div>
			</div>

			<!-- Separate Fields -->
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<label for="artist-input" class="text-foreground mb-2 block text-sm font-medium">
						Artist
					</label>
					<input
						id="artist-input"
						type="text"
						bind:value={artist}
						placeholder="Artist name"
						class="border-input bg-background w-full rounded-md border px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500 focus:outline-none"
						onkeypress={(e) => e.key === 'Enter' && searchLyrics()}
					/>
				</div>
				<div>
					<label for="title-input" class="text-foreground mb-2 block text-sm font-medium">
						Song Title
					</label>
					<input
						id="title-input"
						type="text"
						bind:value={title}
						placeholder="Song title"
						class="border-input bg-background w-full rounded-md border px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500 focus:outline-none"
						onkeypress={(e) => e.key === 'Enter' && searchLyrics()}
					/>
				</div>
			</div>

			<!-- Options and Search Button -->
			<div class="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
				<label class="flex items-center space-x-2">
					<input
						type="checkbox"
						bind:checked={includeMetadata}
						class="border-input rounded focus:ring-2 focus:ring-purple-500"
					/>
					<span class="text-foreground text-sm">Include track metadata</span>
				</label>
				<Button variant="primary" disabled={loading} onclick={searchLyrics} class="sm:ml-auto">
					{loading ? 'Searching...' : 'Search Lyrics'}
				</Button>
			</div>
		</div>
	</Card>

	<!-- Error Display -->
	{#if error}
		<Card class="border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
			<p class="text-red-600 dark:text-red-400">{error}</p>
		</Card>
	{/if}

	<!-- Results and History Grid -->
	<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
		<!-- Lyrics Results -->
		{#if lyricsData}
			<div class="lg:col-span-2">
				<Card class="overflow-hidden">
					<!-- Track Header -->
					<div class="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
						<div class="flex items-start justify-between">
							<div class="flex-1">
								<h2 class="text-2xl font-bold">{lyricsData.lyrics.title}</h2>
								<p class="text-lg text-purple-100">by {lyricsData.lyrics.artist}</p>

								{#if lyricsData.lyrics.metadata?.album}
									<p class="mt-1 text-sm text-purple-200">
										<Album class="mr-1 inline h-4 w-4" />
										{lyricsData.lyrics.metadata.album}
									</p>
								{/if}
							</div>

							<!-- Track Image -->
							{#if lyricsData.lyrics.metadata?.images?.length}
								<img
									src={lyricsData.lyrics.metadata.images.find((img) => img.size === 'large')?.[
										'#text'
									] || lyricsData.lyrics.metadata.images[0]['#text']}
									alt="{lyricsData.lyrics.title} album art"
									class="h-20 w-20 rounded-lg shadow-lg"
								/>
							{/if}
						</div>

						<!-- Track Stats -->
						{#if lyricsData.lyrics.metadata}
							<div class="mt-4 flex flex-wrap gap-4 text-sm text-purple-100">
								{#if lyricsData.lyrics.metadata.duration}
									<span class="flex items-center">
										<Clock class="mr-1 h-4 w-4" />
										{formatDuration(lyricsData.lyrics.metadata.duration)}
									</span>
								{/if}
								{#if lyricsData.lyrics.metadata.playcount}
									<span class="flex items-center">
										<User class="mr-1 h-4 w-4" />
										{formatPlayCount(lyricsData.lyrics.metadata.playcount)} plays
									</span>
								{/if}
								{#if lyricsData.lyrics.word_count}
									<span>{lyricsData.lyrics.word_count} words</span>
								{/if}
								{#if lyricsData.lyrics.lines_count}
									<span>{lyricsData.lyrics.lines_count} lines</span>
								{/if}
							</div>
						{/if}
					</div>

					<!-- Lyrics Content -->
					<div class="p-6">
						<div class="mb-4 flex items-center justify-between">
							<h3 class="text-foreground text-lg font-semibold">Lyrics</h3>
							<div class="flex gap-2">
								<Button variant="outline" size="sm" onclick={copyLyrics}>
									<Copy class="mr-1 h-4 w-4" />
									Copy
								</Button>
								{#if lyricsData.lyrics.metadata?.url}
									<a
										href={lyricsData.lyrics.metadata.url}
										target="_blank"
										rel="noopener noreferrer"
										class="border-input bg-background hover:bg-muted inline-flex items-center rounded-md border px-3 py-1.5 text-sm transition-colors"
									>
										<ExternalLink class="mr-1 h-4 w-4" />
										Last.fm
									</a>
								{/if}
							</div>
						</div>

						<div class="prose dark:prose-invert max-w-none">
							<pre class="text-foreground font-sans leading-relaxed whitespace-pre-wrap">{lyricsData
									.lyrics.lyrics}</pre>
						</div>

						<!-- Tags -->
						{#if lyricsData.lyrics.metadata?.tags?.length}
							<div class="mt-6">
								<h4 class="text-foreground mb-2 text-sm font-medium">Tags</h4>
								<div class="flex flex-wrap gap-2">
									{#each lyricsData.lyrics.metadata.tags as tag}
										<span class="bg-muted text-muted-foreground rounded-full px-2 py-1 text-xs">
											{tag}
										</span>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</Card>
			</div>
		{/if}

		<!-- Search History -->
		<div class={lyricsData ? '' : 'lg:col-span-3'}>
			{#if searchHistory.length > 0}
				<Card class="p-6">
					<h3 class="text-foreground mb-4 text-lg font-semibold">Recent Searches</h3>
					<div class="space-y-2">
						{#each searchHistory.slice(0, 8) as item}
							<button
								onclick={() => searchFromHistory(item)}
								class="border-border hover:bg-muted w-full rounded-lg border p-3 text-left transition-colors"
							>
								<div class="text-foreground text-sm font-medium">{item.title}</div>
								<div class="text-muted-foreground text-xs">by {item.artist}</div>
								<div class="text-muted-foreground mt-1 text-xs">
									{item.timestamp.toLocaleDateString()}
								</div>
							</button>
						{/each}
					</div>
				</Card>
			{/if}
		</div>
	</div>
</div>
