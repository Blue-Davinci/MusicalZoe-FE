<!-- Features Section Component -->
<script lang="ts">
	import { Newspaper, TrendingUp, FileText, Music, Zap, Shield } from 'lucide-svelte';
	import Card from '$lib/web-components/ui/Card.svelte';
	import Container from '$lib/web-components/ui/Container.svelte';

	const features = [
		{
			icon: Newspaper,
			title: 'Music News',
			description: 'Stay updated with the latest music industry news, artist announcements, and album releases from around the world.',
			color: 'blue'
		},
		{
			icon: TrendingUp,
			title: 'Trending Charts',
			description: 'Discover what\'s hot right now. Browse trending tracks and artists with real-time data from Last.fm.',
			color: 'purple'
		},
		{
			icon: FileText,
			title: 'Instant Lyrics',
			description: 'Get song lyrics instantly with advanced text processing, metadata, and beautiful formatting for the best reading experience.',
			color: 'indigo'
		},
		{
			icon: Music,
			title: 'Track Information',
			description: 'Access detailed track metadata including play counts, album information, tags, and artist details.',
			color: 'pink'
		},
		{
			icon: Zap,
			title: 'Fast & Reliable',
			description: 'Lightning-fast API responses with intelligent caching and error handling for the best user experience.',
			color: 'orange'
		},
		{
			icon: Shield,
			title: 'Secure & Private',
			description: 'Your data is protected with industry-standard security measures and privacy-focused authentication.',
			color: 'green'
		}
	];

	const colorClasses: Record<string, { bg: string; icon: string; title: string }> = {
		blue: {
			bg: 'bg-blue-50',
			icon: 'text-blue-600',
			title: 'text-blue-900'
		},
		purple: {
			bg: 'bg-purple-50',
			icon: 'text-purple-600',
			title: 'text-purple-900'
		},
		indigo: {
			bg: 'bg-indigo-50',
			icon: 'text-indigo-600',
			title: 'text-indigo-900'
		},
		pink: {
			bg: 'bg-pink-50',
			icon: 'text-pink-600',
			title: 'text-pink-900'
		},
		orange: {
			bg: 'bg-orange-50',
			icon: 'text-orange-600',
			title: 'text-orange-900'
		},
		green: {
			bg: 'bg-green-50',
			icon: 'text-green-600',
			title: 'text-green-900'
		}
	};
</script>

<section id="features" class="py-24 bg-muted/50">
	<Container size="xl">
		<!-- Section Header -->
		<div class="text-center mb-20">
			<h2 class="text-4xl md:text-5xl font-bold text-foreground mb-6">
				Powerful Features for Music Lovers
			</h2>
			<p class="text-xl text-muted-foreground max-w-3xl mx-auto">
				Everything you need to explore, discover, and enjoy music. Built with modern technology and designed for performance.
			</p>
		</div>

		<!-- Features Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each features as feature}
				<Card class="group hover:scale-105 transition-all duration-300 border-0 shadow-lg hover:shadow-xl">
					<div class={`w-16 h-16 rounded-2xl ${colorClasses[feature.color].bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
						<feature.icon class={`w-8 h-8 ${colorClasses[feature.color].icon}`} />
					</div>
					
					<h3 class={`text-xl font-semibold mb-4 ${colorClasses[feature.color].title}`}>
						{feature.title}
					</h3>
					
					<p class="text-muted-foreground leading-relaxed">
						{feature.description}
					</p>
				</Card>
			{/each}
		</div>

		<!-- Bottom CTA -->
		<div class="text-center mt-16">
			<div class="inline-flex items-center justify-center p-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
				<a href="/auth/signup" class="bg-white text-gray-900 px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors duration-200">
					Start Exploring Now →
				</a>
			</div>
		</div>
	</Container>
</section>
