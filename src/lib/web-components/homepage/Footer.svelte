<!-- Footer Component -->
<script lang="ts">
	import { Music, Github, Twitter, Linkedin, Mail } from 'lucide-svelte';
	import Container from '$lib/web-components/ui/Container.svelte';

	const currentYear = new Date().getFullYear();

	const footerLinks = {
		product: [
			{ name: 'Features', href: '#features' },
			{ name: 'API Documentation', href: '/docs' },
			{ name: 'Pricing', href: '/pricing' },
			{ name: 'Status', href: '/status' }
		],
		company: [
			{ name: 'About Us', href: '/about' },
			{ name: 'Blog', href: '/blog' },
			{ name: 'Careers', href: '/careers' },
			{ name: 'Contact', href: '#contact' }
		],
		resources: [
			{ name: 'Support', href: '/support' },
			{ name: 'Community', href: '/community' },
			{ name: 'Developers', href: '/developers' },
			{ name: 'Partners', href: '/partners' }
		],
		legal: [
			{ name: 'Privacy Policy', href: '/privacy' },
			{ name: 'Terms of Service', href: '/terms' },
			{ name: 'Cookie Policy', href: '/cookies' },
			{ name: 'GDPR', href: '/gdpr' }
		]
	};

	const socialLinks = [
		{ name: 'GitHub', icon: Github, href: 'https://github.com/musicalzoe' },
		{ name: 'Twitter', icon: Twitter, href: 'https://twitter.com/musicalzoe' },
		{ name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/musicalzoe' },
		{ name: 'Email', icon: Mail, href: 'mailto:hello@musicalzoe.com' }
	];
</script>

<footer class="bg-secondary text-secondary-foreground">
	<Container size="xl">
		<!-- Main Footer Content -->
		<div class="py-16">
			<div class="grid grid-cols-1 lg:grid-cols-6 gap-12">
				<!-- Brand Section -->
				<div class="lg:col-span-2">
					<div class="flex items-center space-x-3 mb-6">
						<img 
							src="https://i.ibb.co/zhMky0qT/musical-zoe-high-resolution-logo-transparent.png" 
							alt="Musical Zoe Logo" 
							class="h-10 w-auto"
						/>
						<span class="text-2xl font-bold">Musical Zoe</span>
					</div>
					
					<p class="text-gray-400 dark:text-gray-500 mb-6 leading-relaxed">
						Your ultimate destination for music discovery. Explore trending tracks, get lyrics instantly, and stay updated with the latest music news.
					</p>
					
					<!-- Social Links -->
					<div class="flex space-x-4">
						{#each socialLinks as social}
							<a
								href={social.href}
								class="w-10 h-10 bg-gray-800 dark:bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 dark:hover:bg-blue-600 transition-colors duration-200"
								aria-label={social.name}
							>
								<svelte:component this={social.icon} class="w-5 h-5" />
							</a>
						{/each}
					</div>
				</div>

				<!-- Links Sections -->
				<div class="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
					<div>
						<h3 class="font-semibold text-white mb-4">Product</h3>
						<ul class="space-y-3">
							{#each footerLinks.product as link}
								<li>
									<a href={link.href} class="text-gray-400 hover:text-white transition-colors duration-200">
										{link.name}
									</a>
								</li>
							{/each}
						</ul>
					</div>

					<div>
						<h3 class="font-semibold text-white mb-4">Company</h3>
						<ul class="space-y-3">
							{#each footerLinks.company as link}
								<li>
									<a href={link.href} class="text-gray-400 hover:text-white transition-colors duration-200">
										{link.name}
									</a>
								</li>
							{/each}
						</ul>
					</div>

					<div>
						<h3 class="font-semibold text-white mb-4">Resources</h3>
						<ul class="space-y-3">
							{#each footerLinks.resources as link}
								<li>
									<a href={link.href} class="text-gray-400 hover:text-white transition-colors duration-200">
										{link.name}
									</a>
								</li>
							{/each}
						</ul>
					</div>

					<div>
						<h3 class="font-semibold text-white mb-4">Legal</h3>
						<ul class="space-y-3">
							{#each footerLinks.legal as link}
								<li>
									<a href={link.href} class="text-gray-400 hover:text-white transition-colors duration-200">
										{link.name}
									</a>
								</li>
							{/each}
						</ul>
					</div>
				</div>
			</div>
		</div>

		<!-- Bottom Section -->
		<div class="border-t border-gray-800 py-8">
			<div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
				<div class="text-gray-400 text-sm">
					© {currentYear} Musical Zoe. All rights reserved.
				</div>
				
				<div class="flex items-center space-x-6 text-sm text-gray-400">
					<span>Built with ❤️ using SvelteKit</span>
					<span>•</span>
					<span>Powered by Last.fm API</span>
				</div>
			</div>
		</div>
	</Container>
</footer>
