<!-- Homepage -->
<script lang="ts">
	import Hero from '$lib/web-components/homepage/Hero.svelte';
	import Features from '$lib/web-components/homepage/Features.svelte';
	import Services from '$lib/web-components/homepage/Services.svelte';
	import Contact from '$lib/web-components/homepage/Contact.svelte';
	import Footer from '$lib/web-components/homepage/Footer.svelte';
</script>

<svelte:head>
	<title>Musical Zoe - Your Gateway to the Musical Universe</title>
	<meta
		name="description"
		content="Discover trending tracks, get instant lyrics, stay updated with music news, and explore comprehensive track information - all in one beautiful platform."
	/>
	<meta name="keywords" content="music, lyrics, trends, news, tracks, artists, musical zoe" />
</svelte:head>

<main>
	<Hero />
	<Features />
	<Services />
	<Contact />
	<Footer />
</main>
