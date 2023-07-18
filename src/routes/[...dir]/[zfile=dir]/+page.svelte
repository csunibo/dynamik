<script lang="ts">
	import { onDestroy } from 'svelte';
	import Fuse from 'fuse.js';

	import { page } from '$app/stores';
	import { base } from '$app/paths';

	import Line from '$lib/components/Line.svelte';
	import type { FuzzyFile } from '$lib/api';
	import { GH_PAGES_BASE_URL } from '$lib/const';

	import type { PageData } from './$types';
	export let data: PageData;

	let searchActive = false;
	let searchInput: HTMLInputElement;
	let resultList: HTMLUListElement;

	let parentPath = '/';
	const pageUnsubscribe = page.subscribe((page) => {
		const path = page.params.dir.split('/');
		path.push(page.params.file);
		path.pop();
		parentPath = base + '/' + path.join('/');
	});

	let searchQuery = '';
	let fuse: Fuse<FuzzyFile> = new Fuse(data.fuzzy, {
		keys: ['name']
	});
	let active = 0;

	$: fuseResult = fuse
		? fuse.search(searchQuery, {
				limit: 7
		  })
		: [];

	// Set first result as "active"
	$: {
		if (fuseResult) {
			active = 0;
		}
	}

	$: urlParts = $page.url.pathname.split('/').slice(1);

	const getPartHref = (part: string) =>
		$page.url.pathname
			.split('/')
			.slice(0, $page.url.pathname.split('/').indexOf(part) + 1)
			.join('/');

	onDestroy(() => {
		pageUnsubscribe();
	});

	function keydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			if (searchActive) searchActive = false;
		} else if (e.key === 'k' && e.ctrlKey) {
			e.preventDefault();
			if (!searchActive) searchActive = true;

			setTimeout(() => {
				searchInput.focus();
			}, 100);
		} else if (e.key === 'ArrowDown' && resultList) {
			e.preventDefault();
			active = active < resultList.children.length - 1 ? active + 1 : active;
		} else if (e.key === 'ArrowUp' && resultList) {
			e.preventDefault();
			active = active > 0 ? active - 1 : 0;
		} else if (e.key === 'Enter' && resultList) {
			const activeEL = resultList.children[active] as HTMLLIElement;
			const aEl = activeEL.querySelector('a') as HTMLAnchorElement;
			if (aEl) {
				aEl.click();
			}
		}
	}
</script>

<svelte:head>
	<title>Dynamik | {urlParts[urlParts.length-1]}</title>
</svelte:head>

<svelte:body on:keydown={keydown} />

<main class="max-w-5xl p-4 mx-auto">
	<div class="navbar flex bg-neutral-800 hover:bg-neutral-700 transition-colors duration-300 text-neutral-content rounded-box shadow-sm px-5 mb-5">
		<div class="navbar-center">
			<div class="text-xs breadcrumbs sm:text-sm">
				<ul>
					<li>🏠<a href="/">Dynamik</a></li>
					{#each urlParts as part}
						{@const href = getPartHref(part)}
						<li><a {href}>{part}</a></li>
					{/each}
				</ul>
			</div>
		</div>
		<div class="navbar-end" />
	</div>

	<div class="grid gap-5 grid-cols-dir md:grid-cols-dir-full mx-4 text-lg">
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

<input type="checkbox" id="my-modal" class="modal-toggle" checked={searchActive} />

<label for="my-modal" class="modal cursor-pointer" role="search">
	<label class="modal-box relative">
		<input
			class="input input-bordered input-primary w-full mb-2"
			type="text"
			placeholder="Search..."
			bind:this={searchInput}
			bind:value={searchQuery}
		/>
		{#if searchQuery != ''}
			<ul class="menu p-2" bind:this={resultList}>
				{#each fuseResult as result, i}
					{@const href =
						result.item.mime === 'text/statik-link'
							? result.item.url
							: base + result.item.url.split(GH_PAGES_BASE_URL)[1]}
					<li>
						<a {href} class:active={i === active}>
							{result.item.name}
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</label>
</label>
