<script lang="ts">
	import { onMount } from 'svelte';
	import settings from '$lib/settings';
	import { SvelteToast } from '@zerodevx/svelte-toast';

	onMount(() => {
		settings.subscribe(() => {
			document.firstElementChild!.setAttribute('data-theme', $settings.theme);
		});
	});
</script>

<slot />

<SvelteToast />

<style>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
