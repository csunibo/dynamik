<script lang="ts">
	import { onMount } from 'svelte';
	import settings from '$lib/settings';

	onMount(() => {
		settings.subscribe(() => {
			document.firstElementChild!.setAttribute('data-theme', $settings.theme);
		});
	});

	import unibo32ico from '$lib/assets/unibo32.ico';
	import unibo128ico from '$lib/assets/unibo128.ico';
	import unibo180ico from '$lib/assets/unibo180.ico';
	import unibo192ico from '$lib/assets/unibo192.ico';

	import unibo128png from '$lib/assets/unibo128.png';
	import unibo180png from '$lib/assets/unibo180.png';
	import unibo192png from '$lib/assets/unibo192.png';
	import unibo512png from '$lib/assets/unibo512.png';

	import ogImage from '$lib/assets/risorse.students.cs.unibo.it.png';
</script>

<svelte:head>
	<link rel="icon" href={unibo32ico} sizes="32x32" />
	<link rel="icon" href={unibo128ico} sizes="128x128" />
	<link rel="icon" href={unibo180ico} sizes="180x180" />
	<link rel="icon" href={unibo192ico} sizes="192x192" />

	<link rel="icon" href={unibo128png} sizes="128x128" />
	<link rel="icon" href={unibo180png} sizes="180x180" />
	<link rel="icon" href={unibo192png} sizes="192x192" />
	<link rel="icon" href={unibo512png} sizes="512x512" />

	<meta name="image" property="og:image" content={ogImage} />
	<meta property="og:image:height" content="600" />
</svelte:head>

<slot />

<style>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
