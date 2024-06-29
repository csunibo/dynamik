<script lang="ts">
	import { page } from '$app/stores';

	import Line from '$lib/components/Line.svelte';
	import { teachingsFilter, type Degree } from '$lib/teachings';
	import { EDIT_URLS } from '$lib/const';
	import { doneFiles, anyFileDone } from '$lib/todo-file';

	import type { PageData } from './$types';
	import FuzzySearch from '$lib/components/FuzzySearch.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	export let data: PageData;
	let fuzzy: FuzzySearch;

	$: urlParts = $page.url.pathname
		.split('/')
		.slice(1)
		.filter((p) => p !== ''); // otherwise we get an empty string at the end

	function kebabToTitle(str: string) {
		return str
			.split('-')
			.map((s) => s[0].toUpperCase() + s.slice(1))
			.join(' ');
	}

	function titleToAcronym(str: string) {
		return str
			.split(' ')
			.map((s) => s[0].toUpperCase())
			.join('');
	}

	function genTitle(parts: string[]) {
		if (parts.length === 0) return 'Risorse';
		const title = kebabToTitle(parts[0]);

		if (parts.length === 1) {
			return title;
		} else if (parts.length === 2) {
			return titleToAcronym(title) + ' > ' + kebabToTitle(parts[1]);
		} else {
			return titleToAcronym(title) + ' >...> ' + kebabToTitle(parts[parts.length - 1]);
		}
	}

	$: title = genTitle(urlParts);

	// --- Sorting ---
	let reverseMode = true; // partiamo in ordine A-Z

	/**
	 * Inverte l'ordine di visualizzazione delle risorse
	 */
	function toggleReverse() {
		reverseMode = !reverseMode;
	}

	// Done file status
	$: isDone = anyFileDone(data.manifest.files?.map((f) => f.url) ?? []);

	function cleanDone() {
		doneFiles.update((old) => {
			data.manifest.files?.forEach((f) => {
				old[f.url] = false;
			});
			return old;
		});
	}
</script>

<svelte:head>
	<title>{title}</title>
	<meta property="og:title" content={title} />
</svelte:head>

<main class="max-w-6xl min-w-fit p-4 mx-auto">
	<Navbar {urlParts} {title} {fuzzy} {data} />
	<div class="flex flex-1 justify-start mr-4 mb-3">
		{#if $isDone}
			<button
				class="lg:ml-2 p-1 flex mr-2 items-center"
				on:click={cleanDone}
				title="Clean all done files in this page"
			>
				<span class="text-warning text-xl icon-[solar--broom-bold-duotone]"></span>
			</button>
		{/if}
		<!-- Reverse Mode -->
		<button class="lg:ml-2 p-1 flex items-center rounded-xl text-primary" on:click={toggleReverse}>
			Nome
			<span class="ms-2 text-xl icon-[solar--sort-vertical-bold-duotone]" class:flip={reverseMode}
			></span>
		</button>
	</div>

	<div class="grid gap-5 grid-cols-dir md:grid-cols-dir-full mx-4 text-lg">
		{#if data.manifest.directories != null}
			{@const directories = data.manifest.directories.sort((a, b) => a.name.localeCompare(b.name))}
			{#if !reverseMode}
				{#each directories.reverse() as dir}
					<Line data={dir} />
				{/each}
			{:else}
				{#each directories as dir}
					<Line data={dir} />
				{/each}
			{/if}
		{/if}
		{#if data.manifest.files != null}
			{@const files = data.manifest.files.sort((a, b) => a.name.localeCompare(b.name))}
			{#if !reverseMode}
				{#each files.reverse() as file}
					<Line data={file} />
				{/each}
			{:else}
				{#each files as file}
					<Line data={file} />
				{/each}
			{/if}
		{/if}
	</div>
</main>

<style>
	.flip {
		transform: scaleX(-1) scaleY(-1);
	}
</style>
