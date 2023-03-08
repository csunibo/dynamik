<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { getHighlighter, setCDN } from 'shiki';

	export let data: PageData;

	let code: HTMLElement;

	onMount(async () => {
		setCDN('https://unpkg.com/shiki/');

		const highlighter = await getHighlighter({
			theme: 'dark-plus'
		});
		code.innerHTML = highlighter.codeToHtml(data.body, { lang: 'c' });
	});
</script>

<pre><code bind:this={code}>{data.body}</code></pre>
