<!-- Musical Zoe Error Page -->
<script lang="ts">
	import { page } from '$app/stores';
	import { Music, Home, ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-svelte';

	$: status = $page.status;
	$: message = $page.error?.message;

	function getErrorTitle(status: number): string {
		switch (status) {
			case 404:
				return 'Track Not Found';
			case 500:
				return 'Server Remix Error';
			case 403:
				return 'Access Denied';
			case 401:
				return 'Authentication Required';
			default:
				return 'Something Went Wrong';
		}
	}

	function getErrorDescription(status: number): string {
		switch (status) {
			case 404:
				return "This page seems to have gone off-key. The content you're looking for might have been moved, deleted, or never existed.";
			case 500:
				return "Our servers are experiencing some technical difficulties. We're working to get the music back on track.";
			case 403:
				return "You don't have permission to access this resource. Please check your credentials or contact support.";
			case 401:
				return 'You need to sign in to access this content. Please log in to continue your musical journey.';
			default:
				return "We've hit a wrong note somewhere. Our team has been notified and is working to fix the issue.";
		}
	}

	function goBack() {
		window.history.back();
	}

	function goHome() {
		window.location.href = '/';
	}

	function reload() {
		window.location.reload();
	}
</script>

<svelte:head>
	<title>Error {status} - Musical Zoe</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4"
>
	<!-- Background Pattern -->
	<div class="absolute inset-0 overflow-hidden">
		<div class="absolute inset-0 opacity-20">
			<div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
			<div
				class="absolute inset-0"
				style="background-image: radial-gradient(circle at 25% 25%, rgba(147, 51, 234, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(236, 72, 153, 0.1) 0%, transparent 50%);"
			></div>
		</div>
	</div>

	<!-- Error Content -->
	<div class="relative z-10 mx-auto max-w-2xl text-center">
		<!-- Musical Icon -->
		<div class="relative mb-8">
			<div
				class="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-2xl sm:h-32 sm:w-32"
			>
				<Music class="h-12 w-12 text-white sm:h-16 sm:w-16" />
			</div>
			<div class="absolute -top-2 -right-2">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 shadow-lg sm:h-10 sm:w-10"
				>
					<AlertTriangle class="h-4 w-4 text-white sm:h-5 sm:w-5" />
				</div>
			</div>
		</div>

		<!-- Error Status -->
		<div class="mb-6">
			<h1 class="mb-2 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
				{status}
			</h1>
			<h2 class="mb-4 text-xl font-semibold text-purple-300 sm:text-2xl md:text-3xl">
				{getErrorTitle(status)}
			</h2>
		</div>

		<!-- Error Description -->
		<div class="mb-8 px-4">
			<p class="mx-auto max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
				{getErrorDescription(status)}
			</p>
			{#if message}
				<div class="mt-4 rounded-lg border border-slate-700 bg-slate-800/50 p-4">
					<p class="font-mono text-sm break-words text-slate-400">
						{message}
					</p>
				</div>
			{/if}
		</div>

		<!-- Action Buttons -->
		<div class="flex flex-col items-center justify-center gap-4 px-4 sm:flex-row">
			<button
				onclick={goBack}
				class="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-800 px-6 py-3 font-medium text-white transition-all duration-200 hover:scale-105 hover:border-slate-500 hover:bg-slate-700 sm:w-auto"
			>
				<ArrowLeft class="h-4 w-4" />
				Go Back
			</button>

			<button
				onclick={goHome}
				class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-purple-700 hover:to-pink-700 sm:w-auto"
			>
				<Home class="h-4 w-4" />
				Go Home
			</button>

			<button
				onclick={reload}
				class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-blue-700 sm:w-auto"
			>
				<RefreshCw class="h-4 w-4" />
				Reload
			</button>
		</div>

		<!-- Support Information -->
		<div class="mt-12 border-t border-slate-700/50 pt-8">
			<p class="mb-2 text-sm text-slate-400">Still having trouble? We're here to help!</p>
			<p class="text-sm text-slate-500">
				Contact our support team at
				<a
					href="mailto:support@musicalzoe.com"
					class="text-purple-400 underline transition-colors hover:text-purple-300"
				>
					support@musicalzoe.com
				</a>
			</p>
		</div>

		<!-- Musical Zoe Branding -->
		<div class="mt-8 flex items-center justify-center gap-2 text-slate-500">
			<Music class="h-4 w-4" />
			<span class="text-sm font-medium">Musical Zoe</span>
		</div>
	</div>

	<!-- Floating Musical Notes Animation -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		{#each Array(6) as _, i}
			<div
				class="absolute animate-pulse opacity-20"
				style="
					left: {Math.random() * 100}%;
					top: {Math.random() * 100}%;
					animation-delay: {i * 0.5}s;
					animation-duration: {3 + Math.random() * 2}s;
				"
			>
				<Music class="h-6 w-6 text-purple-400" />
			</div>
		{/each}
	</div>
</div>

<style>
	@keyframes float {
		0%,
		100% {
			transform: translateY(0px) rotate(0deg);
		}
		50% {
			transform: translateY(-20px) rotate(180deg);
		}
	}
</style>
