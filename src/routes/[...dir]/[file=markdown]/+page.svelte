<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { marked } from 'marked';
	import markedKatex from '$lib/marked-katex';
	marked.use(markedKatex());

	import 'katex/dist/katex.min.css';

	export let data: PageData;

	let markdown: HTMLElement;

	onMount(async () => {
		const html = await marked(data.body, { async: true });
		markdown.innerHTML = html;
	});
</script>

<markdown bind:this={markdown} />
