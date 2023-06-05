<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let iframe: HTMLIFrameElement;
	onMount(() => {
		// Focus the iframe
		iframe.contentWindow?.focus();
	});
</script>

<iframe bind:this={iframe} title="Embedded resource" src={data.url} />

<style>
	iframe {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		border: 0;
		width: 100vw;
		height: 100vh;
	}
</style>
