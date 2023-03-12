<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import tocbot from 'tocbot';
	import autoRender from 'katex/dist/contrib/auto-render.mjs';
	import { formatDate } from '$lib/date';
	import settings from '$lib/settings';
	import { EDIT_URLS } from '../../../lib/const';
	import { page } from '$app/stores';
	import { crossfade, fade } from 'svelte/transition';

	export let data: PageData;

	let markdown: HTMLElement;
	let toc: HTMLElement;

	onMount(async () => {
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
	<section class="prose m-auto" id="markdown" bind:this={markdown} role="document">
		{@html data.rendered}
	</section>
	<section class="prose" id="toc" bind:this={toc} role="contentinfo" />
</main>

<div class="my-4 prose prose-slate italic max-w-none text-center mx-10">
	{#await data.info.fileInfo then info}
		{@const editUrls = EDIT_URLS($page.url.pathname)}
		<p transition:fade>
			<span>
				Last edited on
				<span>{formatDate($settings, info.time)}</span>
				<span>
					- View on
					<a href={editUrls.github} target="_blank" rel="noopener noreferrer"> github.com </a>
					- Edit on
					<a href={editUrls.github_edit} target="_blank" rel="noopener noreferrer"> github.com </a>
					or on
					<a href={editUrls.github_dev} target="_blank" rel="noopener noreferrer"> github.dev </a>
				</span>
			</span>
		</p>
	{/await}
</div>

<style>
	@import 'katex/dist/katex.css';
</style>
