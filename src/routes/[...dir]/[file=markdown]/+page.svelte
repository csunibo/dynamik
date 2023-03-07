<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let markdown: HTMLElement;

	onMount(async () => {
		// @ts-expect-error - katex is not in the types
		await import('katex/dist/katex.mjs');
		// @ts-expect-error - auto-render is not in the types
		const { default: renderMathInElement } = await import('katex/dist/contrib/auto-render.mjs');
		await import('katex/dist/katex.min.css');
		const { marked } = await import('marked');
		const html = await marked(data.body, { async: true });
		markdown.innerHTML = html;
		renderMathInElement(markdown);
	});
</script>

<markdown bind:this={markdown} />
