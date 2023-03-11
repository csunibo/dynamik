<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { PageData } from './$types';
	import type { File } from '$lib/api';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { dev } from '$app/environment';
	import Line from '$lib/Line.svelte';

	export let data: PageData;

	let parentPath = '/';
	const pageUnsubscribe = page.subscribe((page) => {
		const path = page.params.dir.split('/');
		path.push(page.params.file);
		path.pop();
		parentPath = base + '/' + path.join('/');
	});

	onDestroy(() => {
		pageUnsubscribe();
	});
</script>

<main class="container m-auto">
	<code>{$page.url.pathname}</code>
	<div
		class="grid gap-4 grid-cols-[min-content,auto,min-content] md:grid-cols-[min-content,auto,min-content,min-content]"
	>
		<div class="contents">
			<span>dir</span>
			<a href={parentPath}>..</a>
			<span>-</span>
			<span>-</span>
		</div>
		{#if data.manifest.directories}
			{@const directories = data.manifest.directories}
			{#each directories as dir}
				<Line data={dir} base={$page.url} />
			{/each}
		{/if}
		{#if data.manifest.files}
			{@const files = data.manifest.files}
			{#each files as file}
				<Line data={file} base={$page.url} />
			{/each}
		{/if}
	</div>
</main>

{#if dev}
	<details>
		<summary>Debug</summary>
		<pre>
			{JSON.stringify(data.manifest, null, 2)}
		</pre>
	</details>
{/if}
