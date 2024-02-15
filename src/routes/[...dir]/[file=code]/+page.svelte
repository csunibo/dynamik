<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	import { bundledLanguagesInfo, codeToHtml } from 'shiki';

	export let data: PageData;

	let container: HTMLElement;

	onMount(async () => {
		const lang = data.extension;
		const selectedLangs = bundledLanguagesInfo.filter(
			(bundle) => bundle.id === lang || bundle.aliases?.includes(lang)
		);

		if (selectedLangs.length === 0) {
			console.error(`Language not found: ${lang}`);
			return;
		}

		const selectedLang = selectedLangs[0].id;

		container.innerHTML = await codeToHtml(data.body, {
			lang: selectedLang,
			theme: 'dark-plus'
		});
	});
</script>

<div bind:this={container}>
	<pre>{data.body}</pre>
</div>

<style>
	:global(pre) {
		padding: 1rem;
	}
</style>
