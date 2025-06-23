<script lang="ts">
	import { CheckCircle, AlertCircle, XCircle, Activity, Server, Clock, RefreshCw } from 'lucide-svelte';
	import Button from '$lib/web-components/ui/Button.svelte';
	import BackButton from '$lib/web-components/ui/BackButton.svelte';
	import Card from '$lib/web-components/ui/Card.svelte';

	interface Props {
		data: {
			success: boolean;
			healthData?: {
				frontend: {
					status: string;
					timestamp: string;
					service: string;
					version: string;
					environment: string;
					responseTime: number;
				};
				musicApi: {
					status: string;
					message: string;
					responseTime?: number | null;
				};
				overall: {
					status: string;
					timestamp: string;
				};
			};
			error?: string | null;
		};
	}

	let { data }: Props = $props();

	// Determine overall status
	let overallStatus = $derived(
		data.success && data.healthData?.overall.status === 'healthy' ? 'healthy' : 
		data.success && data.healthData?.overall.status === 'degraded' ? 'degraded' : 'unhealthy'
	) as 'healthy' | 'degraded' | 'unhealthy';

	// Status colors
	let statusColors: Record<'healthy' | 'degraded' | 'unhealthy', string> = {
		healthy: 'text-emerald-600',
		degraded: 'text-amber-600',
		unhealthy: 'text-red-600'
	};

	// Format response time
	function formatResponseTime(time: number | null): string {
		if (time === null) return 'N/A';
		return `${time}ms`;
	}

	// Refresh health status
	function refreshHealth() {
		window.location.reload();
	}
</script>

<svelte:head>
	<title>System Health Status - Musical Zoe</title>
	<meta name="description" content="Real-time system health monitoring for Musical Zoe platform" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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

	<!-- Content Container -->
	<div class="relative z-10 px-4 py-8">
		<div class="max-w-4xl mx-auto">
			<!-- Header -->
			<div class="mb-8">
				<BackButton href="/" class="mb-4 text-white hover:text-purple-300" />
				<div class="flex items-center gap-3 mb-2">
					<Activity class="w-8 h-8 text-purple-400" />
					<h1 class="text-3xl font-bold text-white">System Health Status</h1>
				</div>
				<p class="text-slate-300">Real-time monitoring of Musical Zoe platform services</p>
			</div>

			{#if data.success && data.healthData}
				<!-- Overall Status Card -->
				<Card class="mb-6 bg-slate-800/50 border-slate-700 backdrop-blur-sm {overallStatus === 'healthy' ? 'ring-2 ring-emerald-500/50' : 
					overallStatus === 'degraded' ? 'ring-2 ring-amber-500/50' : 'ring-2 ring-red-500/50'}">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-3">
							{#if overallStatus === 'healthy'}
								<CheckCircle class="w-8 h-8 text-emerald-400" />
							{:else if overallStatus === 'degraded'}
								<AlertCircle class="w-8 h-8 text-amber-400" />
							{:else}
								<XCircle class="w-8 h-8 text-red-400" />
							{/if}
							<div>
								<h2 class="text-xl font-semibold text-white">
									System Status: <span class="{overallStatus === 'healthy' ? 'text-emerald-400' : 
										overallStatus === 'degraded' ? 'text-amber-400' : 'text-red-400'}">{data.healthData.overall.status.toUpperCase()}</span>
								</h2>
								<p class="text-sm text-slate-400">
									Last updated: {new Date(data.healthData.overall.timestamp).toLocaleString()}
								</p>
							</div>
						</div>
						<Button variant="outline" onclick={refreshHealth} class="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
							<RefreshCw class="w-4 h-4 mr-2" />
							Refresh
						</Button>
					</div>
				</Card>

				<!-- Service Details -->
				<div class="grid md:grid-cols-2 gap-6">
					<!-- Frontend Health -->
					<Card class="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
						<div class="flex items-center gap-3 mb-4">
							<Server class="w-6 h-6 text-blue-400" />
							<h3 class="text-lg font-semibold text-white">Frontend Service</h3>
						</div>
						
						<div class="space-y-3">
							<div class="flex justify-between">
								<span class="text-slate-400">Status:</span>
								<span class="font-medium capitalize 
									{data.healthData.frontend.status === 'healthy' ? 'text-emerald-400' : 'text-red-400'}">
									{data.healthData.frontend.status}
								</span>
							</div>
							<div class="flex justify-between">
								<span class="text-slate-400">Service:</span>
								<span class="font-medium text-white">{data.healthData.frontend.service}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-slate-400">Version:</span>
								<span class="font-medium text-white">{data.healthData.frontend.version}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-slate-400">Environment:</span>
								<span class="font-medium text-white capitalize">{data.healthData.frontend.environment}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-slate-400">Response Time:</span>
								<span class="font-medium text-white flex items-center gap-1">
									<Clock class="w-4 h-4 text-slate-400" />
									{formatResponseTime(data.healthData.frontend.responseTime)}
								</span>
							</div>
						</div>
					</Card>

					<!-- Music API Health -->
					<Card class="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
						<div class="flex items-center gap-3 mb-4">
							<Activity class="w-6 h-6 text-purple-400" />
							<h3 class="text-lg font-semibold text-white">Music API Service</h3>
						</div>
						
						<div class="space-y-3">
							<div class="flex justify-between">
								<span class="text-slate-400">Status:</span>
								<span class="font-medium capitalize 
									{data.healthData.musicApi.status === 'healthy' ? 'text-emerald-400' : 
									 data.healthData.musicApi.status === 'degraded' ? 'text-amber-400' : 'text-red-400'}">
									{data.healthData.musicApi.status}
								</span>
							</div>
							<div class="flex justify-between">
								<span class="text-slate-400">Message:</span>
								<span class="font-medium text-white text-right max-w-48 truncate" title={data.healthData.musicApi.message}>
									{data.healthData.musicApi.message}
								</span>
							</div>
							{#if data.healthData.musicApi.responseTime}
								<div class="flex justify-between">
									<span class="text-slate-400">Response Time:</span>
									<span class="font-medium text-white flex items-center gap-1">
										<Clock class="w-4 h-4 text-slate-400" />
										{formatResponseTime(data.healthData.musicApi.responseTime)}
									</span>
								</div>
							{/if}
						</div>
					</Card>
				</div>

			{:else}
				<!-- Error State -->
				<Card class="bg-red-900/50 border-red-700 backdrop-blur-sm">
					<div class="flex items-center gap-3 mb-4">
						<XCircle class="w-8 h-8 text-red-400" />
						<h2 class="text-xl font-semibold text-red-400">Health Check Failed</h2>
					</div>
					
					<p class="text-red-300 mb-4">
						{data.error || 'Unable to retrieve system health status'}
					</p>
					
					<Button onclick={refreshHealth} variant="secondary" class="bg-slate-700 text-white hover:bg-slate-600">
						Try Again
					</Button>
				</Card>
			{/if}
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
				<Activity class="h-6 w-6 text-purple-400" />
			</div>
		{/each}
	</div>
</div>
