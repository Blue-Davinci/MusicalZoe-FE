<script lang="ts">
	import { getContext } from 'svelte';
	import {
		Music,
		Newspaper,
		TrendingUp,
		Search,
		BarChart3,
		Users,
		Activity,
		Calendar,
		Clock,
		AlertCircle,
		CheckCircle,
		Headphones,
		Radio
	} from 'lucide-svelte';
	import Card from '$lib/web-components/ui/Card.svelte';
	import Button from '$lib/web-components/ui/Button.svelte';
	import ServiceCard from '$lib/web-components/ui/ServiceCard.svelte';
	import LyricsSearchWidget from '$lib/web-components/dashboard/LyricsSearchWidget.svelte';
	import TrendingWidget from '$lib/web-components/dashboard/TrendingWidget.svelte';
	import MusicNewsWidget from '$lib/web-components/dashboard/MusicNewsWidget.svelte';
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

	// Service cards configuration
	const serviceCards = [
		{
			title: 'Lyrics Search',
			description: 'Find lyrics and track information',
			icon: Music,
			href: '/dashboard/lyrics',
			color: 'from-purple-500 to-pink-500',
			stats: [
				{ label: 'Searches Today', value: '24' },
				{ label: 'Success Rate', value: '98%' }
			]
		},
		{
			title: 'Music News',
			description: 'Latest industry news and updates',
			icon: Newspaper,
			href: '/dashboard/news',
			color: 'from-blue-500 to-indigo-500',
			stats: [
				{ label: 'Articles Today', value: '156' },
				{ label: 'Sources', value: '25+' }
			]
		},
		{
			title: 'Trending Content',
			description: 'Popular tracks and artists',
			icon: TrendingUp,
			href: '/dashboard/trends',
			color: 'from-green-500 to-teal-500',
			stats: [
				{ label: 'Top Tracks', value: '200' },
				{ label: 'Trending Artists', value: '150' }
			]
		}
	];

	// Dashboard stats using $state for reactivity
	let stats = $state([
		{
			title: 'Lyrics Searches',
			value: 1247,
			change: '+12%',
			icon: Search,
			color: 'text-purple-600'
		},
		{
			title: 'Songs Discovered',
			value: 432,
			change: '+24',
			icon: Headphones,
			color: 'text-blue-600'
		},
		{
			title: 'News Articles',
			value: 156,
			change: '+8%',
			icon: Newspaper,
			color: 'text-green-600'
		},
		{
			title: 'Trending Tracks',
			value: 89,
			change: '+15',
			icon: Radio,
			color: 'text-orange-600'
		}
	]);

	// Recent music activities
	let recentActivities = $state([
		{
			id: 1,
			type: 'success',
			message: 'Found lyrics for "Bohemian Rhapsody"',
			time: '2 minutes ago',
			icon: Music
		},
		{
			id: 2,
			type: 'info',
			message: 'New trending artist: The Weeknd',
			time: '5 minutes ago',
			icon: TrendingUp
		},
		{
			id: 3,
			type: 'success',
			message: 'Music news updated with 12 new articles',
			time: '1 hour ago',
			icon: Newspaper
		},
		{
			id: 4,
			type: 'info',
			message: 'Daily trending charts refreshed',
			time: '2 hours ago',
			icon: BarChart3
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
				Welcome to MusicalZoe, {userDisplayName}! 🎵
			</h1>
			<p class="text-muted-foreground mt-1">Your gateway to lyrics, music news, and trending content.</p>
		</div>
		<div class="flex items-center space-x-3">
			<Button variant="outline" href="/profile">
				<Users class="mr-2 h-4 w-4" />
				Profile
			</Button>
			<Button variant="primary" href="/explore">
				<Music class="mr-2 h-4 w-4" />
				Explore Music
			</Button>
		</div>
	</div>

	<!-- Music Stats Grid -->
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
						{#if stat.icon === Search}
							<Search class="h-6 w-6 {stat.color}" />
						{:else if stat.icon === Headphones}
							<Headphones class="h-6 w-6 {stat.color}" />
						{:else if stat.icon === Newspaper}
							<Newspaper class="h-6 w-6 {stat.color}" />
						{:else if stat.icon === Radio}
							<Radio class="h-6 w-6 {stat.color}" />
						{/if}
					</div>
				</div>
			</Card>
		{/each}
	</div>

	<!-- Service Cards Grid -->
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
		{#each serviceCards as service}
			<ServiceCard
				title={service.title}
				description={service.description}
				icon={service.icon}
				href={service.href}
				color={service.color}
				stats={service.stats}
			/>
		{/each}
	</div>

	<!-- Main Dashboard Widgets -->
	<div class="space-y-8">
		<!-- Section Header -->
		<div class="flex items-center justify-between">
			<div>
				<h2 class="text-2xl font-bold text-foreground">Music Hub</h2>
				<p class="text-muted-foreground">Discover trending content and search for lyrics</p>
			</div>
			<Button variant="outline" href="/dashboard/trends">
				<TrendingUp class="mr-2 h-4 w-4" />
				View All Trends
			</Button>
		</div>

		<!-- Hero Widget Section - Trending takes more space as it's content-heavy -->
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-5">
			<!-- Trending Widget - Takes more space as it's content-heavy -->
			<div class="lg:col-span-3">
				<TrendingWidget />
			</div>
			
			<!-- Quick Actions Column -->
			<div class="lg:col-span-2 space-y-6">
				<!-- Lyrics Search Widget -->
				<LyricsSearchWidget />
				
				<!-- Music News Preview -->
				<MusicNewsWidget />
			</div>
		</div>
	</div>

	<!-- Bottom Section: Activity Feed and Quick Actions -->
	<div class="space-y-6">
		<!-- Section Header -->
		<div class="flex items-center justify-between">
			<div>
				<h2 class="text-2xl font-bold text-foreground">Activity & Actions</h2>
				<p class="text-muted-foreground">Recent activity and quick access to features</p>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-8 xl:grid-cols-4">
			<!-- Recent Activity Feed -->
			<div class="xl:col-span-3">
				<Card class="p-6 h-full">
					<div class="mb-6 flex items-center justify-between">
						<h3 class="text-foreground text-xl font-semibold">Recent Music Activity</h3>
						<Button variant="ghost" size="sm" href="/activity">
							<Activity class="mr-2 h-4 w-4" />
							View All
						</Button>
					</div>
					<div class="space-y-4">
						{#each recentActivities as activity}
							<div class="flex items-start space-x-3">
								<div class="rounded-full p-2 {getActivityStyles(activity.type)}">
									{#if activity.icon === Music}
										<Music class="h-4 w-4" />
									{:else if activity.icon === TrendingUp}
										<TrendingUp class="h-4 w-4" />
									{:else if activity.icon === Newspaper}
										<Newspaper class="h-4 w-4" />
									{:else if activity.icon === BarChart3}
										<BarChart3 class="h-4 w-4" />
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
				</Card>
			</div>

			<!-- Quick Music Actions -->
			<div class="xl:col-span-1">
				<Card class="p-6 h-full">
					<h3 class="text-foreground mb-6 text-xl font-semibold">Quick Actions</h3>
					<div class="space-y-3">
						<Button variant="outline" class="w-full h-16 flex-col space-y-2" href="/search">
							<Search class="h-5 w-5" />
							<span class="text-sm">Search Lyrics</span>
						</Button>
						<Button variant="outline" class="w-full h-16 flex-col space-y-2" href="/trends">
							<TrendingUp class="h-5 w-5" />
							<span class="text-sm">View Trends</span>
						</Button>
						<Button variant="outline" class="w-full h-16 flex-col space-y-2" href="/news">
							<Newspaper class="h-5 w-5" />
							<span class="text-sm">Latest News</span>
						</Button>
						<Button variant="outline" class="w-full h-16 flex-col space-y-2" href="/favorites">
							<Activity class="h-5 w-5" />
							<span class="text-sm">My Favorites</span>
						</Button>
					</div>
				</Card>
			</div>
		</div>
	</div>

	<!-- Music Discovery Section -->
	<Card class="p-6">
		<div class="mb-6 flex items-center justify-between">
			<h2 class="text-foreground text-xl font-semibold">Discover New Music</h2>
			<Button variant="outline" href="/discover">
				<Music class="mr-2 h-4 w-4" />
				Explore More
			</Button>
		</div>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
			<div class="text-center p-6 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200 dark:border-purple-800">
				<Music class="h-8 w-8 mx-auto mb-3 text-purple-600" />
				<h3 class="font-semibold text-foreground mb-2">Find Lyrics</h3>
				<p class="text-sm text-muted-foreground mb-4">Search for lyrics of your favorite songs</p>
				<Button variant="outline" size="sm" href="/dashboard/lyrics">
					Get Started
				</Button>
			</div>
			<div class="text-center p-6 rounded-lg bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200 dark:border-blue-800">
				<Newspaper class="h-8 w-8 mx-auto mb-3 text-blue-600" />
				<h3 class="font-semibold text-foreground mb-2">Music News</h3>
				<p class="text-sm text-muted-foreground mb-4">Stay updated with the latest music industry news</p>
				<Button variant="outline" size="sm" href="/dashboard/news">
					Read News
				</Button>
			</div>
			<div class="text-center p-6 rounded-lg bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-200 dark:border-green-800">
				<TrendingUp class="h-8 w-8 mx-auto mb-3 text-green-600" />
				<h3 class="font-semibold text-foreground mb-2">Trending</h3>
				<p class="text-sm text-muted-foreground mb-4">Discover what's trending in music right now</p>
				<Button variant="outline" size="sm" href="/dashboard/trends">
					See Trends
				</Button>
			</div>
		</div>
	</Card>
</div>
