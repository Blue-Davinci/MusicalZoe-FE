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
		isAdmin = $bindable()
	}: {
		user?: UserType | null;
		isAuthenticated?: boolean;
		isAdmin?: boolean;
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
	
	const navigation = [
		{ name: 'Home', href: '/' },
		{ name: 'Features', href: '#features' },
		{ name: 'Services', href: '#services' },
		{ name: 'Contact', href: '#contact' }
	];
	
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


<header class="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
	<nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center h-16">
			<!-- Logo -->
			<div class="flex items-center">
				<a href="/" class="flex items-center space-x-3">
					<img 
						src="https://i.ibb.co/zhMky0qT/musical-zoe-high-resolution-logo-transparent.png" 
						alt="Musical Zoe Logo" 
						class="h-10 w-auto"
					/>
					<span class="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
						Musical Zoe
					</span>
				</a>
			</div>

			<!-- Desktop Navigation -->
			<div class="hidden md:flex items-center space-x-8">
				{#each navigation as item}
					<a 
						href={item.href} 
						class="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
					>
						{item.name}
					</a>
				{/each}
			</div>

			<!-- Desktop Auth/User Section -->
			<div class="hidden md:flex items-center space-x-4">
				<!-- Theme Toggle Button -->
				<button
					onclick={toggleMode}
					class="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors duration-200"
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
							class="flex items-center space-x-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors duration-200"
						>
							<User class="h-5 w-5" />
							<span class="font-medium">{userDisplayName}</span>
						</button>
						
						{#if isUserMenuOpen}
							<!-- User Dropdown Menu -->
							<div 
								class="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50"
								role="menu"
								tabindex="-1"
								onblur={closeUserMenu}
								onkeydown={(e) => e.key === 'Escape' && closeUserMenu()}
							>
								<div class="py-1">
									<div class="px-4 py-2 text-sm text-muted-foreground border-b border-border">
										{user.email}
									</div>
									{#each [...userNavigation, ...adminNavigation] as item}
										<a 
											href={item.href}
											class="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-200"
											onclick={closeUserMenu}
										>
											{item.name}
										</a>
									{/each}
									<div class="border-t border-border mt-1 pt-1">
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
					<Button variant="ghost" href="/login">
						Sign In
					</Button>
					<Button variant="primary" href="/signup">
						Get Started
					</Button>
				{/if}
			</div>

			<!-- Mobile menu button -->
			<div class="md:hidden">
				<button
					onclick={toggleMenu}
					class="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors duration-200"
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
				<div class="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border">
					{#each navigation as item}
						<a 
							href={item.href} 
							class="block px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted transition-colors duration-200 font-medium rounded-md"
							onclick={toggleMenu}
						>
							{item.name}
						</a>
					{/each}
					
					<div class="pt-4 pb-2 border-t border-border mt-4">
						{#if isAuthenticated && user}
							<!-- Authenticated Mobile Menu -->
							<div class="flex flex-col space-y-2">
								<div class="px-3 py-2 text-sm text-muted-foreground">
									Signed in as <span class="font-medium">{userDisplayName}</span>
								</div>
								
								{#each [...userNavigation, ...adminNavigation] as item}
									<a 
										href={item.href}
										class="block px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted transition-colors duration-200 font-medium rounded-md"
										onclick={toggleMenu}
									>
										{item.name}
									</a>
								{/each}
								
								<!-- Mobile Theme Toggle -->
								<button
									onclick={() => { toggleMode(); toggleMenu(); }}
									class="flex items-center px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted transition-colors duration-200 font-medium rounded-md text-left"
								>
									{#if mode.current === 'dark'}
										<Sun class="h-5 w-5 mr-2" />
										Light Mode
									{:else}
										<Moon class="h-5 w-5 mr-2" />
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
									onclick={() => { toggleMode(); toggleMenu(); }}
									class="flex items-center justify-center px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted transition-colors duration-200 font-medium rounded-md"
								>
									{#if mode.current === 'dark'}
										<Sun class="h-5 w-5 mr-2" />
										Light Mode
									{:else}
										<Moon class="h-5 w-5 mr-2" />
										Dark Mode
									{/if}
								</button>
								
								<Button variant="ghost" href="/login" class="justify-center" onclick={toggleMenu}>
									Sign In
								</Button>
								<Button variant="primary" href="/signup" class="justify-center" onclick={toggleMenu}>
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
