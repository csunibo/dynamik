<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { getHighlighter, setCDN } from 'shiki';
	setCDN('/node_modules/shiki/');

	export let data: PageData;

	let code: HTMLElement;
	onMount(async () => {
		// TODO
		const highlighter = await getHighlighter({ theme: 'dark-plus', langs: ['c'] });
		code.innerHTML = highlighter.codeToHtml(data.body, { lang: 'c' });
	});
</script>

<pre><code bind:this={code}>{data.body}</code></pre>
