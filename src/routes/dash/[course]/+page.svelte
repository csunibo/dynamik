<script lang="ts">
	import { base } from '$app/paths';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { Teaching } from '$lib/teachings';
	import { getLoginUrl, getWhoAmI } from '$lib/upld';

	export let data: PageData;

	let activeYears: Teaching[] = [];

	let login:
		| Promise<{ error: string } | { username: string; name: string; avatarUrl: string }>
		| undefined;

	onMount(async () => {
		activeYears = (await data.streaming?.activeCourses) ?? [];

		login = getWhoAmI(fetch);
	});
</script>

<svelte:head>
	<title>Dynamik | {data.course?.name}</title>
</svelte:head>

{#if !data.course}
	<h1>Corso non trovato</h1>
{:else}
	<div class="max-w-5xl p-4 mx-auto">
		<nav class="navbar flex bg-base-200 text-neutral-content rounded-box shadow-sm px-5 mb-5">
			<div class="navbar-start">
				{#if login}
					{#await login then login}
						{#if 'error' in login}
							<a class="btn btn-square btn-ghost" href={getLoginUrl($page.url)}> Login </a>
						{:else}
							<img src={login.avatarUrl} alt="User avatar" class="w-10 rounded-xl" />
						{/if}
					{/await}
				{/if}
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
		</nav>

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
						<li
							class:disabled
							class="flex xs:flex-1 justify-center border-base-content items-center m-2 border-2 rounded-md"
						>
							<a href={disabled ? null : href} class="text-center text-lg">
								{#if teaching.name}
								<div>
									{teaching.name} 
									{#if teaching.telegram}
									<a  href="https://t.me/{teaching.telegram}">👥</a>
									{/if}
								</div>
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
