<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { loginSchema } from '$lib/schemas/auth';
	import { Eye, EyeOff, Mail, Lock, CheckCircle, AlertCircle, Music, Sparkles, ArrowRight } from 'lucide-svelte';
	import Button from '$lib/web-components/ui/Button.svelte';
	import BackButton from '$lib/web-components/ui/BackButton.svelte';
	import Container from '$lib/web-components/ui/Container.svelte';
	import Card from '$lib/web-components/ui/Card.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	interface Props {
		data: {
			form: any;
			redirectTo?: string;
		};
	}

	let { data }: Props = $props();

	let redirectionPage = $page.url.searchParams.get('redirectTo') ?? '/dashboard';
	let showPassword = $state(false);

	const { form, errors, enhance, submitting, message } = superForm(data.form, {
		validators: zodClient(loginSchema),
		dataType: 'json',
		onUpdated({ form }) {
			if ($message?.success) {
				// Clear form data after successful login for security
				form.data.email = '';
				form.data.password = '';
				form.data.rememberMe = false;
				showPassword = false;
				
				// Redirect to dashboard automatically
				const name = $message.data?.name || $message.data?.email || 'User';
				goto(redirectionPage);
			} else if ($message && !$message.success) {
				// Handle specific error cases
				if ($message.message === 'activation_required') {
					const activationMessage = 'Oops! Looks like your account needs a little magic to get started. Activate it now to unlock all the awesomeness!';
					goto(`/auth/activation?message=${encodeURIComponent(activationMessage)}`);
				} else if ($message.message === 'mfa_required') {
					const email = $message?.email || '';
					const token = $message?.token || '';
					goto(`/auth/login/verify?token=${token}&email=${email}&redirectTo=${redirectionPage}`);
				}
				// For other errors, stay on the login page and show the error message
			}
		}
	});
</script>

<svelte:head>
	<title>Sign In - Musical Zoe</title>
	<meta name="description" content="Sign in to your Musical Zoe account" />
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
					Welcome Back
				</h1>
				<p class="text-muted-foreground">Sign in to continue your musical journey</p>
			</div>

			<!-- Login Form -->
			<Card class="p-8 shadow-xl border-0 bg-card/80 backdrop-blur-sm">
				<!-- Error Message -->
				{#if $message && !$message.success}
					<div class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-in slide-in-from-top duration-300">
						<div class="flex items-center space-x-2">
							<AlertCircle class="h-5 w-5 text-red-600 dark:text-red-400" />
							<p class="text-red-800 dark:text-red-200 text-sm font-medium">
								{$message.message}
							</p>
						</div>
					</div>
				{/if}

				<form method="POST" use:enhance class="space-y-6">
						<!-- Email Field -->
						<div class="group">
							<label for="email" class="block text-sm font-medium text-foreground mb-2 group-focus-within:text-primary transition-colors duration-200">
								Email Address
							</label>
							<div class="relative">
								<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Mail class="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
								</div>
								<input
									id="email"
									name="email"
									type="email"
									bind:value={$form.email}
									class="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 bg-background text-foreground placeholder:text-muted-foreground hover:border-ring/50 focus:shadow-lg focus:shadow-ring/10"
									placeholder="Enter your email address"
									required
								/>
							</div>
							{#if $errors.email}
								<p class="mt-1 text-sm text-red-600 dark:text-red-400">{$errors.email[0]}</p>
							{/if}
						</div>

						<!-- Password Field -->
						<div>
							<label for="password" class="block text-sm font-medium text-foreground mb-2">
								Password
							</label>
							<div class="relative">
								<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Lock class="h-5 w-5 text-muted-foreground" />
								</div>
								<input
									id="password"
									name="password"
									type={showPassword ? 'text' : 'password'}
									bind:value={$form.password}
									class="w-full pl-10 pr-12 py-3 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-colors duration-200 bg-background text-foreground placeholder:text-muted-foreground"
									placeholder="Enter your password"
									required
								/>
								<button
									type="button"
									onclick={() => showPassword = !showPassword}
									class="absolute inset-y-0 right-0 pr-3 flex items-center"
								>
									{#if showPassword}
										<EyeOff class="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
									{:else}
										<Eye class="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
									{/if}
								</button>
							</div>
							{#if $errors.password}
								<p class="mt-1 text-sm text-red-600 dark:text-red-400">{$errors.password[0]}</p>
							{/if}
						</div>

						<!-- Remember Me & Forgot Password -->
						<div class="flex items-center justify-between">
							<div class="flex items-center">
								<input
									id="rememberMe"
									name="rememberMe"
									type="checkbox"
									bind:checked={$form.rememberMe}
									class="h-4 w-4 text-primary focus:ring-primary border-border rounded transition-colors"
								/>
								<label for="rememberMe" class="ml-2 block text-sm text-foreground">
									Remember me
								</label>
							</div>
							<div class="text-sm">
								<a href="/auth/forgot-password" class="text-primary hover:text-primary/80 font-medium transition-colors">
									Forgot password?
								</a>
							</div>
						</div>

						<!-- Submit Button -->
						<button
							type="submit"
							class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 text-lg rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed group"
							disabled={$submitting}
						>
							{#if $submitting}
								<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block"></div>
								Signing In...
							{:else}
								Sign In
								<ArrowRight class="w-4 h-4 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
							{/if}
						</button>
					</form>

					<!-- Signup Link -->
					<div class="mt-6 text-center">
						<p class="text-muted-foreground text-sm">
							Don't have an account?
							<a href="/auth/signup" class="text-primary hover:text-primary/80 font-medium transition-colors">
								Sign up here
							</a>
						</p>
					</div>
			</Card>

			<!-- Terms -->
			<div class="mt-6 text-center">
				<p class="text-xs text-muted-foreground">
					By signing in, you agree to our
					<a href="/terms" class="text-primary hover:text-primary/80 transition-colors">Terms of Service</a>
					and
					<a href="/privacy" class="text-primary hover:text-primary/80 transition-colors">Privacy Policy</a>
				</p>
			</div>
		</div>
	</Container>
</section>  