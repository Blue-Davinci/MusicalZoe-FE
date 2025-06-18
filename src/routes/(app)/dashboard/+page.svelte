<script lang="ts">
	import { getContext } from 'svelte';
	import { BarChart3, Users, Activity, Calendar, TrendingUp, Clock, AlertCircle, CheckCircle } from 'lucide-svelte';
	import Card from '$lib/web-components/ui/Card.svelte';
	import Button from '$lib/web-components/ui/Button.svelte';
	import type { User } from '$lib/utils/token-helpers';

	// Get authentication context
	const auth = getContext<{
		user: User | null;
		isAuthenticated: boolean;
		isAdmin: boolean;
		isVerified: boolean;
	}>('auth');

	// Dashboard stats using $state for reactivity
	let stats = $state([
		{ 
			title: "Total Sessions", 
			value: 1247, 
			change: "+12%", 
			icon: Users,
			color: "text-blue-600" 
		},
		{ 
			title: "Active Projects", 
			value: 8, 
			change: "+3", 
			icon: BarChart3,
			color: "text-green-600" 
		},
		{ 
			title: "Monthly Growth", 
			value: "24.8%", 
			change: "+4.2%", 
			icon: TrendingUp,
			color: "text-purple-600" 
		},
		{ 
			title: "System Health", 
			value: "98.2%", 
			change: "+0.1%", 
			icon: Activity,
			color: "text-emerald-600" 
		}
	]);

	// Recent activities
	let recentActivities = $state([
		{ 
			id: 1, 
			type: "success", 
			message: "New user registration completed", 
			time: "2 minutes ago",
			icon: CheckCircle 
		},
		{ 
			id: 2, 
			type: "warning", 
			message: "Server memory usage at 85%", 
			time: "5 minutes ago",
			icon: AlertCircle 
		},
		{ 
			id: 3, 
			type: "info", 
			message: "Daily backup completed successfully", 
			time: "1 hour ago",
			icon: Clock 
		},
		{ 
			id: 4, 
			type: "success", 
			message: "API endpoint response time improved", 
			time: "2 hours ago",
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
		auth?.user?.first_name && auth?.user?.last_name 
			? `${auth.user.first_name} ${auth.user.last_name}`
			: auth?.user?.first_name 
			? auth.user.first_name
			: auth?.user?.name || (auth?.user?.email ? auth.user.email.split('@')[0] : 'User')
	);
</script>

<div class="container mx-auto px-4 py-8 space-y-8">
	<!-- Welcome Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-foreground">
				Welcome back, {userDisplayName}! 👋
			</h1>
			<p class="text-muted-foreground mt-1">
				Here's what's happening with your projects today.
			</p>
		</div>
		<div class="flex items-center space-x-3">
			<Button variant="outline" href="/settings">
				<Calendar class="h-4 w-4 mr-2" />
				Schedule
			</Button>
			<Button variant="primary" href="/projects/new">
				New Project
			</Button>
		</div>
	</div>

	<!-- Stats Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		{#each stats as stat}
			<Card class="p-6 hover:shadow-lg transition-shadow duration-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-muted-foreground">
							{stat.title}
						</p>
						<p class="text-2xl font-bold text-foreground mt-2">
							{stat.value}
						</p>
						<p class="text-sm text-green-600 mt-1">
							{stat.change} from last month
						</p>
					</div>
					<div class="p-3 rounded-lg bg-muted">
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
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
		<!-- Chart Section -->
		<div class="lg:col-span-2">
			<Card class="p-6">
				<div class="flex items-center justify-between mb-6">
					<h2 class="text-xl font-semibold text-foreground">
						Analytics Overview
					</h2>
					<div class="flex space-x-2">
						<Button variant="ghost" size="sm">
							7D
						</Button>
						<Button variant="ghost" size="sm">
							30D
						</Button>
						<Button variant="outline" size="sm">
							90D
						</Button>
					</div>
				</div>
				<div class="h-80 flex items-center justify-center bg-muted rounded-lg">
					<div class="text-center text-muted-foreground">
						<BarChart3 class="h-12 w-12 mx-auto mb-4 opacity-50" />
						<p class="text-lg font-medium">Chart Component</p>
						<p class="text-sm">Analytics visualization will be displayed here</p>
					</div>
				</div>
			</Card>
		</div>

		<!-- Activity Feed -->
		<div>
			<Card class="p-6">
				<h2 class="text-xl font-semibold text-foreground mb-6">
					Recent Activity
				</h2>
				<div class="space-y-4">
					{#each recentActivities as activity}
						<div class="flex items-start space-x-3">						<div class="p-2 rounded-full {getActivityStyles(activity.type)}">
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
							<div class="flex-1 min-w-0">
								<p class="text-sm font-medium text-foreground">
									{activity.message}
								</p>
								<p class="text-xs text-muted-foreground mt-1">
									{activity.time}
								</p>
							</div>
						</div>
					{/each}
				</div>
				<div class="mt-6 pt-4 border-t border-border">
					<Button variant="ghost" class="w-full">
						View all activities
					</Button>
				</div>
			</Card>
		</div>
	</div>

	<!-- Quick Actions -->
	<Card class="p-6">
		<h2 class="text-xl font-semibold text-foreground mb-6">
			Quick Actions
		</h2>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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