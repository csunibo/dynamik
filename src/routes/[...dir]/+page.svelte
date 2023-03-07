<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';

	export let data: PageData;

	let parentPath = '/';
	page.subscribe((page) => {
		const path = page.url.pathname.split('/');
		path.pop();
		return path.join('/');
	});

	$: isOrigin = $page.url.pathname === '/';
</script>

<code>{$page.url.pathname}</code>

<ul>
	{#if !isOrigin}
		<li>
			<a href={parentPath}>..</a>
		</li>
	{/if}

	{#if data.manifest.directories}
		{@const directories = data.manifest.directories}
		{#each directories as dir}
			<li>
				<a href={dir.path}>{dir.name}</a>
			</li>
		{/each}
	{/if}
	{#if data.manifest.files}
		{@const files = data.manifest.files}
		{#each files as file}
			<li>
				<a href={file.url} target="_blank" rel="noreferrer">
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
