<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import autoRender from 'katex/dist/contrib/auto-render.mjs';

	export let data: PageData;

	let docContainer: HTMLElement;

	onMount(() => {
		const asciidoctor = window.Asciidoctor();
		docContainer.innerHTML = asciidoctor.convert(data.body, {
			attributes: { showtitle: true }
		});
		autoRender(docContainer);
	});
</script>

<svelte:head>
	<script
		src="https://cdn.jsdelivr.net/npm/@asciidoctor/core@2.2.6/dist/browser/asciidoctor.min.js"
	></script>
</svelte:head>

<main class="container m-auto grid gap-4 grid-cols-[4fr,1fr]">
	<section class="prose m-auto" id="markdown" bind:this={docContainer} role="document" />
</main>
