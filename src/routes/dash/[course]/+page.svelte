<script lang="ts">
	import { base } from '$app/paths';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { Teaching, TeachingYear } from '$lib/teachings';

	export let data: PageData;

	let activeYears: Teaching[] = [];

	onMount(async () => {
		activeYears = (await data.streaming?.activeCourses) ?? [];
	});
</script>

{#if !data.course}
	<h1>Corso non trovato</h1>
{:else}
	<div class="max-w-5xl p-4 mx-auto">
		<div class="navbar bg-neutral text-neutral-content rounded-box shadow-sm px-5 mb-5">
			<div class="navbar-start">
				<a class="btn btn-square btn-ghost" href={$page.url.toString()}>
					{data.course.icon}
				</a>
			</div>
			<div class="navbar-center">
				<h1 class="text-xl font-semibold">
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
					<span class="text-xl mt-5">{year.year} anno</span>
				</li>

				{#each year.teachings as teaching}
					{@const disabled = !activeYears.includes(teaching)}
					{@const href = base + '/' + teaching.url}
					<li class:disabled>
						<a href={disabled ? null : href}>
							{#if teaching.name}
								{teaching.name}
							{:else}
								{teaching.url}
							{/if}
						</a>
					</li>
				{/each}
			{/each}
		</ul>
	</div>
{/if}
