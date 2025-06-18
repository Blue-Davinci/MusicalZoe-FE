<script lang="ts">
	import { getContext } from 'svelte';
	import {
		BarChart3,
		Users,
		Activity,
		Calendar,
		TrendingUp,
		Clock,
		AlertCircle,
		CheckCircle
	} from 'lucide-svelte';
	import Card from '$lib/web-components/ui/Card.svelte';
	import Button from '$lib/web-components/ui/Button.svelte';
	import type { User } from '$lib/utils/token-helpers';

	// Get authentication context function
	const getAuth = getContext<() => {
		user: User | null;
		isAuthenticated: boolean;
		isAdmin: boolean;
		isVerified: boolean;
	}>('auth');

	// Create reactive auth data using $derived
	const auth = $derived(getAuth());

	// Dashboard stats using $state for reactivity
	let stats = $state([
		{
			title: 'Total Sessions',
			value: 1247,
			change: '+12%',
			icon: Users,
			color: 'text-blue-600'
		},
		{
			title: 'Active Projects',
			value: 8,
			change: '+3',
			icon: BarChart3,
			color: 'text-green-600'
		},
		{
			title: 'Monthly Growth',
			value: '24.8%',
			change: '+4.2%',
			icon: TrendingUp,
			color: 'text-purple-600'
		},
		{
			title: 'System Health',
			value: '98.2%',
			change: '+0.1%',
			icon: Activity,
			color: 'text-emerald-600'
		}
	]);

	// Recent activities
	let recentActivities = $state([
		{
			id: 1,
			type: 'success',
			message: 'New user registration completed',
			time: '2 minutes ago',
			icon: CheckCircle
		},
		{
			id: 2,
			type: 'warning',
			message: 'Server memory usage at 85%',
			time: '5 minutes ago',
			icon: AlertCircle
		},
		{
			id: 3,
			type: 'info',
			message: 'Daily backup completed successfully',
			time: '1 hour ago',
			icon: Clock
		},
		{
			id: 4,
			type: 'success',
			message: 'API endpoint response time improved',
			time: '2 hours ago',
			icon: TrendingUp
		}
	]);

	// Get activity type styles
	function getActivityStyles(type: string) {
		switch (type) {
			case 'success':
				return 'text-green-600 bg-green-50 dark:bg-green-900/20';
			case 'warning':
				return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
			case 'info':
				return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
			default:
				return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
		}
	}

	// User display name using $derived
	const userDisplayName = $derived(
		auth.user?.first_name && auth.user?.last_name
			? `${auth.user.first_name} ${auth.user.last_name}`
			: auth.user?.first_name
				? auth.user.first_name
				: auth.user?.name || (auth.user?.email ? auth.user.email.split('@')[0] : 'User')
	);
</script>

<div class="container mx-auto space-y-8 px-4 py-8">
	<!-- Activation Warning for Unactivated Users -->
	{#if auth.user && !auth.user.activated}
		<div
			class="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20"
		>
			<div class="flex items-center">
				<AlertCircle class="mr-3 h-5 w-5 text-yellow-600 dark:text-yellow-500" />
				<div>
					<h3 class="text-sm font-medium text-yellow-800 dark:text-yellow-200">
						Account Activation Required
					</h3>
					<p class="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
						Please check your email and click the activation link to fully activate your account.
					</p>
				</div>
			</div>
		</div>
	{/if}

	<!-- Welcome Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-foreground text-3xl font-bold">
				Welcome back, {userDisplayName}! 👋
			</h1>
			<p class="text-muted-foreground mt-1">Here's what's happening with your projects today.</p>
		</div>
		<div class="flex items-center space-x-3">
			<Button variant="outline" href="/settings">
				<Calendar class="mr-2 h-4 w-4" />
				Schedule
			</Button>
			<Button variant="primary" href="/projects/new">New Project</Button>
		</div>
	</div>

	<!-- Stats Grid -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
		{#each stats as stat}
			<Card class="p-6 transition-shadow duration-200 hover:shadow-lg">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-muted-foreground text-sm font-medium">
							{stat.title}
						</p>
						<p class="text-foreground mt-2 text-2xl font-bold">
							{stat.value}
						</p>
						<p class="mt-1 text-sm text-green-600">
							{stat.change} from last month
						</p>
					</div>
					<div class="bg-muted rounded-lg p-3">
						{#if stat.icon === Users}
							<Users class="h-6 w-6 {stat.color}" />
						{:else if stat.icon === BarChart3}
							<BarChart3 class="h-6 w-6 {stat.color}" />
						{:else if stat.icon === TrendingUp}
							<TrendingUp class="h-6 w-6 {stat.color}" />
						{:else if stat.icon === Activity}
							<Activity class="h-6 w-6 {stat.color}" />
						{/if}
					</div>
				</div>
			</Card>
		{/each}
	</div>

	<!-- Main Content Grid -->
	<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
		<!-- Chart Section -->
		<div class="lg:col-span-2">
			<Card class="p-6">
				<div class="mb-6 flex items-center justify-between">
					<h2 class="text-foreground text-xl font-semibold">Analytics Overview</h2>
					<div class="flex space-x-2">
						<Button variant="ghost" size="sm">7D</Button>
						<Button variant="ghost" size="sm">30D</Button>
						<Button variant="outline" size="sm">90D</Button>
					</div>
				</div>
				<div class="bg-muted flex h-80 items-center justify-center rounded-lg">
					<div class="text-muted-foreground text-center">
						<BarChart3 class="mx-auto mb-4 h-12 w-12 opacity-50" />
						<p class="text-lg font-medium">Chart Component</p>
						<p class="text-sm">Analytics visualization will be displayed here</p>
					</div>
				</div>
			</Card>
		</div>

		<!-- Activity Feed -->
		<div>
			<Card class="p-6">
				<h2 class="text-foreground mb-6 text-xl font-semibold">Recent Activity</h2>
				<div class="space-y-4">
					{#each recentActivities as activity}
						<div class="flex items-start space-x-3">
							<div class="rounded-full p-2 {getActivityStyles(activity.type)}">
								{#if activity.icon === CheckCircle}
									<CheckCircle class="h-4 w-4" />
								{:else if activity.icon === AlertCircle}
									<AlertCircle class="h-4 w-4" />
								{:else if activity.icon === Clock}
									<Clock class="h-4 w-4" />
								{:else if activity.icon === TrendingUp}
									<TrendingUp class="h-4 w-4" />
								{/if}
							</div>
							<div class="min-w-0 flex-1">
								<p class="text-foreground text-sm font-medium">
									{activity.message}
								</p>
								<p class="text-muted-foreground mt-1 text-xs">
									{activity.time}
								</p>
							</div>
						</div>
					{/each}
				</div>
				<div class="border-border mt-6 border-t pt-4">
					<Button variant="ghost" class="w-full">View all activities</Button>
				</div>
			</Card>
		</div>
	</div>

	<!-- Quick Actions -->
	<Card class="p-6">
		<h2 class="text-foreground mb-6 text-xl font-semibold">Quick Actions</h2>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
			<Button variant="outline" class="h-24 flex-col space-y-2">
				<Users class="h-6 w-6" />
				<span>Invite Team</span>
			</Button>
			<Button variant="outline" class="h-24 flex-col space-y-2">
				<BarChart3 class="h-6 w-6" />
				<span>View Reports</span>
			</Button>
			<Button variant="outline" class="h-24 flex-col space-y-2">
				<Activity class="h-6 w-6" />
				<span>System Health</span>
			</Button>
		</div>
	</Card>
</div>
