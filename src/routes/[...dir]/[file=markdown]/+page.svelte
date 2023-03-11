<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import tocbot from 'tocbot';
	import autoRender from 'katex/dist/contrib/auto-render.mjs';

	export let data: PageData;

	let markdown: HTMLElement;
	let toc: HTMLElement;

	onMount(async () => {
		markdown.innerHTML = data.rendered;
		autoRender(markdown, {
			delimiters: [
				{ left: '$$', right: '$$', display: true },
				{ left: '\\[', right: '\\]', display: true },
				{ left: '$', right: '$', display: false },
				{ left: '\\(', right: '\\)', display: false }
			]
		});

		// build the table of contents by finding all the headings
		tocbot.init({
			tocSelector: '#toc',
			contentSelector: '#markdown',
			headingSelector: 'h2, h3, h4',
			orderedList: false
		});
	});
</script>

<main class="container m-auto grid gap-4 grid-cols-[4fr,1fr]">
	<section class="prose m-auto" id="markdown" bind:this={markdown} role="document" />
	<section class="prose" id="toc" bind:this={toc} role="contentinfo" />
</main>

<style>
	@import 'katex/dist/katex.css';
</style>
