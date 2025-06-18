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

<footer class="bg-slate-900 dark:bg-slate-950 text-slate-100">
	<Container size="xl">
		<!-- Main Footer Content -->
		<div class="py-16">
			<div class="grid grid-cols-1 gap-12 lg:grid-cols-6">
				<!-- Brand Section -->
				<div class="lg:col-span-2">
					<div class="mb-6 flex items-center space-x-3">
						<img
							src="https://i.ibb.co/zhMky0qT/musical-zoe-high-resolution-logo-transparent.png"
							alt="Musical Zoe Logo"
							class="h-10 w-auto"
						/>
						<span class="text-2xl font-bold text-white">Musical Zoe</span>
					</div>

					<p class="mb-6 leading-relaxed text-slate-300">
						Your ultimate destination for music discovery. Explore trending tracks, get lyrics
						instantly, and stay updated with the latest music news.
					</p>

					<!-- Social Links -->
					<div class="flex space-x-4">
						{#each socialLinks as social}
							{@const IconComponent = social.icon}
							<a
								href={social.href}
								class="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 text-slate-300 hover:text-white transition-all duration-200"
								aria-label={social.name}
							>
								<IconComponent class="h-5 w-5" />
							</a>
						{/each}
					</div>
				</div>

				<!-- Links Sections -->
				<div class="grid grid-cols-2 gap-8 md:grid-cols-4 lg:col-span-4">
					<div>
						<h3 class="mb-4 font-semibold text-white">Product</h3>
						<ul class="space-y-3">
							{#each footerLinks.product as link}
								<li>
									<a
										href={link.href}
										class="text-slate-300 transition-colors duration-200 hover:text-purple-300"
									>
										{link.name}
									</a>
								</li>
							{/each}
						</ul>
					</div>

					<div>
						<h3 class="mb-4 font-semibold text-white">Company</h3>
						<ul class="space-y-3">
							{#each footerLinks.company as link}
								<li>
									<a
										href={link.href}
										class="text-slate-300 transition-colors duration-200 hover:text-purple-300"
									>
										{link.name}
									</a>
								</li>
							{/each}
						</ul>
					</div>

					<div>
						<h3 class="mb-4 font-semibold text-white">Resources</h3>
						<ul class="space-y-3">
							{#each footerLinks.resources as link}
								<li>
									<a
										href={link.href}
										class="text-slate-300 transition-colors duration-200 hover:text-purple-300"
									>
										{link.name}
									</a>
								</li>
							{/each}
						</ul>
					</div>

					<div>
						<h3 class="mb-4 font-semibold text-white">Legal</h3>
						<ul class="space-y-3">
							{#each footerLinks.legal as link}
								<li>
									<a
										href={link.href}
										class="text-slate-300 transition-colors duration-200 hover:text-purple-300"
									>
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
		<div class="border-t border-slate-800 py-8">
			<div class="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
				<div class="text-sm text-slate-400">
					© {currentYear} Musical Zoe. All rights reserved.
				</div>

				<div class="flex items-center space-x-6 text-sm text-slate-400">
					<span>Built with ❤️ using SvelteKit</span>
					<span>•</span>
					<span>Powered by Last.fm API</span>
				</div>
			</div>
		</div>
	</Container>
</footer>
