<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { marked } from 'marked';
	import markedKatex from '$lib/marked-katex';
	marked.use(markedKatex());

	export let data: PageData;

	let markdown: HTMLElement;

	onMount(async () => {
		const html = await marked(data.body, { async: true });
		markdown.innerHTML = html;
	});
</script>

<markdown bind:this={markdown} />

<style>
	@import 'katex/dist/katex.min.css';
</style>
