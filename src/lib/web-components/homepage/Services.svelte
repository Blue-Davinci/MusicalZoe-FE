<!-- Services Section Component -->
<script lang="ts">
	import { Code, Database, Cpu, Globe } from 'lucide-svelte';
	import Card from '$lib/web-components/ui/Card.svelte';
	import Container from '$lib/web-components/ui/Container.svelte';

	const services = [
		{
			icon: Globe,
			title: 'Global Music News',
			description: 'Access music news from around the world with intelligent filtering by country, genre, and type.',
			features: ['Multi-country support', 'Genre-specific filtering', 'Real-time updates', 'Curated content']
		},
		{
			icon: Database,
			title: 'Comprehensive Music Data',
			description: 'Rich metadata and analytics for tracks, artists, and albums powered by Last.fm integration.',
			features: ['Track analytics', 'Artist information', 'Album metadata', 'Play statistics']
		},
		{
			icon: Code,
			title: 'Developer-Friendly API',
			description: 'Clean, well-documented API endpoints with consistent response formats and error handling.',
			features: ['RESTful design', 'JSON responses', 'Error handling', 'Rate limiting']
		},
		{
			icon: Cpu,
			title: 'High Performance',
			description: 'Optimized for speed with intelligent caching, timeout handling, and reliable data sources.',
			features: ['Fast responses', 'Smart caching', 'Timeout protection', 'High availability']
		}
	];
</script>

<section class="py-24 bg-background">
	<Container size="xl">
		<!-- Section Header -->
		<div class="text-center mb-20">
			<h2 class="text-4xl md:text-5xl font-bold text-foreground mb-6">
				Our Services
			</h2>
			<p class="text-xl text-muted-foreground max-w-3xl mx-auto">
				Professional-grade music data services designed for developers, businesses, and music enthusiasts.
			</p>
		</div>

		<!-- Services Grid -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
			{#each services as service}
				<Card class="h-full">
					<div class="flex items-start space-x-4">
						<div class="flex-shrink-0">
							<div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
								<svelte:component this={service.icon} class="w-6 h-6 text-blue-600" />
							</div>
						</div>
						
						<div class="flex-1">
							<h3 class="text-xl font-semibold text-foreground mb-3">
								{service.title}
							</h3>
							
							<p class="text-muted-foreground mb-4">
								{service.description}
							</p>
							
							<ul class="space-y-2">
								{#each service.features as feature}
									<li class="flex items-center text-sm text-muted-foreground">
										<div class="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></div>
										{feature}
									</li>
								{/each}
							</ul>
						</div>
					</div>
				</Card>
			{/each}
		</div>

		<!-- API Showcase -->
		<div class="mt-20">
			<Card class="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
				<div class="text-center">
					<h3 class="text-2xl font-semibold mb-4">Ready to Get Started?</h3>
					<p class="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
						Join thousands of developers and music enthusiasts using Musical Zoe to power their applications and discover new music.
					</p>
					
					<div class="flex flex-col sm:flex-row gap-4 justify-center">
						<a href="/auth/signup" class="bg-background text-foreground px-8 py-3 rounded-lg font-medium hover:bg-muted transition-colors duration-200">
							Create Free Account
						</a>
						<a href="#contact" class="border border-border text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary-foreground/10 transition-colors duration-200">
							Get in Touch
						</a>
					</div>
				</div>
			</Card>
		</div>
	</Container>
</section>
