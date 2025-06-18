<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { signupSchema } from '$lib/schemas/auth';
	import {
		Eye,
		EyeOff,
		User,
		Mail,
		Lock,
		CheckCircle,
		AlertCircle,
		Music,
		Sparkles
	} from 'lucide-svelte';
	import Button from '$lib/web-components/ui/Button.svelte';
	import BackButton from '$lib/web-components/ui/BackButton.svelte';
	import Container from '$lib/web-components/ui/Container.svelte';
	import Card from '$lib/web-components/ui/Card.svelte';

	interface Props {
		data: {
			form: any;
			redirectTo?: string;
		};
	}

	let { data }: Props = $props();

	const { form, errors, enhance, submitting, message } = superForm(data.form, {
		validators: zodClient(signupSchema),
		resetForm: false,
		invalidateAll: false,
		onUpdated: ({ form: updatedForm }) => {
			if (updatedForm.message?.success) {
				// Clear form data after successful signup for security/privacy
				$form.name = '';
				$form.email = '';
				$form.password = '';
				showPassword = false;
				passwordStrength = 0;
				signupSuccessful = true;
			} else if (updatedForm.message && !updatedForm.message.success) {
				// Reset success state if there's an error (e.g., user tries again)
				signupSuccessful = false;
			}
		}
	});

	let showPassword = $state(false);
	let passwordStrength = $state(0);
	let signupSuccessful = $state(false);

	// Password strength calculation
	function calculatePasswordStrength(password: string): number {
		let strength = 0;
		if (password.length >= 8) strength += 25;
		if (/[a-z]/.test(password)) strength += 25;
		if (/[A-Z]/.test(password)) strength += 25;
		if (/\d/.test(password)) strength += 15;
		if (/[@$!%*?&]/.test(password)) strength += 10;
		return Math.min(strength, 100);
	}

	// Reactive password strength
	$effect(() => {
		passwordStrength = calculatePasswordStrength($form.password || '');
	});

	function getStrengthColor(strength: number): string {
		if (strength < 30) return 'bg-red-500';
		if (strength < 60) return 'bg-yellow-500';
		if (strength < 80) return 'bg-blue-500';
		return 'bg-green-500';
	}

	function getStrengthText(strength: number): string {
		if (strength < 30) return 'Weak';
		if (strength < 60) return 'Fair';
		if (strength < 80) return 'Good';
		return 'Strong';
	}
</script>

<svelte:head>
	<title>Sign Up - Musical Zoe</title>
	<meta name="description" content="Create your Musical Zoe account and start discovering music" />
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
					Create Your Account
				</h1>
				<p class="text-muted-foreground">Join Musical Zoe and start your music discovery journey</p>
			</div>

			<!-- Signup Form -->
			<Card class="bg-card/80 border-0 p-8 shadow-xl backdrop-blur-sm">
				<!-- Success Message -->
				{#if $message?.success}
					<div
						class="animate-in slide-in-from-top mb-6 rounded-lg border border-green-200 bg-green-50 p-6 duration-300 dark:border-green-800 dark:bg-green-900/20"
					>
						<div class="flex items-start space-x-3">
							<CheckCircle
								class="mt-0.5 h-6 w-6 flex-shrink-0 text-green-600 dark:text-green-400"
							/>
							<div class="flex-1">
								<p class="mb-2 text-sm font-medium text-green-800 dark:text-green-200">
									{$message.message}
								</p>
								<div class="space-y-1 text-sm text-green-700 dark:text-green-300">
									<p>• Check your spam/junk folder if you don't see the email</p>
									<p>• The verification link will expire in 24 hours</p>
									<p>
										• Once verified, you can <a
											href="/auth/login"
											class="font-medium underline transition-colors hover:text-green-600 dark:hover:text-green-200"
											>sign in here</a
										>
									</p>
								</div>
							</div>
						</div>
					</div>
				{/if}

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

				{#if !signupSuccessful}
					<form method="POST" use:enhance class="space-y-6">
						<!-- Name Field -->
						<div class="group">
							<label
								for="name"
								class="text-foreground group-focus-within:text-primary mb-2 block text-sm font-medium transition-colors duration-200"
							>
								Full Name
							</label>
							<div class="relative">
								<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<User
										class="text-muted-foreground group-focus-within:text-primary h-5 w-5 transition-colors duration-200"
									/>
								</div>
								<input
									id="name"
									name="name"
									type="text"
									bind:value={$form.name}
									class="border-border focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground hover:border-ring/50 focus:shadow-ring/10 w-full rounded-lg border py-3 pr-4 pl-10 transition-all duration-200 focus:border-transparent focus:shadow-lg focus:ring-2"
									placeholder="Enter your full name"
									required
								/>
							</div>
							{#if $errors.name}
								<p class="mt-1 text-sm text-red-600 dark:text-red-400">{$errors.name[0]}</p>
							{/if}
						</div>

						<!-- Email Field -->
						<div>
							<label for="email" class="text-foreground mb-2 block text-sm font-medium">
								Email Address
							</label>
							<div class="relative">
								<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<Mail class="text-muted-foreground h-5 w-5" />
								</div>
								<input
									id="email"
									name="email"
									type="email"
									bind:value={$form.email}
									class="border-border focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground w-full rounded-lg border py-3 pr-4 pl-10 transition-colors duration-200 focus:border-transparent focus:ring-2"
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
									placeholder="Create a strong password"
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

							<!-- Password Strength Indicator -->
							{#if $form.password}
								<div class="mt-2">
									<div class="mb-1 flex items-center justify-between">
										<span class="text-muted-foreground text-xs">Password strength:</span>
										<span
											class="text-xs font-medium {getStrengthColor(passwordStrength).replace(
												'bg-',
												'text-'
											)}">{getStrengthText(passwordStrength)}</span
										>
									</div>
									<div class="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
										<div
											class="h-2 rounded-full transition-all duration-300 {getStrengthColor(
												passwordStrength
											)}"
											style="width: {passwordStrength}%"
										></div>
									</div>
								</div>
							{/if}

							{#if $errors.password}
								<p class="mt-1 text-sm text-red-600 dark:text-red-400">{$errors.password[0]}</p>
							{/if}
						</div>

						<!-- Submit Button -->
						<button
							type="submit"
							class="focus:ring-primary w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-lg font-medium text-white transition-all duration-200 hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
							disabled={$submitting}
						>
							{#if $submitting}
								<div
									class="mr-2 inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
								></div>
								Creating Account...
							{:else}
								Create Account
							{/if}
						</button>
					</form>

					<!-- Login Link -->
					<div class="mt-6 text-center">
						<p class="text-muted-foreground text-sm">
							Already have an account?
							<a
								href="/login"
								class="text-primary hover:text-primary/80 font-medium transition-colors"
							>
								Sign in here
							</a>
						</p>
					</div>
				{:else}
					<!-- Post-signup actions -->
					<div class="space-y-6 text-center">
						<div class="space-y-3">
							<div
								class="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20"
							>
								<p class="text-sm text-blue-800 dark:text-blue-200">
									<strong>Next step:</strong> Check your email and click the verification link to activate
									your account.
								</p>
							</div>
							<Button
								href="/login"
								class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
								size="lg"
							>
								Continue to Sign In
							</Button>
							<Button
								variant="outline"
								onclick={() => (signupSuccessful = false)}
								class="w-full"
								size="lg"
							>
								Sign Up Another Account
							</Button>
						</div>
					</div>
				{/if}
			</Card>

			<!-- Terms -->
			<div class="mt-6 text-center">
				<p class="text-muted-foreground text-xs">
					By creating an account, you agree to our
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
