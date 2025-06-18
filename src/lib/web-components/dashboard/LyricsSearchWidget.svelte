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
</script>

<Card class="flex h-full flex-col">
	<div class="flex flex-1 flex-col overflow-y-auto p-6">
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
		<div class="flex-shrink-0 space-y-4">
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
				<Button variant="outline" href="/dashboard/lyrics">
					<Music class="mr-2 h-4 w-4" />
					Full Page
				</Button>
			</div>
		</div>

		<!-- Error Display -->
		{#if error}
			<div class="bg-destructive/10 border-destructive/20 mt-4 flex-shrink-0 rounded-md border p-3">
				<p class="text-destructive text-sm">{error}</p>
			</div>
		{/if}

		<!-- Results Display -->
		{#if result && result.lyrics}
			<div class="border-border mt-6 flex-shrink-0 border-t pt-4">
				<!-- Track Info Header -->
				<div class="mb-6 flex items-start space-x-4">
					{#if result.lyrics.metadata?.images?.length}
						<img
							src={result.lyrics.metadata.images.find((img) => img.size === 'large')?.['#text'] ||
								result.lyrics.metadata.images[0]['#text']}
							alt="{result.lyrics.title} by {result.lyrics.artist}"
							class="h-16 w-16 flex-shrink-0 rounded-md object-cover shadow-sm"
							loading="lazy"
						/>
					{:else}
						<div
							class="bg-muted flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-md shadow-sm"
						>
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

				<!-- Divider -->
				<div class="relative mb-6">
					<div class="absolute inset-0 flex items-center">
						<div class="border-border w-full border-t"></div>
					</div>
					<div class="relative flex justify-center text-xs uppercase">
						<span class="bg-background text-muted-foreground px-3">Lyrics</span>
					</div>
				</div>

				<!-- Lyrics Container with Beautiful Styling -->
				<div
					class="from-muted/30 to-muted/50 border-border/50 mb-6 overflow-hidden rounded-lg border bg-gradient-to-br shadow-sm"
				>
					<!-- Lyrics Header -->
					<div class="bg-muted/80 border-border/50 border-b px-4 py-3">
						<div class="flex items-center space-x-2">
							<Music class="text-primary h-4 w-4" />
							<span class="text-foreground text-sm font-medium">Song Lyrics</span>
						</div>
					</div>

					<!-- Lyrics Content -->
					<div class="max-h-80 overflow-y-auto p-6">
						<div class="prose prose-sm max-w-none">
							<p
								class="text-foreground text-sm leading-relaxed font-medium tracking-wide whitespace-pre-line"
							>
								{result.lyrics.lyrics}
							</p>
						</div>
					</div>
				</div>

				<!-- Action Button -->
				<div class="flex justify-center">
					<Button variant="outline" size="sm" href="/dashboard/lyrics" class="shadow-sm">
						<Music class="mr-2 h-4 w-4" />
						Open in Full Lyrics Page
					</Button>
				</div>
			</div>
		{/if}
	</div>
</Card>
