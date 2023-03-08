<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { marked } from 'marked';
	// @ts-expect-error - auto-render is not in the type definitions
	import autoRender from 'katex/dist/contrib/auto-render.mjs';

	export let data: PageData;

	let markdown: HTMLElement;

	onMount(async () => {
		markdown.innerHTML = await marked(data.body, { async: true });
		autoRender(markdown, {
			delimiters: [
				{ left: '$$', right: '$$', display: true },
				{ left: '\\[', right: '\\]', display: true },
				{ left: '$', right: '$', display: false },
				{ left: '\\(', right: '\\)', display: false }
			]
		});
	});
</script>

<markdown bind:this={markdown} />

<style>
	@import 'katex/dist/katex.min.css';
</style>
