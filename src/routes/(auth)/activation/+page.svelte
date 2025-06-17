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

<section class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-background dark:via-muted/30 dark:to-card/30 flex items-center py-12 relative overflow-hidden">
	<!-- Background Elements -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		<div class="absolute top-20 left-10 animate-bounce delay-100">
			<Music class="w-8 h-8 text-blue-400/30 dark:text-blue-300/20" />
		</div>
		<div class="absolute top-40 right-20 animate-bounce delay-300">
			<Sparkles class="w-6 h-6 text-purple-400/30 dark:text-purple-300/20" />
		</div>
		<div class="absolute bottom-40 left-20 animate-bounce delay-500">
			<Music class="w-10 h-10 text-cyan-400/30 dark:text-cyan-300/20" />
		</div>
	</div>

	<Container size="lg" class="relative z-10">
		<div class="max-w-md mx-auto">
			<!-- Back Button -->
			<div class="mb-6">
				<BackButton 
					href="/" 
					variant="ghost"
					class="group hover:bg-white/20 dark:hover:bg-white/10 backdrop-blur-sm border border-white/20 dark:border-white/10"
					text="Back to Home"
				/>
			</div>

			<!-- Header -->
			<div class="text-center mb-8">
				<div class="mb-6">
					<div class="relative">
						<div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-20 animate-pulse"></div>
						<img 
							src="https://i.ibb.co/zhMky0qT/musical-zoe-high-resolution-logo-transparent.png" 
							alt="Musical Zoe Logo" 
							class="h-16 w-auto mx-auto relative z-10 drop-shadow-lg"
						/>
					</div>
				</div>
				<h1 class="text-3xl font-bold text-foreground mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
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
			<Card class="p-8 shadow-xl border-0 bg-card/80 backdrop-blur-sm">
				{#if status === 'success'}
					<!-- Success State -->
					<div class="text-center space-y-6">
						<div class="flex justify-center">
							<div class="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
								<CheckCircle class="w-10 h-10 text-green-600 dark:text-green-400" />
							</div>
						</div>
						
						<div class="space-y-4">
							<h2 class="text-xl font-semibold text-foreground">
								Account Successfully Activated!
							</h2>
							<p class="text-muted-foreground">
								{data.message || data.error}
							</p>
							
							{#if data.user}
								<div class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
									<div class="text-green-800 dark:text-green-200 text-sm space-y-1">
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
								class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white group"
								size="lg"
							>
								Sign In to Your Account
								<ArrowRight class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
							</Button>
							
							<Button 
								href="/" 
								variant="outline"
								class="w-full"
								size="lg"
							>
								Return to Home
							</Button>
						</div>
					</div>
				{:else}
					<!-- Error State -->
					<div class="text-center space-y-6">
						<div class="flex justify-center">
							<div class="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
								<XCircle class="w-10 h-10 text-red-600 dark:text-red-400" />
							</div>
						</div>
						
						<div class="space-y-4">
							<h2 class="text-xl font-semibold text-foreground">
								Activation Failed
							</h2>
							<div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
								<div class="flex items-start space-x-3">
									<AlertCircle class="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
									<p class="text-red-800 dark:text-red-200 text-sm">
										{data.error || data.message}
									</p>
								</div>
							</div>
							
							<div class="text-left text-sm text-muted-foreground space-y-2 p-4 bg-muted/30 rounded-lg">
								<p><strong>Common issues:</strong></p>
								<ul class="list-disc list-inside space-y-1">
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
									class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
									size="lg"
								>
									Try Again
								</Button>
							{/if}
							
							<Button 
								href="/auth/signup" 
								variant="outline"
								class="w-full"
								size="lg"
							>
								Request New Activation Link
							</Button>
							
							<Button 
								href="/contact" 
								variant="ghost"
								class="w-full"
								size="lg"
							>
								Contact Support
							</Button>
						</div>
					</div>
				{/if}
			</Card>

			<!-- Additional Info -->
			<div class="mt-6 text-center">
				<p class="text-xs text-muted-foreground">
					Having trouble? Check our 
					<a href="/help/activation" class="text-primary hover:text-primary/80 transition-colors">activation help guide</a>
					or
					<a href="/contact" class="text-primary hover:text-primary/80 transition-colors">contact support</a>
				</p>
			</div>
		</div>
	</Container>
</section>
