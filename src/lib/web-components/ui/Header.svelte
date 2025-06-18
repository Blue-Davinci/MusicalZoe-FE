<!-- Header/Navigation Component -->
<script lang="ts">
	import { Menu, X, Sun, Moon, User } from 'lucide-svelte';
	import { mode, toggleMode } from 'mode-watcher';
	import Button from './Button.svelte';
	import LogoutButton from './LogoutButton.svelte';
	import type { User as UserType } from '$lib/utils/token-helpers';

	// Props for user authentication state using Svelte 5 syntax
	let {
		user = $bindable(),
		isAuthenticated = $bindable(),
		isAdmin = $bindable(),
		variant = 'home'
	}: {
		user?: UserType | null;
		isAuthenticated?: boolean;
		isAdmin?: boolean;
		variant?: 'home' | 'dashboard';
	} = $props();

	let isMenuOpen = $state(false);
	let isUserMenuOpen = $state(false);

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function toggleUserMenu() {
		isUserMenuOpen = !isUserMenuOpen;
	}

	// Close user menu when clicking outside
	function closeUserMenu() {
		isUserMenuOpen = false;
	}

	// Navigation based on variant using $derived
	const navigation = $derived(
		variant === 'dashboard'
			? [{ name: 'Home', href: '/' }]
			: [
					{ name: 'Home', href: '/' },
					{ name: 'Features', href: '#features' },
					{ name: 'Services', href: '#services' },
					{ name: 'Contact', href: '#contact' }
				]
	);

	const userNavigation = [
		{ name: 'Dashboard', href: '/dashboard' },
		{ name: 'Profile', href: '/profile' },
		{ name: 'Settings', href: '/settings' }
	];

	// Add admin link if user is admin using $derived
	const adminNavigation = $derived(isAdmin ? [{ name: 'Admin Panel', href: '/admin' }] : []);

	// Get user display name using $derived
	const userDisplayName = $derived(
		user?.first_name && user?.last_name
			? `${user.first_name} ${user.last_name}`
			: user?.first_name
				? user.first_name
				: user?.name || (user?.email ? user.email.split('@')[0] : 'User')
	);
</script>

