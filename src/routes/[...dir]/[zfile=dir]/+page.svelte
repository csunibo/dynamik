<script lang="ts">
	import type { PageData } from './$types';
	import type { File } from '$lib/api';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { onDestroy } from 'svelte';
	import { building } from '$app/environment';

	export let data: PageData;

	let parentPath = '/';
	const pageUnsubscribe = page.subscribe((page) => {
		const path = page.params.dir.split('/');
		path.push(page.params.file);
		path.pop();
		parentPath = base + '/' + path.join('/');
	});

	const isExternal = (file: File) => file.mime === 'text/statik-link';

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
			<li>
				{#if isExternal(file)}
					<a href={file.url} target="_blank" rel="noreferrer">
						{file.name} 🔗
					</a>
				{:else}
					<a href="{$page.url}/{file.name}">
						{file.name}
					</a>
				{/if}
			</li>
		{/each}
	{/if}
</ul>

{#if !building}
	<details>
		<summary>Debug</summary>
		<pre>
			{JSON.stringify(data.manifest, null, 2)}
		</pre>
	</details>
{/if}
