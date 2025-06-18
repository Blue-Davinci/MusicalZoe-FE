<script lang="ts">
	import { Search, Music, Loader2 } from 'lucide-svelte';
	import Card from '../ui/Card.svelte';
	import Button from '../ui/Button.svelte';
	import type { LyricsResponse, ApiError } from '$lib/types/music-api';

	let artist = $state('');
	let title = $state('');
	let loading = $state(false);
	let result = $state<LyricsResponse | null>(null);
	let error = $state<string | null>(null);

	async function searchLyrics() {
		if (!artist.trim() || !title.trim()) {
			error = 'Please enter both artist and song title';
			return;
		}

		loading = true;
		error = null;
		result = null;

		try {
			const params = new URLSearchParams({
				artist: artist.trim(),
				title: title.trim(),
				metadata: 'true'
			});

			const response = await fetch(`/api/music/lyrics?${params}`);
			const data = await response.json();

			if (!response.ok) {
				error = (data as ApiError).error || 'Failed to fetch lyrics';
				return;
			}

			result = data as LyricsResponse;
		} catch (err) {
			error = 'An unexpected error occurred';
			console.error('Lyrics search error:', err);
		} finally {
			loading = false;
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			searchLyrics();
		}
	}

	function clearSearch() {
		artist = '';
		title = '';
		result = null;
		error = null;
	}

	function truncateText(text: string, maxLength: number): string {
		if (text.length <= maxLength) return text;
		return text.slice(0, maxLength).trim() + '...';
	}
</script>

<Card class="overflow-hidden">
	<div class="p-6">
		<!-- Header -->
		<div class="flex items-center space-x-3 mb-6">
			<div class="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
				<Music class="h-5 w-5 text-white" />
			</div>
			<div>
				<h3 class="text-lg font-semibold text-foreground">Quick Lyrics Search</h3>
				<p class="text-sm text-muted-foreground">Find lyrics and track information</p>
			</div>
		</div>

		<!-- Search Form -->
		<div class="space-y-4">
			<div class="space-y-3">
				<div>
					<label for="artist" class="block text-sm font-medium text-foreground mb-1">
						Artist
					</label>
					<input
						id="artist"
						type="text"
						bind:value={artist}
						onkeypress={handleKeyPress}
						placeholder="e.g., Coldplay"
						class="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
						disabled={loading}
					/>
				</div>
				<div>
					<label for="title" class="block text-sm font-medium text-foreground mb-1">
						Song Title
					</label>
					<input
						id="title"
						type="text"
						bind:value={title}
						onkeypress={handleKeyPress}
						placeholder="e.g., Yellow"
						class="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
						disabled={loading}
					/>
				</div>
			</div>

			<div class="flex space-x-3">
				<Button 
					onclick={searchLyrics}
					disabled={loading || !artist.trim() || !title.trim()}
					class="flex-1"
				>
					{#if loading}
						<Loader2 class="h-4 w-4 mr-2 animate-spin" />
						Searching...
					{:else}
						<Search class="h-4 w-4 mr-2" />
						Search Lyrics
					{/if}
				</Button>
				{#if artist || title || result}
					<Button variant="outline" onclick={clearSearch} disabled={loading}>
						Clear
					</Button>
				{/if}
			</div>
		</div>

		<!-- Error Display -->
		{#if error}
			<div class="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
				<p class="text-sm text-destructive">{error}</p>
			</div>
		{/if}

		<!-- Results Display -->
		{#if result}
			<div class="mt-6 border-t border-border pt-6">
				<div class="flex items-start space-x-4">
					{#if result.lyrics.metadata?.images?.length}
						<img
							src={result.lyrics.metadata.images.find(img => img.size === 'large')?.['#text'] || 
								 result.lyrics.metadata.images[0]['#text']}
							alt="{result.lyrics.title} by {result.lyrics.artist}"
							class="w-16 h-16 rounded-md object-cover"
							loading="lazy"
						/>
					{:else}
						<div class="w-16 h-16 rounded-md bg-muted flex items-center justify-center">
							<Music class="h-8 w-8 text-muted-foreground" />
						</div>
					{/if}

					<div class="flex-1 min-w-0">
						<h4 class="text-lg font-semibold text-foreground">
							{result.lyrics.title}
						</h4>
						<p class="text-muted-foreground">
							by {result.lyrics.artist}
						</p>
						
						{#if result.lyrics.metadata?.album}
							<p class="text-sm text-muted-foreground mt-1">
								Album: {result.lyrics.metadata.album}
							</p>
						{/if}
					</div>
				</div>

				<!-- Lyrics Preview -->
				{#if result.lyrics.lyrics}
					<div class="mt-4 p-4 bg-muted/50 rounded-md">
						<h5 class="text-sm font-medium text-foreground mb-2">Lyrics Preview:</h5>
						<p class="text-sm text-muted-foreground whitespace-pre-wrap">
							{truncateText(result.lyrics.lyrics, 200)}
						</p>
					</div>
				{/if}

				<div class="mt-4">
					<Button 
						variant="outline" 
						href="/dashboard/lyrics?artist={encodeURIComponent(result.lyrics.artist)}&title={encodeURIComponent(result.lyrics.title)}"
						class="w-full"
					>
						View Full Lyrics & Details
					</Button>
				</div>
			</div>
		{/if}
	</div>
</Card>
