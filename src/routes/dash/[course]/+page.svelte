<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { Course, Teaching } from '$lib/teachings';
	import { getLoginUrl, getWhoAmI } from '$lib/upld';
	import ListTeaching from './ListTeaching.svelte';

	export let data: PageData;
	let activeYears: Teaching[] = [];

	let login:
		| Promise<{ error: string } | { username: string; name: string; avatarUrl: string }>
		| undefined;

	onMount(async () => {
		activeYears = (await data.streaming?.activeCourses) ?? [];
		login = getWhoAmI(fetch);
	});

	function filterCoursesOptional(course: Course) {
		const mandatory = [];
		const optional = [];

		for (const year of course.years) {
			const optionalTeachings = year.teachings.filter((teaching: Teaching) => teaching.optional);
			const mandatoryTeachings = year.teachings.filter((teaching: Teaching) => !teaching.optional);

			mandatory.push({ year: year.year, teachings: mandatoryTeachings });
			optional.push({ year: year.year, teachings: optionalTeachings });
		}

		return { mandatory, optional };
	}

	$: filteredCourses = filterCoursesOptional(data.course);
</script>

<svelte:head>
	<title>{data.course?.name}</title>
	<!-- OG meta graph -->
	<meta property="og:title" content={data.course?.name} />
	<meta
		name="url"
		property="og:url"
		content="https://risorse.students.cs.unibo.it/{data.course?.name}"
	/>
	<meta name="description" property="og:description" content="Risorse di {data.course?.name}" />
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
					{data.course.name}
				</h1>
			</div>
			<div class="navbar-end flex items-center">
				<a class="btn btn-square btn-ghost" title="Indietro" href="/">
					<span class="text-primary icon-[akar-icons--arrow-back-thick-fill]"></span>
				</a>
			</div>
		</nav>
		<ListTeaching years={filteredCourses.mandatory} {activeYears} title={''} />
		<ListTeaching years={filteredCourses.optional} {activeYears} title={'facoltativi'} />
	</div>
{/if}
