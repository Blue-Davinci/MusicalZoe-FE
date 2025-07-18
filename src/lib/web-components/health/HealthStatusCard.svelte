<!-- System Health Status Card -->
<script lang="ts">
	import { Activity, CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-svelte';

	export let title: string;
	export let status: 'healthy' | 'unhealthy' | 'degraded' | 'unknown';
	export let message: string = '';
	export let responseTime: number | null = null;
	export let timestamp: string = '';
	export let details: Record<string, any> = {};

	$: statusIcon = {
		healthy: CheckCircle,
		degraded: AlertTriangle,
		unhealthy: XCircle,
		unknown: Activity
	}[status];

	$: statusColor = {
		healthy: 'text-green-500',
		degraded: 'text-yellow-500',
		unhealthy: 'text-red-500',
		unknown: 'text-gray-500'
	}[status];

	$: statusBgColor = {
		healthy: 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800',
		degraded: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800',
		unhealthy: 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800',
		unknown: 'bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800'
	}[status];

	function formatResponseTime(ms: number | null): string {
		if (ms === null) return 'N/A';
		if (ms < 1000) return `${ms}ms`;
		return `${(ms / 1000).toFixed(2)}s`;
	}

	function formatTimestamp(timestamp: string): string {
		try {
			return new Date(timestamp).toLocaleString();
		} catch {
			return timestamp;
		}
	}
</script>

<div class="rounded-lg border p-6 {statusBgColor}">
	<div class="mb-4 flex items-center justify-between">
		<div class="flex items-center gap-3">
			<svelte:component this={statusIcon} class="h-6 w-6 {statusColor}" />
			<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
		</div>
		<span
			class="rounded-full px-3 py-1 text-sm font-medium {statusColor} border bg-white dark:bg-gray-800"
		>
			{status.charAt(0).toUpperCase() + status.slice(1)}
		</span>
	</div>

	{#if message}
		<p class="mb-4 text-gray-700 dark:text-gray-300">{message}</p>
	{/if}

	<div class="grid grid-cols-2 gap-4 text-sm">
		{#if responseTime !== null}
			<div class="flex items-center gap-2">
				<Clock class="h-4 w-4 text-gray-500" />
				<span class="text-gray-600 dark:text-gray-400">Response Time:</span>
				<span class="font-medium text-gray-900 dark:text-gray-100">
					{formatResponseTime(responseTime)}
				</span>
			</div>
		{/if}

		{#if timestamp}
			<div class="flex items-center gap-2">
				<Activity class="h-4 w-4 text-gray-500" />
				<span class="text-gray-600 dark:text-gray-400">Last Check:</span>
				<span class="font-medium text-gray-900 dark:text-gray-100">
					{formatTimestamp(timestamp)}
				</span>
			</div>
		{/if}
	</div>

	{#if Object.keys(details).length > 0}
		<div class="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
			<h4 class="mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">Additional Details</h4>
			<dl class="grid grid-cols-1 gap-2 text-sm">
				{#each Object.entries(details) as [key, value]}
					<div class="flex justify-between">
						<dt class="text-gray-600 capitalize dark:text-gray-400">
							{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
						</dt>
						<dd class="font-medium text-gray-900 dark:text-gray-100">
							{typeof value === 'object' ? JSON.stringify(value) : value}
						</dd>
					</div>
				{/each}
			</dl>
		</div>
	{/if}
</div>
