<!-- Header/Navigation Component -->
<script lang="ts">
	import { Menu, X, Sun, Moon } from 'lucide-svelte';
	import { mode, toggleMode } from 'mode-watcher';
	import Button from './Button.svelte';
	
	let isMenuOpen = $state(false);
	
	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
	
	const navigation = [
		{ name: 'Home', href: '/' },
		{ name: 'Features', href: '#features' },
		{ name: 'Services', href: '#services' },
		{ name: 'Contact', href: '#contact' }
	];
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

			<!-- Desktop Auth Buttons -->
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
				
				<Button variant="ghost" href="/auth/login">
					Sign In
				</Button>
				<Button variant="primary" href="/auth/signup">
					Get Started
				</Button>
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
						<div class="flex flex-col space-y-2">
							<!-- Mobile Theme Toggle -->
							<button
								onclick={toggleMode}
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
							
							<Button variant="ghost" href="/auth/login" class="justify-center">
								Sign In
							</Button>
							<Button variant="primary" href="/auth/signup" class="justify-center">
								Get Started
							</Button>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</nav>
</header>
