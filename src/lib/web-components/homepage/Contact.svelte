<!-- Contact Section Component -->
<script lang="ts">
	import { Mail, MessageSquare, Send, MapPin, Phone } from 'lucide-svelte';
	import Button from '$lib/web-components/ui/Button.svelte';
	import Card from '$lib/web-components/ui/Card.svelte';
	import Container from '$lib/web-components/ui/Container.svelte';

	let formData = $state({
		name: '',
		email: '',
		subject: '',
		message: ''
	});

	let isSubmitting = $state(false);
	let submitMessage = $state('');

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		isSubmitting = true;
		
		// Simulate form submission
		await new Promise(resolve => setTimeout(resolve, 1000));
		
		submitMessage = 'Thank you for your message! We\'ll get back to you soon.';
		formData = { name: '', email: '', subject: '', message: '' };
		isSubmitting = false;
		
		// Clear message after 5 seconds
		setTimeout(() => {
			submitMessage = '';
		}, 5000);
	}

	const contactInfo = [
		{
			icon: Mail,
			title: 'Email Us',
			content: 'hello@musicalzoe.com',
			description: 'Send us an email anytime'
		},
		{
			icon: Phone,
			title: 'Call Us',
			content: '+1 (555) 123-4567',
			description: 'Mon-Fri from 8am to 6pm'
		},
		{
			icon: MapPin,
			title: 'Visit Us',
			content: 'San Francisco, CA',
			description: 'Come say hello at our office'
		}
	];
</script>

<section id="contact" class="py-24 bg-background">
	<Container size="xl">
		<!-- Section Header -->
		<div class="text-center mb-20">
			<h2 class="text-4xl md:text-5xl font-bold text-foreground mb-6">
				Get in Touch
			</h2>
			<p class="text-xl text-muted-foreground max-w-3xl mx-auto">
				Have questions about our API? Need custom solutions? We'd love to hear from you and help bring your music project to life.
			</p>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
			<!-- Contact Information -->
			<div class="lg:col-span-1">
				<div class="space-y-8">
					{#each contactInfo as info}
						<div class="flex items-start space-x-4">
							<div class="flex-shrink-0">
								<div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
									<info.icon class="w-6 h-6 text-blue-600" />
								</div>
							</div>
							<div>
								<h3 class="text-lg font-semibold text-foreground mb-1">{info.title}</h3>
								<p class="text-blue-600 font-medium mb-1">{info.content}</p>
								<p class="text-muted-foreground text-sm">{info.description}</p>
							</div>
						</div>
					{/each}
				</div>

				<!-- Additional Info -->
				<Card class="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
					<div class="flex items-center space-x-3 mb-4">
						<MessageSquare class="w-6 h-6 text-blue-600" />
						<h3 class="text-lg font-semibold text-blue-900">Quick Response</h3>
					</div>
					<p class="text-blue-800 text-sm">
						We typically respond to all inquiries within 24 hours. For urgent technical issues, please include "URGENT" in your subject line.
					</p>
				</Card>
			</div>

			<!-- Contact Form -->
			<div class="lg:col-span-2">
				<Card class="h-full">
					<form onsubmit={handleSubmit} class="space-y-6">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label for="name" class="block text-sm font-medium text-foreground mb-2">
									Full Name
								</label>
								<input
									id="name"
									type="text"
									bind:value={formData.name}
									required
									class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-colors duration-200 bg-background text-foreground"
									placeholder="Your full name"
								/>
							</div>
							
							<div>
								<label for="email" class="block text-sm font-medium text-foreground mb-2">
									Email Address
								</label>
								<input
									id="email"
									type="email"
									bind:value={formData.email}
									required
									class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-colors duration-200 bg-background text-foreground"
									placeholder="your@email.com"
								/>
							</div>
						</div>

						<div>
							<label for="subject" class="block text-sm font-medium text-foreground mb-2">
								Subject
							</label>
							<input
								id="subject"
								type="text"
								bind:value={formData.subject}
								required
								class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-colors duration-200 bg-background text-foreground"
								placeholder="How can we help you?"
							/>
						</div>

						<div>
							<label for="message" class="block text-sm font-medium text-foreground mb-2">
								Message
							</label>
							<textarea
								id="message"
								bind:value={formData.message}
								required
								rows="6"
								class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-colors duration-200 resize-none bg-background text-foreground"
								placeholder="Tell us more about your project or question..."
							></textarea>
						</div>

						{#if submitMessage}
							<div class="bg-green-50 border border-green-200 rounded-lg p-4">
								<p class="text-green-800 text-sm">{submitMessage}</p>
							</div>
						{/if}

						<button
							type="submit"
							class="w-full bg-blue-600 text-white px-6 py-3 text-lg rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={isSubmitting}
						>
							{#if isSubmitting}
								<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
								Sending...
							{:else}
								<Send class="w-5 h-5 mr-2" />
								Send Message
							{/if}
						</button>
					</form>
				</Card>
			</div>
		</div>
	</Container>
</section>
