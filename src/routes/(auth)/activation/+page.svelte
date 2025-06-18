<script lang="ts">
	import { CheckCircle, AlertCircle, XCircle, Music, Sparkles, ArrowRight } from 'lucide-svelte';
	import Button from '$lib/web-components/ui/Button.svelte';
	import BackButton from '$lib/web-components/ui/BackButton.svelte';
	import Container from '$lib/web-components/ui/Container.svelte';
	import Card from '$lib/web-components/ui/Card.svelte';

	interface Props {
		data: {
			success: boolean;
			message?: string;
			error?: string;
			user?: {
				id: string;
				email: string;
				name: string;
				created_at: string;
			};
			token?: string | null;
			showRetry?: boolean;
		};
	}

	let { data }: Props = $props();

	// Determine the status for styling and icons
	let status = $derived(data.success ? 'success' : 'error');
</script>

<svelte:head>
	<title>Account Activation - Musical Zoe</title>
	<meta name="description" content="Activate your Musical Zoe account" />
</svelte:head>

<section
	class="dark:from-background dark:via-muted/30 dark:to-card/30 relative flex min-h-screen items-center overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 py-12"
>
	<!-- Background Elements -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		<div class="absolute top-20 left-10 animate-bounce delay-100">
			<Music class="h-8 w-8 text-blue-400/30 dark:text-blue-300/20" />
		</div>
		<div class="absolute top-40 right-20 animate-bounce delay-300">
			<Sparkles class="h-6 w-6 text-purple-400/30 dark:text-purple-300/20" />
		</div>
		<div class="absolute bottom-40 left-20 animate-bounce delay-500">
			<Music class="h-10 w-10 text-cyan-400/30 dark:text-cyan-300/20" />
		</div>
	</div>

	<Container size="lg" class="relative z-10">
		<div class="mx-auto max-w-md">
			<!-- Back Button -->
			<div class="mb-6">
				<BackButton
					href="/"
					variant="ghost"
					class="group border border-white/20 backdrop-blur-sm hover:bg-white/20 dark:border-white/10 dark:hover:bg-white/10"
					text="Back to Home"
				/>
			</div>

			<!-- Header -->
			<div class="mb-8 text-center">
				<div class="mb-6">
					<div class="relative">
						<div
							class="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 blur-lg"
						></div>
						<img
							src="https://i.ibb.co/zhMky0qT/musical-zoe-high-resolution-logo-transparent.png"
							alt="Musical Zoe Logo"
							class="relative z-10 mx-auto h-16 w-auto drop-shadow-lg"
						/>
					</div>
				</div>
				<h1
					class="text-foreground mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-3xl font-bold text-transparent"
				>
					Account Activation
				</h1>
				<p class="text-muted-foreground">
					{#if status === 'success'}
						Welcome to Musical Zoe! Your account is now active.
					{:else}
						We're verifying your account activation link.
					{/if}
				</p>
			</div>

			<!-- Activation Result -->
			<Card class="bg-card/80 border-0 p-8 shadow-xl backdrop-blur-sm">
				{#if status === 'success'}
					<!-- Success State -->
					<div class="space-y-6 text-center">
						<div class="flex justify-center">
							<div
								class="animate-in zoom-in flex h-20 w-20 items-center justify-center rounded-full bg-green-100 duration-500 dark:bg-green-900/30"
							>
								<CheckCircle class="h-10 w-10 text-green-600 dark:text-green-400" />
							</div>
						</div>

						<div class="space-y-4">
							<h2 class="text-foreground text-xl font-semibold">Account Successfully Activated!</h2>
							<p class="text-muted-foreground">
								{data.message || data.error}
							</p>

							{#if data.user}
								<div
									class="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20"
								>
									<div class="space-y-1 text-sm text-green-800 dark:text-green-200">
										<p><strong>Welcome, {data.user.name}!</strong></p>
										<p>Email: {data.user.email}</p>
										<p>Account created: {new Date(data.user.created_at).toLocaleDateString()}</p>
									</div>
								</div>
							{/if}
						</div>

						<div class="space-y-3">
							<Button
								href="/login"
								class="group w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
								size="lg"
							>
								Sign In to Your Account
								<ArrowRight class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
							</Button>

							<Button href="/" variant="outline" class="w-full" size="lg">Return to Home</Button>
						</div>
					</div>
				{:else}
					<!-- Error State -->
					<div class="space-y-6 text-center">
						<div class="flex justify-center">
							<div
								class="animate-in zoom-in flex h-20 w-20 items-center justify-center rounded-full bg-red-100 duration-500 dark:bg-red-900/30"
							>
								<XCircle class="h-10 w-10 text-red-600 dark:text-red-400" />
							</div>
						</div>

						<div class="space-y-4">
							<h2 class="text-foreground text-xl font-semibold">Activation Failed</h2>
							<div
								class="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20"
							>
								<div class="flex items-start space-x-3">
									<AlertCircle
										class="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400"
									/>
									<p class="text-sm text-red-800 dark:text-red-200">
										{data.error || data.message}
									</p>
								</div>
							</div>

							<div
								class="text-muted-foreground bg-muted/30 space-y-2 rounded-lg p-4 text-left text-sm"
							>
								<p><strong>Common issues:</strong></p>
								<ul class="list-inside list-disc space-y-1">
									<li>The activation link has expired (links expire after 24 hours)</li>
									<li>The link has already been used</li>
									<li>The link was copied incorrectly</li>
									<li>Too many activation attempts in a short period</li>
								</ul>
							</div>
						</div>

						<div class="space-y-3">
							{#if data.token && data.showRetry}
								<Button
									onclick={() => window.location.reload()}
									class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
									size="lg"
								>
									Try Again
								</Button>
							{/if}

							<Button href="/auth/signup" variant="outline" class="w-full" size="lg">
								Request New Activation Link
							</Button>

							<Button href="/contact" variant="ghost" class="w-full" size="lg">
								Contact Support
							</Button>
						</div>
					</div>
				{/if}
			</Card>

			<!-- Additional Info -->
			<div class="mt-6 text-center">
				<p class="text-muted-foreground text-xs">
					Having trouble? Check our
					<a href="/help/activation" class="text-primary hover:text-primary/80 transition-colors"
						>activation help guide</a
					>
					or
					<a href="/contact" class="text-primary hover:text-primary/80 transition-colors"
						>contact support</a
					>
				</p>
			</div>
		</div>
	</Container>
</section>
