<script lang="ts">
	import { getContext } from 'svelte';
	import { Music, Search, TrendingUp, Headphones } from 'lucide-svelte';
	import Button from '$lib/web-components/ui/Button.svelte';
	import Container from '$lib/web-components/ui/Container.svelte';
	import type { User } from '$lib/utils/token-helpers';

	// Get authentication context function
	const getAuth = getContext<
		() => {
			user: User | null;
			isAuthenticated: boolean;
			isAdmin: boolean;
			isVerified: boolean;
		}
	>('auth');

	// Create reactive auth data using $derived
	const auth = $derived(getAuth());

	let searchQuery = $state('');

	function handleSearch() {
		if (searchQuery.trim()) {
			// This will be implemented when we add search functionality
			console.log('Searching for:', searchQuery);
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleSearch();
		}
	}
</script>

<section
	class="dark:from-background dark:via-muted dark:to-card relative flex min-h-screen items-center bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:bg-gradient-to-br"
>
	`
	<!-- Background Pattern -->
	<div class="absolute inset-0 opacity-5 dark:opacity-10">
		<div
			class="absolute inset-0"
			style="background-image: radial-gradient(circle, rgb(59 130 246) 1px, transparent 1px); background-size: 50px 50px;"
		></div>
	</div>

	<!-- Floating Elements -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		<div class="absolute top-20 left-10 animate-bounce delay-100">
			<Music class="h-8 w-8 text-blue-400 opacity-60 dark:text-blue-300" />
		</div>
		<div class="absolute top-40 right-20 animate-bounce delay-300">
			<TrendingUp class="h-6 w-6 text-purple-400 opacity-60 dark:text-purple-300" />
		</div>
		<div class="absolute bottom-40 left-20 animate-bounce delay-500">
			<Headphones class="h-10 w-10 text-cyan-400 opacity-60 dark:text-cyan-300" />
		</div>
	</div>

	<Container size="xl" class="relative z-10">
		<div class="text-center">
			<!-- Logo and Main Heading -->
			<div class="mb-8">
				<!-- Musical Logo Design -->
				<div class="mb-6 flex justify-center">
					<div class="relative">
						<!-- Animated background glow -->
						<div class="absolute inset-0 animate-pulse">
							<div
								class="h-24 w-24 rounded-full bg-gradient-to-br from-purple-500/30 via-pink-500/30 to-blue-500/30 blur-xl sm:h-28 sm:w-28 md:h-32 md:w-32 lg:h-36 lg:w-36"
							></div>
						</div>

						<!-- Main logo container -->
						<div class="relative flex flex-col items-center space-y-2">
							<!-- Musical note icon with gradient background -->
							<div
								class="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 shadow-2xl sm:h-20 sm:w-20 md:h-24 md:w-24"
							>
								<Music class="h-8 w-8 text-white sm:h-10 sm:w-10 md:h-12 md:w-12" />
							</div>

							<!-- Musical Zoe text with enhanced styling -->
							<div class="text-center">
								<h1
									class="bg-gradient-to-r from-slate-800 via-purple-700 to-blue-700 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl md:text-6xl lg:text-7xl dark:from-white dark:via-purple-200 dark:to-blue-200"
								>
									Musical Zoe
								</h1>
								<!-- Musical accent line -->
								<div
									class="mx-auto mt-2 h-1 w-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 sm:w-32 md:w-40"
								></div>
							</div>
						</div>
					</div>
				</div>

				<p class="text-muted-foreground mx-auto max-w-3xl text-xl leading-relaxed md:text-2xl">
					Your ultimate destination for music discovery. Explore trending tracks, get lyrics
					instantly, and stay updated with the latest music news.
				</p>
			</div>

			<!-- Search Bar -->
			<div class="mx-auto mb-12 max-w-2xl">
				<div class="group relative">
					<div
						class="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-25 blur-lg transition-opacity duration-300 group-hover:opacity-40"
					></div>
					<div
						class="bg-card border-border relative flex items-center overflow-hidden rounded-full border shadow-lg"
					>
						<input
							bind:value={searchQuery}
							onkeypress={handleKeyPress}
							type="text"
							placeholder="Search for artists, songs, or lyrics..."
							class="text-card-foreground placeholder:text-muted-foreground flex-1 bg-transparent px-6 py-4 text-lg focus:outline-none"
						/>
						<Button
							variant="primary"
							size="lg"
							onclick={handleSearch}
							class="m-1 rounded-full px-8"
						>
							<Search class="mr-2 h-5 w-5" />
							Search
						</Button>
					</div>
				</div>
			</div>

			<!-- CTA Buttons -->
			<div class="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
				{#if !auth.isAuthenticated}
					<Button variant="primary" size="lg" href="/auth/signup" class="px-8 py-4">
						Get Started Free
					</Button>
				{/if}
				<Button variant="outline" size="lg" href="#features" class="px-8 py-4">
					Explore Features
				</Button>
			</div>

			<!-- Stats -->
			<div class="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
				<div class="text-center">
					<div class="mb-2 text-3xl font-bold text-blue-600 dark:text-blue-400">1M+</div>
					<div class="text-gray-600 dark:text-gray-300">Songs & Lyrics</div>
				</div>
				<div class="text-center">
					<div class="mb-2 text-3xl font-bold text-purple-600 dark:text-purple-400">24/7</div>
					<div class="text-gray-600 dark:text-gray-300">Music News</div>
				</div>
				<div class="text-center">
					<div class="mb-2 text-3xl font-bold text-cyan-600 dark:text-cyan-400">Real-time</div>
					<div class="text-gray-600 dark:text-gray-300">Trending Charts</div>
				</div>
			</div>
		</div>
	</Container>
</section>
