<!-- Features Section Component -->
<script lang="ts">
	import { Newspaper, TrendingUp, FileText, Music, Zap, Shield } from 'lucide-svelte';
	import Card from '$lib/web-components/ui/Card.svelte';
	import Container from '$lib/web-components/ui/Container.svelte';

	const features = [
		{
			icon: Newspaper,
			title: 'Music News',
			description:
				'Stay updated with the latest music industry news, artist announcements, and album releases from around the world.',
			color: 'blue'
		},
		{
			icon: TrendingUp,
			title: 'Trending Charts',
			description:
				"Discover what's hot right now. Browse trending tracks and artists with real-time data from Last.fm.",
			color: 'purple'
		},
		{
			icon: FileText,
			title: 'Instant Lyrics',
			description:
				'Get song lyrics instantly with advanced text processing, metadata, and beautiful formatting for the best reading experience.',
			color: 'indigo'
		},
		{
			icon: Music,
			title: 'Track Information',
			description:
				'Access detailed track metadata including play counts, album information, tags, and artist details.',
			color: 'pink'
		},
		{
			icon: Zap,
			title: 'Fast & Reliable',
			description:
				'Lightning-fast API responses with intelligent caching and error handling for the best user experience.',
			color: 'orange'
		},
		{
			icon: Shield,
			title: 'Secure & Private',
			description:
				'Your data is protected with industry-standard security measures and privacy-focused authentication.',
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

<section id="features" class="bg-muted/50 py-24">
	<Container size="xl">
		<!-- Section Header -->
		<div class="mb-20 text-center">
			<h2 class="text-foreground mb-6 text-4xl font-bold md:text-5xl">
				Powerful Features for Music Lovers
			</h2>
			<p class="text-muted-foreground mx-auto max-w-3xl text-xl">
				Everything you need to explore, discover, and enjoy music. Built with modern technology and
				designed for performance.
			</p>
		</div>

		<!-- Features Grid -->
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each features as feature}
				<Card
					class="group border-0 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
				>
					<div
						class={`h-16 w-16 rounded-2xl ${colorClasses[feature.color].bg} mb-6 flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
					>
						<feature.icon class={`h-8 w-8 ${colorClasses[feature.color].icon}`} />
					</div>

					<h3 class={`mb-4 text-xl font-semibold ${colorClasses[feature.color].title}`}>
						{feature.title}
					</h3>

					<p class="text-muted-foreground leading-relaxed">
						{feature.description}
					</p>
				</Card>
			{/each}
		</div>

		<!-- Bottom CTA -->
		<div class="mt-16 text-center">
			<div
				class="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 p-1"
			>
				<a
					href="/auth/signup"
					class="rounded-full bg-white px-8 py-3 font-medium text-gray-900 transition-colors duration-200 hover:bg-gray-50"
				>
					Start Exploring Now →
				</a>
			</div>
		</div>
	</Container>
</section>
