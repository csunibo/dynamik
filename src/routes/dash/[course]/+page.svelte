<script lang="ts">
	import { base } from '$app/paths';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { Teaching } from '$lib/teachings';
	import { getLoginUrl, getWhoAmI } from '$lib/upld';
	import ListTeaching from "../../ListTeaching.svelte";
	
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

		<ListTeaching data={data} activeYears={activeYears} base={base} optionalCourseView={false}/>
		<ListTeaching data={data} activeYears={activeYears} base={base} optionalCourseView={true}/>
	</div>
{/if}
