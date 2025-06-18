<script lang="ts">
	import { getContext } from 'svelte';
	import {
		User,
		Mail,
		Calendar,
		Shield,
		Settings,
		Edit3,
		CheckCircle,
		AlertCircle
	} from 'lucide-svelte';
	import Card from '$lib/web-components/ui/Card.svelte';
	import Button from '$lib/web-components/ui/Button.svelte';
	import type { User as UserType } from '$lib/utils/token-helpers';

	// Get authentication context
	const getAuth = getContext<
		() => {
			user: UserType | null;
			isAuthenticated: boolean;
			isAdmin: boolean;
			isVerified: boolean;
		}
	>('auth');

	// Create reactive auth data
	const auth = $derived(getAuth());

	// User display information
	const userDisplayName = $derived(
		auth.user?.first_name && auth.user?.last_name
			? `${auth.user.first_name} ${auth.user.last_name}`
			: auth.user?.first_name
				? auth.user.first_name
				: auth.user?.name || 'User'
	);

	const userInitials = $derived(
		auth.user?.first_name && auth.user?.last_name
			? `${auth.user.first_name.charAt(0)}${auth.user.last_name.charAt(0)}`
			: auth.user?.first_name
				? auth.user.first_name.charAt(0)
				: auth.user?.name?.charAt(0) || 'U'
	);

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	// Mock user activity data (in a real app, this would come from an API)
	const userStats = [
		{ label: 'Lyrics Searched', value: '247', icon: User },
		{ label: 'Songs Discovered', value: '89', icon: CheckCircle },
		{ label: 'Days Active', value: '42', icon: Calendar },
		{ label: 'News Read', value: '156', icon: Settings }
	];

	const recentActivity = [
		{ action: 'Searched for lyrics', song: '"Bohemian Rhapsody" by Queen', time: '2 hours ago' },
		{ action: 'Viewed trending', song: 'Top tracks this week', time: '1 day ago' },
		{ action: 'Read news article', song: '"Music Industry Updates"', time: '2 days ago' },
		{ action: 'Searched for lyrics', song: '"Imagine" by John Lennon', time: '3 days ago' }
	];
</script>

<svelte:head>
	<title>Profile - Musical Zoe</title>
	<meta
		name="description"
		content="View and manage your Musical Zoe profile, activity, and preferences."
	/>
</svelte:head>

