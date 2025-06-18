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
		await new Promise((resolve) => setTimeout(resolve, 1000));

		submitMessage = "Thank you for your message! We'll get back to you soon.";
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

<section id="contact" class="bg-background py-24">
	<Container size="xl">
		<!-- Section Header -->
		<div class="mb-20 text-center">
			<h2 class="text-foreground mb-6 text-4xl font-bold md:text-5xl">Get in Touch</h2>
			<p class="text-muted-foreground mx-auto max-w-3xl text-xl">
				Have questions about our API? Need custom solutions? We'd love to hear from you and help
				bring your music project to life.
			</p>
		</div>

		<div class="grid grid-cols-1 gap-12 lg:grid-cols-3">
			<!-- Contact Information -->
			<div class="lg:col-span-1">
				<div class="space-y-8">
					{#each contactInfo as info}
						<div class="flex items-start space-x-4">
							<div class="flex-shrink-0">
								<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
									<info.icon class="h-6 w-6 text-blue-600" />
								</div>
							</div>
							<div>
								<h3 class="text-foreground mb-1 text-lg font-semibold">{info.title}</h3>
								<p class="mb-1 font-medium text-blue-600">{info.content}</p>
								<p class="text-muted-foreground text-sm">{info.description}</p>
							</div>
						</div>
					{/each}
				</div>

				<!-- Additional Info -->
				<Card class="mt-8 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
					<div class="mb-4 flex items-center space-x-3">
						<MessageSquare class="h-6 w-6 text-blue-600" />
						<h3 class="text-lg font-semibold text-blue-900">Quick Response</h3>
					</div>
					<p class="text-sm text-blue-800">
						We typically respond to all inquiries within 24 hours. For urgent technical issues,
						please include "URGENT" in your subject line.
					</p>
				</Card>
			</div>

			<!-- Contact Form -->
			<div class="lg:col-span-2">
				<Card class="h-full">
					<form onsubmit={handleSubmit} class="space-y-6">
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div>
								<label for="name" class="text-foreground mb-2 block text-sm font-medium">
									Full Name
								</label>
								<input
									id="name"
									type="text"
									bind:value={formData.name}
									required
									class="border-border focus:ring-ring bg-background text-foreground w-full rounded-lg border px-4 py-3 transition-colors duration-200 focus:border-transparent focus:ring-2"
									placeholder="Your full name"
								/>
							</div>

							<div>
								<label for="email" class="text-foreground mb-2 block text-sm font-medium">
									Email Address
								</label>
								<input
									id="email"
									type="email"
									bind:value={formData.email}
									required
									class="border-border focus:ring-ring bg-background text-foreground w-full rounded-lg border px-4 py-3 transition-colors duration-200 focus:border-transparent focus:ring-2"
									placeholder="your@email.com"
								/>
							</div>
						</div>

						<div>
							<label for="subject" class="text-foreground mb-2 block text-sm font-medium">
								Subject
							</label>
							<input
								id="subject"
								type="text"
								bind:value={formData.subject}
								required
								class="border-border focus:ring-ring bg-background text-foreground w-full rounded-lg border px-4 py-3 transition-colors duration-200 focus:border-transparent focus:ring-2"
								placeholder="How can we help you?"
							/>
						</div>

						<div>
							<label for="message" class="text-foreground mb-2 block text-sm font-medium">
								Message
							</label>
							<textarea
								id="message"
								bind:value={formData.message}
								required
								rows="6"
								class="border-border focus:ring-ring bg-background text-foreground w-full resize-none rounded-lg border px-4 py-3 transition-colors duration-200 focus:border-transparent focus:ring-2"
								placeholder="Tell us more about your project or question..."
							></textarea>
						</div>

						{#if submitMessage}
							<div class="rounded-lg border border-green-200 bg-green-50 p-4">
								<p class="text-sm text-green-800">{submitMessage}</p>
							</div>
						{/if}

						<button
							type="submit"
							class="w-full rounded-lg bg-blue-600 px-6 py-3 text-lg font-medium text-white transition-all duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							disabled={isSubmitting}
						>
							{#if isSubmitting}
								<div
									class="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
								></div>
								Sending...
							{:else}
								<Send class="mr-2 h-5 w-5" />
								Send Message
							{/if}
						</button>
					</form>
				</Card>
			</div>
		</div>
	</Container>
</section>
