<!-- Services Section Component -->
<script lang="ts">
	import { Code, Database, Cpu, Globe } from 'lucide-svelte';
	import Card from '$lib/web-components/ui/Card.svelte';
	import Container from '$lib/web-components/ui/Container.svelte';

	const services = [
		{
			icon: Globe,
			title: 'Global Music News',
			description:
				'Access music news from around the world with intelligent filtering by country, genre, and type.',
			features: [
				'Multi-country support',
				'Genre-specific filtering',
				'Real-time updates',
				'Curated content'
			]
		},
		{
			icon: Database,
			title: 'Comprehensive Music Data',
			description:
				'Rich metadata and analytics for tracks, artists, and albums powered by Last.fm integration.',
			features: ['Track analytics', 'Artist information', 'Album metadata', 'Play statistics']
		},
		{
			icon: Code,
			title: 'Developer-Friendly API',
			description:
				'Clean, well-documented API endpoints with consistent response formats and error handling.',
			features: ['RESTful design', 'JSON responses', 'Error handling', 'Rate limiting']
		},
		{
			icon: Cpu,
			title: 'High Performance',
			description:
				'Optimized for speed with intelligent caching, timeout handling, and reliable data sources.',
			features: ['Fast responses', 'Smart caching', 'Timeout protection', 'High availability']
		}
	];
</script>

<section class="bg-background py-24">
	<Container size="xl">
		<!-- Section Header -->
		<div class="mb-20 text-center">
			<h2 class="text-foreground mb-6 text-4xl font-bold md:text-5xl">Our Services</h2>
			<p class="text-muted-foreground mx-auto max-w-3xl text-xl">
				Professional-grade music data services designed for developers, businesses, and music
				enthusiasts.
			</p>
		</div>

		<!-- Services Grid -->
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
			{#each services as service}
				{@const IconComponent = service.icon}
				<Card class="h-full">
					<div class="flex items-start space-x-4">
						<div class="flex-shrink-0">
							<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
								<IconComponent class="h-6 w-6 text-blue-600" />
							</div>
						</div>

						<div class="flex-1">
							<h3 class="text-foreground mb-3 text-xl font-semibold">
								{service.title}
							</h3>

							<p class="text-muted-foreground mb-4">
								{service.description}
							</p>

							<ul class="space-y-2">
								{#each service.features as feature}
									<li class="text-muted-foreground flex items-center text-sm">
										<div class="mr-3 h-1.5 w-1.5 rounded-full bg-blue-600"></div>
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
			<Card class="from-primary to-primary/80 text-primary-foreground bg-gradient-to-r">
				<div class="text-center">
					<h3 class="mb-4 text-2xl font-semibold">Ready to Get Started?</h3>
					<p class="text-primary-foreground/80 mx-auto mb-8 max-w-2xl">
						Join thousands of developers and music enthusiasts using Musical Zoe to power their
						applications and discover new music.
					</p>

					<div class="flex flex-col justify-center gap-4 sm:flex-row">
						<a
							href="/auth/signup"
							class="bg-background text-foreground hover:bg-muted rounded-lg px-8 py-3 font-medium transition-colors duration-200"
						>
							Create Free Account
						</a>
						<a
							href="#contact"
							class="border-border text-primary-foreground hover:bg-primary-foreground/10 rounded-lg border px-8 py-3 font-medium transition-colors duration-200"
						>
							Get in Touch
						</a>
					</div>
				</div>
			</Card>
		</div>
	</Container>
</section>
