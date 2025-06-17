<!-- Hero Section Component -->
<script lang="ts">
	import { Music, Search, TrendingUp, Headphones } from 'lucide-svelte';
	import Button from '$lib/web-components/ui/Button.svelte';
	import Container from '$lib/web-components/ui/Container.svelte';

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

<section class="relative min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:bg-gradient-to-br dark:from-background dark:via-muted dark:to-card flex items-center">`
	<!-- Background Pattern -->
	<div class="absolute inset-0 opacity-5 dark:opacity-10">
		<div class="absolute inset-0" style="background-image: radial-gradient(circle, rgb(59 130 246) 1px, transparent 1px); background-size: 50px 50px;"></div>
	</div>

	<!-- Floating Elements -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		<div class="absolute top-20 left-10 animate-bounce delay-100">
			<Music class="w-8 h-8 text-blue-400 dark:text-blue-300 opacity-60" />
		</div>
		<div class="absolute top-40 right-20 animate-bounce delay-300">
			<TrendingUp class="w-6 h-6 text-purple-400 dark:text-purple-300 opacity-60" />
		</div>
		<div class="absolute bottom-40 left-20 animate-bounce delay-500">
			<Headphones class="w-10 h-10 text-cyan-400 dark:text-cyan-300 opacity-60" />
		</div>
	</div>

	<Container size="xl" class="relative z-10">
		<div class="text-center">
			<!-- Logo and Main Heading -->
			<div class="mb-8">
				<!-- Logo -->
				<div class="mb-6 flex justify-center">
					<img 
						src="https://i.ibb.co/zhMky0qT/musical-zoe-high-resolution-logo-transparent.png" 
						alt="Musical Zoe Logo" 
						class="h-20 sm:h-24 md:h-28 lg:h-32 w-auto drop-shadow-xl"
					/>
				</div>
				
				<h1 class="text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent mb-4">
					Musical Zoe
				</h1>
				<p class="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
					Your ultimate destination for music discovery. Explore trending tracks, get lyrics instantly, and stay updated with the latest music news.
				</p>
			</div>

			<!-- Search Bar -->
			<div class="mb-12 max-w-2xl mx-auto">
				<div class="relative group">
					<div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
					<div class="relative flex items-center bg-card rounded-full shadow-lg border border-border overflow-hidden">
						<input
							bind:value={searchQuery}
							onkeypress={handleKeyPress}
							type="text"
							placeholder="Search for artists, songs, or lyrics..."
							class="flex-1 px-6 py-4 text-lg focus:outline-none bg-transparent text-card-foreground placeholder:text-muted-foreground"
						/>
						<Button
							variant="primary"
							size="lg"
							onclick={handleSearch}
							class="rounded-full m-1 px-8"
						>
							<Search class="w-5 h-5 mr-2" />
							Search
						</Button>
					</div>
				</div>
			</div>

			<!-- CTA Buttons -->
			<div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
				<Button variant="primary" size="lg" href="/auth/signup" class="px-8 py-4">
					Get Started Free
				</Button>
				<Button variant="outline" size="lg" href="#features" class="px-8 py-4">
					Explore Features
				</Button>
			</div>

			<!-- Stats -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
				<div class="text-center">
					<div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">1M+</div>
					<div class="text-gray-600 dark:text-gray-300">Songs & Lyrics</div>
				</div>
				<div class="text-center">
					<div class="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">24/7</div>
					<div class="text-gray-600 dark:text-gray-300">Music News</div>
				</div>
				<div class="text-center">
					<div class="text-3xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">Real-time</div>
					<div class="text-gray-600 dark:text-gray-300">Trending Charts</div>
				</div>
			</div>
		</div>
	</Container>
</section>
