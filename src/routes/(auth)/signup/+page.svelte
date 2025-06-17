<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { signupSchema } from '$lib/schemas/auth';
	import { Eye, EyeOff, User, Mail, Lock, CheckCircle, AlertCircle, Music, Sparkles } from 'lucide-svelte';
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
					Create Your Account
				</h1>
				<p class="text-muted-foreground">Join Musical Zoe and start your music discovery journey</p>
			</div>

			<!-- Signup Form -->
			<Card class="p-8 shadow-xl border-0 bg-card/80 backdrop-blur-sm">
				<!-- Success Message -->
				{#if $message?.success}
					<div class="mb-6 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg animate-in slide-in-from-top duration-300">
						<div class="flex items-start space-x-3">
							<CheckCircle class="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
							<div class="flex-1">
								<p class="text-green-800 dark:text-green-200 text-sm font-medium mb-2">
									{$message.message}
								</p>
								<div class="text-green-700 dark:text-green-300 text-sm space-y-1">
									<p>• Check your spam/junk folder if you don't see the email</p>
									<p>• The verification link will expire in 24 hours</p>
									<p>• Once verified, you can <a href="/auth/login" class="underline font-medium hover:text-green-600 dark:hover:text-green-200 transition-colors">sign in here</a></p>
								</div>
							</div>
						</div>
					</div>
				{/if}

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

				{#if !signupSuccessful}
					<form method="POST" use:enhance class="space-y-6">
						<!-- Name Field -->
						<div class="group">
							<label for="name" class="block text-sm font-medium text-foreground mb-2 group-focus-within:text-primary transition-colors duration-200">
								Full Name
							</label>
							<div class="relative">
								<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<User class="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
								</div>
								<input
									id="name"
									name="name"
									type="text"
									bind:value={$form.name}
									class="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 bg-background text-foreground placeholder:text-muted-foreground hover:border-ring/50 focus:shadow-lg focus:shadow-ring/10"
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
							<label for="email" class="block text-sm font-medium text-foreground mb-2">
								Email Address
							</label>
							<div class="relative">
								<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Mail class="h-5 w-5 text-muted-foreground" />
								</div>
								<input
									id="email"
									name="email"
									type="email"
									bind:value={$form.email}
									class="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-colors duration-200 bg-background text-foreground placeholder:text-muted-foreground"
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
									placeholder="Create a strong password"
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
							
							<!-- Password Strength Indicator -->
							{#if $form.password}
								<div class="mt-2">
									<div class="flex items-center justify-between mb-1">
										<span class="text-xs text-muted-foreground">Password strength:</span>
										<span class="text-xs font-medium {getStrengthColor(passwordStrength).replace('bg-', 'text-')}">{getStrengthText(passwordStrength)}</span>
									</div>
									<div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
										<div 
											class="h-2 rounded-full transition-all duration-300 {getStrengthColor(passwordStrength)}"
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
							class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 text-lg rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={$submitting}
						>
							{#if $submitting}
								<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block"></div>
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
							<a href="/login" class="text-primary hover:text-primary/80 font-medium transition-colors">
								Sign in here
							</a>
						</p>
					</div>
				{:else}
					<!-- Post-signup actions -->
					<div class="space-y-6 text-center">
						<div class="space-y-3">
							<div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
								<p class="text-blue-800 dark:text-blue-200 text-sm">
									<strong>Next step:</strong> Check your email and click the verification link to activate your account.
								</p>
							</div>
							<Button 
								href="/login" 
								class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
								size="lg"
							>
								Continue to Sign In
							</Button>
							<Button 
								variant="outline" 
								onclick={() => signupSuccessful = false}
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
				<p class="text-xs text-muted-foreground">
					By creating an account, you agree to our
					<a href="/terms" class="text-primary hover:text-primary/80 transition-colors">Terms of Service</a>
					and
					<a href="/privacy" class="text-primary hover:text-primary/80 transition-colors">Privacy Policy</a>
				</p>
			</div>
		</div>
	</Container>
</section>
