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

	$: urlParts = $page.url.pathname.split('/').slice(1);

	const getPartHref = (part: string) =>
		$page.url.pathname
			.split('/')
			.slice(0, $page.url.pathname.split('/').indexOf(part) + 1)
			.join('/');

	onDestroy(() => {
		pageUnsubscribe();
	});
</script>

<main class="max-lg:container max-lg:m-auto p-4 mx-auto max-w-screen-md">
	<div class="my-5">
		<div class="text-sm breadcrumbs">
			<ul>
				<li>🏠<a href="/">Dynamik</a></li>
				{#each urlParts as part}
					{@const href = getPartHref(part)}
					<li><a {href}>{part}</a></li>
				{/each}
			</ul>
		</div>
	</div>
	<div class="grid gap-4 grid-cols-dir md:grid-cols-dir-full">
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
	<details class="m-10">
		<summary>Debug</summary>
		<pre class="code">
			{JSON.stringify(data.manifest, null, 2)}
		</pre>
	</details>
{/if}
