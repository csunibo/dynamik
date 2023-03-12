<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { dev } from '$app/environment';
	import Line from '$lib/components/Line.svelte';

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

<main class="md:container md:m-auto p-4">
	<code>{$page.url.pathname}</code>
	<div
		class="grid gap-4 grid-cols-[min-content,auto,min-content] md:grid-cols-[min-content,auto,min-content,min-content]"
	>
		<Line
			data={{
				name: '..',
				path: '',
				size: '',
				time: '',
				url: ''
			}}
			customUrl={parentPath}
		/>
		{#if data.manifest.directories}
			{@const directories = data.manifest.directories}
			{#each directories as dir}
				<Line data={dir} />
			{/each}
		{/if}
		{#if data.manifest.files}
			{@const files = data.manifest.files}
			{#each files as file}
				<Line data={file} />
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
