<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { loginSchema } from '$lib/schemas/auth';
	import {
		Eye,
		EyeOff,
		Mail,
		Lock,
		CheckCircle,
		AlertCircle,
		Music,
		Sparkles,
		ArrowRight
	} from 'lucide-svelte';
	import Button from '$lib/web-components/ui/Button.svelte';
	import BackButton from '$lib/web-components/ui/BackButton.svelte';
	import Container from '$lib/web-components/ui/Container.svelte';
	import Card from '$lib/web-components/ui/Card.svelte';
	import { goto, invalidateAll } from '$app/navigation';
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
		async onUpdated({ form }) {
			if ($message?.success) {
				// Clear form data after successful login for security
				form.data.email = '';
				form.data.password = '';
				form.data.rememberMe = false;
				showPassword = false;

				// Invalidate all data to refresh authentication state
				await invalidateAll();

				// Redirect to dashboard automatically
				const name = $message.data?.name || $message.data?.email || 'User';
				goto(redirectionPage);
			} else if ($message && !$message.success) {
				// Handle specific error cases
				if ($message.message === 'activation_required') {
					const activationMessage =
						'Oops! Looks like your account needs a little magic to get started. Activate it now to unlock all the awesomeness!';
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
					Welcome Back
				</h1>
				<p class="text-muted-foreground">Sign in to continue your musical journey</p>
			</div>

			<!-- Login Form -->
			<Card class="bg-card/80 border-0 p-8 shadow-xl backdrop-blur-sm">
				<!-- Error Message -->
				{#if $message && !$message.success}
					<div
						class="animate-in slide-in-from-top mb-6 rounded-lg border border-red-200 bg-red-50 p-4 duration-300 dark:border-red-800 dark:bg-red-900/20"
					>
						<div class="flex items-center space-x-2">
							<AlertCircle class="h-5 w-5 text-red-600 dark:text-red-400" />
							<p class="text-sm font-medium text-red-800 dark:text-red-200">
								{$message.message}
							</p>
						</div>
					</div>
				{/if}

				<form method="POST" use:enhance class="space-y-6">
					<!-- Email Field -->
					<div class="group">
						<label
							for="email"
							class="text-foreground group-focus-within:text-primary mb-2 block text-sm font-medium transition-colors duration-200"
						>
							Email Address
						</label>
						<div class="relative">
							<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
								<Mail
									class="text-muted-foreground group-focus-within:text-primary h-5 w-5 transition-colors duration-200"
								/>
							</div>
							<input
								id="email"
								name="email"
								type="email"
								bind:value={$form.email}
								class="border-border focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground hover:border-ring/50 focus:shadow-ring/10 w-full rounded-lg border py-3 pr-4 pl-10 transition-all duration-200 focus:border-transparent focus:shadow-lg focus:ring-2"
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
						<label for="password" class="text-foreground mb-2 block text-sm font-medium">
							Password
						</label>
						<div class="relative">
							<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
								<Lock class="text-muted-foreground h-5 w-5" />
							</div>
							<input
								id="password"
								name="password"
								type={showPassword ? 'text' : 'password'}
								bind:value={$form.password}
								class="border-border focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground w-full rounded-lg border py-3 pr-12 pl-10 transition-colors duration-200 focus:border-transparent focus:ring-2"
								placeholder="Enter your password"
								required
							/>
							<button
								type="button"
								onclick={() => (showPassword = !showPassword)}
								class="absolute inset-y-0 right-0 flex items-center pr-3"
							>
								{#if showPassword}
									<EyeOff
										class="text-muted-foreground hover:text-foreground h-5 w-5 transition-colors"
									/>
								{:else}
									<Eye
										class="text-muted-foreground hover:text-foreground h-5 w-5 transition-colors"
									/>
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
								class="text-primary focus:ring-primary border-border h-4 w-4 rounded transition-colors"
							/>
							<label for="rememberMe" class="text-foreground ml-2 block text-sm">
								Remember me
							</label>
						</div>
						<div class="text-sm">
							<a
								href="/auth/forgot-password"
								class="text-primary hover:text-primary/80 font-medium transition-colors"
							>
								Forgot password?
							</a>
						</div>
					</div>

					<!-- Submit Button -->
					<button
						type="submit"
						class="focus:ring-primary group w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-lg font-medium text-white transition-all duration-200 hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						disabled={$submitting}
					>
						{#if $submitting}
							<div
								class="mr-2 inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
							></div>
							Signing In...
						{:else}
							Sign In
							<ArrowRight
								class="ml-2 inline-block h-4 w-4 transition-transform group-hover:translate-x-1"
							/>
						{/if}
					</button>
				</form>

				<!-- Signup Link -->
				<div class="mt-6 text-center">
					<p class="text-muted-foreground text-sm">
						Don't have an account?
						<a
							href="/auth/signup"
							class="text-primary hover:text-primary/80 font-medium transition-colors"
						>
							Sign up here
						</a>
					</p>
				</div>
			</Card>

			<!-- Terms -->
			<div class="mt-6 text-center">
				<p class="text-muted-foreground text-xs">
					By signing in, you agree to our
					<a href="/terms" class="text-primary hover:text-primary/80 transition-colors"
						>Terms of Service</a
					>
					and
					<a href="/privacy" class="text-primary hover:text-primary/80 transition-colors"
						>Privacy Policy</a
					>
				</p>
			</div>
		</div>
	</Container>
</section>
