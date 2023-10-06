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
	
	function viewMobileFinder() {
		searchActive = !searchActive;
		setTimeout(() => {
			searchInput.focus();
		}, 100);
	}
</script>

<svelte:head>
	<title>Risorse | {urlParts[urlParts.length - 1]}</title>
</svelte:head>

<svelte:body on:keydown={keydown} />

<main class="max-w-6xl p-4 mx-auto">
	<div class="navbar flex bg-base-200 text-neutral-content rounded-box shadow-sm px-5 mb-5">
		<div class="navbar-center">
			<div class="lg:text-lg breadcrumbs text-sm">
				<ul>
					<li>🏠<a class="ml-1" href="/">Risorse</a></li>
					{#each urlParts as part}
						{@const href = getPartHref(part)}
						<li><a {href}>{part}</a></li>
					{/each}
				</ul>
			</div>
           
		</div>
		<div class="flex flex-1  justify-end mr-2" > 
			<button class="lg:ml-2 p-1 bg-base-300  rounded-lg btn-ghost" title="ctrl + k" on:click|preventDefault={() => viewMobileFinder()}>
				🔍 <kbd class="kbd-sm   hidden lg:inline-block">ctrl + k </kbd>  
			</button>
		</div>
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

