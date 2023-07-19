<script lang="ts">
	import { base } from '$app/paths';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { Teaching } from '$lib/teachings';

	export let data: PageData;

	let activeYears: Teaching[] = [];

	onMount(async () => {
		activeYears = (await data.streaming?.activeCourses) ?? [];
	});
</script>

<svelte:head>
	<title>Dynamik | {data.course?.name}</title>
</svelte:head>

{#if !data.course}
	<h1>Corso non trovato</h1>
{:else}
	<div class="max-w-5xl p-4 mx-auto">
		<div class="navbar flex bg-base-200 text-neutral-content rounded-box shadow-sm px-5 mb-5">
			<div class="navbar-start">
				<a class="btn btn-square btn-ghost" href={$page.url.toString()}>
					{data.course.icon}
				</a>
			</div>
			<div class="navbar-center">
				<h1 class="text-xl font-semibold text-base-content">
					Dashboard di {data.course.name}
				</h1>
			</div>
			<div class="navbar-end">
				<button class="btn btn-square btn-ghost" title="Indietro" on:click={() => history.back()}>
					⬆️
				</button>
			</div>
		</div>

		<ul class="menu p-2">
			{#each data.course.years as year}
				<li class="menu-title">
					<span class="text-2xl mt-5 italic">{year.year} anno</span>
				</li>
				<div class="divider mt-0"></div>
				<div class="flex flex-row flex-wrap">
					{#each year.teachings as teaching}
						{@const disabled = !activeYears.includes(teaching)}
						{@const href = base + '/' + teaching.url}
						<li class:disabled class="flex xs:flex-1 justify-center border-base-content items-center m-2 border-2 rounded-md">
							<a href={disabled ? null : href} class="text-center text-lg">
								{#if teaching.name}
									{teaching.name}
								{:else}
									{teaching.url}
								{/if}
							</a>
						</li>
					{/each}
					</div>
			{/each}
		</ul>
	</div>
{/if}
