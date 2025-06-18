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
		<div class="mb-6 flex items-center space-x-3">
			<div class="rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 p-2">
				<Music class="h-5 w-5 text-white" />
			</div>
			<div>
				<h3 class="text-foreground text-lg font-semibold">Quick Lyrics Search</h3>
				<p class="text-muted-foreground text-sm">Find lyrics and track information</p>
			</div>
		</div>

		<!-- Search Form -->
		<div class="space-y-4">
			<div class="space-y-3">
				<div>
					<label for="artist" class="text-foreground mb-1 block text-sm font-medium">
						Artist
					</label>
					<input
						id="artist"
						type="text"
						bind:value={artist}
						onkeypress={handleKeyPress}
						placeholder="e.g., Coldplay"
						class="border-border bg-background text-foreground placeholder-muted-foreground focus:ring-primary w-full rounded-md border px-3 py-2 transition-colors focus:border-transparent focus:ring-2 focus:outline-none"
						disabled={loading}
					/>
				</div>
				<div>
					<label for="title" class="text-foreground mb-1 block text-sm font-medium">
						Song Title
					</label>
					<input
						id="title"
						type="text"
						bind:value={title}
						onkeypress={handleKeyPress}
						placeholder="e.g., Yellow"
						class="border-border bg-background text-foreground placeholder-muted-foreground focus:ring-primary w-full rounded-md border px-3 py-2 transition-colors focus:border-transparent focus:ring-2 focus:outline-none"
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
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						Searching...
					{:else}
						<Search class="mr-2 h-4 w-4" />
						Search Lyrics
					{/if}
				</Button>
				{#if artist || title || result}
					<Button variant="outline" onclick={clearSearch} disabled={loading}>Clear</Button>
				{/if}
			</div>
		</div>

		<!-- Error Display -->
		{#if error}
			<div class="bg-destructive/10 border-destructive/20 mt-4 rounded-md border p-3">
				<p class="text-destructive text-sm">{error}</p>
			</div>
		{/if}

		<!-- Results Display -->
		{#if result}
			<div class="border-border mt-6 border-t pt-6">
				<div class="flex items-start space-x-4">
					{#if result.lyrics.metadata?.images?.length}
						<img
							src={result.lyrics.metadata.images.find((img) => img.size === 'large')?.['#text'] ||
								result.lyrics.metadata.images[0]['#text']}
							alt="{result.lyrics.title} by {result.lyrics.artist}"
							class="h-16 w-16 rounded-md object-cover"
							loading="lazy"
						/>
					{:else}
						<div class="bg-muted flex h-16 w-16 items-center justify-center rounded-md">
							<Music class="text-muted-foreground h-8 w-8" />
						</div>
					{/if}

					<div class="min-w-0 flex-1">
						<h4 class="text-foreground text-lg font-semibold">
							{result.lyrics.title}
						</h4>
						<p class="text-muted-foreground">
							by {result.lyrics.artist}
						</p>

						{#if result.lyrics.metadata?.album}
							<p class="text-muted-foreground mt-1 text-sm">
								Album: {result.lyrics.metadata.album}
							</p>
						{/if}
					</div>
				</div>

				<!-- Lyrics Preview -->
				{#if result.lyrics.lyrics}
					<div class="bg-muted/50 mt-4 rounded-md p-4">
						<h5 class="text-foreground mb-2 text-sm font-medium">Lyrics Preview:</h5>
						<p class="text-muted-foreground text-sm whitespace-pre-wrap">
							{truncateText(result.lyrics.lyrics, 200)}
						</p>
					</div>
				{/if}

				<div class="mt-4">
					<Button
						variant="outline"
						href="/dashboard/lyrics?artist={encodeURIComponent(
							result.lyrics.artist
						)}&title={encodeURIComponent(result.lyrics.title)}"
						class="w-full"
					>
						View Full Lyrics & Details
					</Button>
				</div>
			</div>
		{/if}
	</div>
</Card>
