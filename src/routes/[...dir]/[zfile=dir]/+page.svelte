<script lang="ts">
	import type { PageData } from './$types';
	import type { File } from '$lib/api';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { onDestroy } from 'svelte';

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

<code>{$page.url.pathname}</code>

<ul>
	<li>
		<a href={parentPath}>..</a>
	</li>

	{#if data.manifest.directories}
		{@const directories = data.manifest.directories}
		{#each directories as dir}
			<li>
				<a href={$page.url + '/' + dir.name}>{dir.name}</a>
			</li>
		{/each}
	{/if}
	{#if data.manifest.files}
		{@const files = data.manifest.files}
		{#each files as file}
			{@const href = `${$page.url}/${file.name}`}
			<li>
				<a {href}>
					{file.name}
				</a>
			</li>
		{/each}
	{/if}
</ul>

<details>
	<summary>Debug</summary>
	<pre>
		{JSON.stringify(data.manifest, null, 2)}
	</pre>
</details>