<div class="container mx-auto space-y-8 px-4 py-8">
	<!-- Profile Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-foreground text-3xl font-bold">My Profile</h1>
			<p class="text-muted-foreground mt-1">Manage your account and view your music activity</p>
		</div>
		<Button variant="outline" href="/dashboard">
			<User class="mr-2 h-4 w-4" />
			Back to Dashboard
		</Button>
	</div>

	<!-- Profile Information -->
	<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
		<!-- Main Profile Card -->
		<div class="lg:col-span-2">
			<Card class="p-8">
				<div class="flex items-start space-x-6">
					<!-- Avatar -->
					<div
						class="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-2xl font-bold text-white shadow-lg"
					>
						{userInitials}
					</div>

					<!-- User Info -->
					<div class="flex-1">
						<div class="mb-4 flex items-center space-x-3">
							<h2 class="text-foreground text-2xl font-bold">{userDisplayName}</h2>
							{#if auth.user?.activated}
								<div
									class="flex items-center space-x-1 rounded-full bg-green-100 px-3 py-1 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-300"
								>
									<CheckCircle class="h-4 w-4" />
									<span>Verified</span>
								</div>
							{:else}
								<div
									class="flex items-center space-x-1 rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
								>
									<AlertCircle class="h-4 w-4" />
									<span>Unverified</span>
								</div>
							{/if}
						</div>

						<div class="space-y-3">
							<div class="text-muted-foreground flex items-center space-x-3">
								<Mail class="h-4 w-4" />
								<span>{auth.user?.email || 'No email provided'}</span>
							</div>
							{#if auth.user?.created_at}
								<div class="text-muted-foreground flex items-center space-x-3">
									<Calendar class="h-4 w-4" />
									<span>Member since {formatDate(auth.user.created_at)}</span>
								</div>
							{/if}
							{#if auth.isAdmin}
								<div class="text-muted-foreground flex items-center space-x-3">
									<Shield class="h-4 w-4" />
									<span>Administrator</span>
								</div>
							{/if}
						</div>

						<div class="mt-6">
							<Button variant="outline" class="mr-3">
								<Edit3 class="mr-2 h-4 w-4" />
								Edit Profile
							</Button>
							<Button variant="ghost">
								<Settings class="mr-2 h-4 w-4" />
								Settings
							</Button>
						</div>
					</div>
				</div>
			</Card>
		</div>

		<!-- Account Status -->
		<div>
			<Card class="p-6">
				<h3 class="text-foreground mb-4 text-lg font-semibold">Account Status</h3>
				<div class="space-y-4">
					<div class="flex items-center justify-between">
						<span class="text-muted-foreground text-sm">Account Type</span>
						<span class="text-sm font-medium">{auth.isAdmin ? 'Admin' : 'Standard'}</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-muted-foreground text-sm">Verification</span>
						<span
							class="text-sm font-medium {auth.user?.activated
								? 'text-green-600'
								: 'text-yellow-600'}"
						>
							{auth.user?.activated ? 'Verified' : 'Pending'}
						</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-muted-foreground text-sm">Active Status</span>
						<span class="text-sm font-medium text-green-600">Online</span>
					</div>
				</div>

				{#if !auth.user?.activated}
					<div
						class="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20"
					>
						<p class="text-sm text-yellow-800 dark:text-yellow-200">
							Please check your email to verify your account and unlock all features.
						</p>
					</div>
				{/if}
			</Card>
		</div>
	</div>

	<!-- User Statistics -->
	<Card class="p-6">
		<h3 class="text-foreground mb-6 text-xl font-semibold">Your Music Activity</h3>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
			{#each userStats as stat}
				{@const IconComponent = stat.icon}
				<div class="text-center">
					<div
						class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg border border-purple-200 bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:border-purple-800"
					>
						<IconComponent class="h-6 w-6 text-purple-600 dark:text-purple-400" />
					</div>
					<div class="text-foreground text-2xl font-bold">{stat.value}</div>
					<div class="text-muted-foreground text-sm">{stat.label}</div>
				</div>
			{/each}
		</div>
	</Card>

	<!-- Recent Activity -->
	<Card class="p-6">
		<h3 class="text-foreground mb-6 text-xl font-semibold">Recent Activity</h3>
		<div class="space-y-4">
			{#each recentActivity as activity}
				<div class="bg-muted/30 flex items-start space-x-4 rounded-lg p-4">
					<div
						class="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30"
					>
						<User class="h-4 w-4 text-purple-600 dark:text-purple-400" />
					</div>
					<div class="flex-1">
						<p class="text-foreground text-sm">
							<span class="font-medium">{activity.action}</span>
							<span class="text-muted-foreground"> • {activity.song}</span>
						</p>
						<p class="text-muted-foreground mt-1 text-xs">{activity.time}</p>
					</div>
				</div>
			{/each}
		</div>

		<div class="mt-6 text-center">
			<Button variant="outline" href="/dashboard">View Full Activity</Button>
		</div>
	</Card>

	<!-- Quick Actions -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
		<Card class="p-6 text-center">
			<div
				class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500"
			>
				<User class="h-6 w-6 text-white" />
			</div>
			<h4 class="text-foreground mb-2 font-semibold">Search Lyrics</h4>
			<p class="text-muted-foreground mb-4 text-sm">Find lyrics for your favorite songs</p>
			<Button variant="outline" href="/dashboard/lyrics" class="w-full">Start Searching</Button>
		</Card>

		<Card class="p-6 text-center">
			<div
				class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-teal-500"
			>
				<CheckCircle class="h-6 w-6 text-white" />
			</div>
			<h4 class="text-foreground mb-2 font-semibold">Trending Music</h4>
			<p class="text-muted-foreground mb-4 text-sm">Discover what's popular right now</p>
			<Button variant="outline" href="/dashboard/trends" class="w-full">View Trends</Button>
		</Card>

		<Card class="p-6 text-center">
			<div
				class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500"
			>
				<Settings class="h-6 w-6 text-white" />
			</div>
			<h4 class="text-foreground mb-2 font-semibold">Music News</h4>
			<p class="text-muted-foreground mb-4 text-sm">Stay updated with industry news</p>
			<Button variant="outline" href="/dashboard/news" class="w-full">Read News</Button>
		</Card>
	</div>
</div>
