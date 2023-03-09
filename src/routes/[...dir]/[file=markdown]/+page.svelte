<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { marked } from 'marked';
	import tocbot from 'tocbot';
	// @ts-expect-error - auto-render is not in the type definitions
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

<div class="container">
	<markdown id="markdown" bind:this={markdown} />
	<div id="toc" bind:this={toc} />
</div>

<style>
	@import 'katex/dist/katex.css';

	.container {
		font-family: Arial, Helvetica, sans-serif;

		display: grid;
		grid-template-columns: 1fr 3fr 1fr;
		grid-gap: 1rem;
		margin: 0 2rem;
	}
	#markdown {
		grid-column: 2;
	}

	#toc {
		grid-column: 3;
	}
</style>