<header class="bg-background/80 border-border sticky top-0 z-50 border-b backdrop-blur-md">
	<nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo -->
			<div class="flex items-center">
				<a href="/" class="flex items-center space-x-3">
					<img
						src="https://i.ibb.co/zhMky0qT/musical-zoe-high-resolution-logo-transparent.png"
						alt="Musical Zoe Logo"
						class="h-10 w-auto"
					/>
					<span
						class="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-xl font-bold text-transparent"
					>
						Musical Zoe
					</span>
				</a>
			</div>

			<!-- Desktop Navigation -->
			<div class="hidden items-center space-x-8 md:flex">
				{#each navigation as item}
					<a
						href={item.href}
						class="text-muted-foreground hover:text-primary font-medium transition-colors duration-200"
					>
						{item.name}
					</a>
				{/each}
			</div>

			<!-- Desktop Auth/User Section -->
			<div class="hidden items-center space-x-4 md:flex">
				<!-- Theme Toggle Button -->
				<button
					onclick={toggleMode}
					class="text-muted-foreground hover:bg-muted rounded-lg p-2 transition-colors duration-200"
					aria-label="Toggle theme"
				>
					{#if mode.current === 'dark'}
						<Sun class="h-5 w-5" />
					{:else}
						<Moon class="h-5 w-5" />
					{/if}
				</button>

				{#if isAuthenticated && user}
					<!-- Authenticated User Menu -->
					<div class="relative">
						<button
							onclick={toggleUserMenu}
							class="text-muted-foreground hover:bg-muted flex items-center space-x-2 rounded-lg px-3 py-2 transition-colors duration-200"
						>
							<User class="h-5 w-5" />
							<span class="font-medium">{userDisplayName}</span>
						</button>

						{#if isUserMenuOpen}
							<!-- User Dropdown Menu -->
							<div
								class="bg-background border-border absolute right-0 z-50 mt-2 w-48 rounded-lg border shadow-lg"
								role="menu"
								tabindex="-1"
								onblur={closeUserMenu}
								onkeydown={(e) => e.key === 'Escape' && closeUserMenu()}
							>
								<div class="py-1">
									<div class="text-muted-foreground border-border border-b px-4 py-2 text-sm">
										{user.email}
									</div>
									{#each [...userNavigation, ...adminNavigation] as item}
										<a
											href={item.href}
											class="text-foreground hover:bg-muted block px-4 py-2 text-sm transition-colors duration-200"
											onclick={closeUserMenu}
										>
											{item.name}
										</a>
									{/each}
									<div class="border-border mt-1 border-t pt-1">
										<div class="px-4 py-2">
											<LogoutButton variant="ghost" size="sm" />
										</div>
									</div>
								</div>
							</div>
						{/if}
					</div>
				{:else}
					<!-- Guest User Buttons -->
					<Button variant="ghost" href="/login">Sign In</Button>
					<Button variant="primary" href="/signup">Get Started</Button>
				{/if}
			</div>

			<!-- Mobile menu button -->
			<div class="md:hidden">
				<button
					onclick={toggleMenu}
					class="text-muted-foreground hover:text-primary hover:bg-muted inline-flex items-center justify-center rounded-md p-2 transition-colors duration-200"
				>
					{#if isMenuOpen}
						<X class="h-6 w-6" />
					{:else}
						<Menu class="h-6 w-6" />
					{/if}
				</button>
			</div>
		</div>

		<!-- Mobile Navigation -->
		{#if isMenuOpen}
			<div class="md:hidden">
				<div class="bg-background border-border space-y-1 border-t px-2 pt-2 pb-3">
					{#each navigation as item}
						<a
							href={item.href}
							class="text-muted-foreground hover:text-primary hover:bg-muted block rounded-md px-3 py-2 font-medium transition-colors duration-200"
							onclick={toggleMenu}
						>
							{item.name}
						</a>
					{/each}

					<div class="border-border mt-4 border-t pt-4 pb-2">
						{#if isAuthenticated && user}
							<!-- Authenticated Mobile Menu -->
							<div class="flex flex-col space-y-2">
								<div class="text-muted-foreground px-3 py-2 text-sm">
									Signed in as <span class="font-medium">{userDisplayName}</span>
								</div>

								{#each [...userNavigation, ...adminNavigation] as item}
									<a
										href={item.href}
										class="text-muted-foreground hover:text-primary hover:bg-muted block rounded-md px-3 py-2 font-medium transition-colors duration-200"
										onclick={toggleMenu}
									>
										{item.name}
									</a>
								{/each}

								<!-- Mobile Theme Toggle -->
								<button
									onclick={() => {
										toggleMode();
										toggleMenu();
									}}
									class="text-muted-foreground hover:text-primary hover:bg-muted flex items-center rounded-md px-3 py-2 text-left font-medium transition-colors duration-200"
								>
									{#if mode.current === 'dark'}
										<Sun class="mr-2 h-5 w-5" />
										Light Mode
									{:else}
										<Moon class="mr-2 h-5 w-5" />
										Dark Mode
									{/if}
								</button>

								<div class="px-3 py-2">
									<LogoutButton />
								</div>
							</div>
						{:else}
							<!-- Guest Mobile Menu -->
							<div class="flex flex-col space-y-2">
								<!-- Mobile Theme Toggle -->
								<button
									onclick={() => {
										toggleMode();
										toggleMenu();
									}}
									class="text-muted-foreground hover:text-primary hover:bg-muted flex items-center justify-center rounded-md px-3 py-2 font-medium transition-colors duration-200"
								>
									{#if mode.current === 'dark'}
										<Sun class="mr-2 h-5 w-5" />
										Light Mode
									{:else}
										<Moon class="mr-2 h-5 w-5" />
										Dark Mode
									{/if}
								</button>

								<Button variant="ghost" href="/login" class="justify-center" onclick={toggleMenu}>
									Sign In
								</Button>
								<Button
									variant="primary"
									href="/signup"
									class="justify-center"
									onclick={toggleMenu}
								>
									Get Started
								</Button>
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	</nav>
</header>
