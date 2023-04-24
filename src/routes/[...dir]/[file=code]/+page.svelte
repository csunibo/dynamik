<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	import { BUNDLED_LANGUAGES, getHighlighter, setCDN } from 'shiki';
	setCDN('https://cdn.jsdelivr.net/npm/shiki/');

	export let data: PageData;

	let code: HTMLElement;

	onMount(async () => {
		const lang = data.extension;
		const selectedLang = BUNDLED_LANGUAGES.filter(
			(bundle) => bundle.id === lang || bundle.aliases?.includes(lang)
		);

		const highlighter = await getHighlighter({
			theme: 'dark-plus',
			langs: selectedLang
		});
		code.innerHTML = highlighter.codeToHtml(data.body, { lang: lang });
	});
</script>

<pre><code bind:this={code}>{data.body}</code></pre>
