<script lang="ts">
	import { page } from '$app/stores';

	import Line from '$lib/components/Line.svelte';
	import { teachingsFilter, type Degree } from '$lib/teachings';
	import { EDIT_URLS } from '$lib/const';
	import { doneFiles, anyFileDone } from '$lib/todo-file';
  import { auth, logout, AUTHENTICATED } from '$lib/stores/auth';
  import { LOGIN_URL } from '$lib/auth';

	import type { PageData } from './$types';
	import FuzzySearch from './FuzzySearch.svelte';
	export let data: PageData;
	export let fuzzy: FuzzySearch;
	export let urlParts: string[];
	export let title: string;

	// -- breadcrumbs --
	let breadcrumbMobile = true;
	function mobileBreadcrumb() {
		breadcrumbMobile = !breadcrumbMobile;
	}

	let editUrls = EDIT_URLS($page.url.pathname);

	// Checks if a teaching is part of a certain degree
	function isInDegree(teachingName: string, degree: Degree, elective: boolean): boolean {
		if (degree.teachings != null) return false;
		return teachingsFilter(degree, undefined, !elective).includes(teachingName);
	}

	// Skims through degrees looking for a given teaching
	function skimDegrees(teachingName: string, electives: boolean): string | undefined {
		const degree = data.degrees.find((d) => isInDegree(teachingName, d, electives));
		return degree != null ? degree.id : undefined;
	}

	// Picks a containing degree for this teaching
	function guessDegree(teachingName: string): string | null {
		// Plan A: "from" url parameter
		if (data.from) return data.from;
		// Plan B: "degree" field in Teachings
		const teaching = data.teachings.get(teachingName);
		if (teaching?.degree) return teaching.degree;
		// Plan C: any degree featuring this teaching as mandatory
		const mandatoryDegree = skimDegrees(teachingName, false);
		if (mandatoryDegree != null) return mandatoryDegree;
		// Plan D: any degree featuring this teaching as an elective
		const electiveDegree = skimDegrees(teachingName, true);
		if (electiveDegree != null) return electiveDegree;
		// Plan E: give up
		return null;
	}

	$: degree = guessDegree(urlParts[0]);

	const getPartHref = (part: string) =>
		$page.url.pathname
			.split('/')
			.slice(0, $page.url.pathname.split('/').indexOf(part) + 1)
			.join('/');
</script>

<div class="navbar flex bg-base-200 rounded-box shadow-sm px-5 mb-5">
	<div class="sm:hidden flex justify-start items-center">
		<button class="sm:hidden flex btn btn-ghost btn-sm" on:click={mobileBreadcrumb}>
			<span
				class="sm:hidden flex text-2xl items-center text-accent icon-[solar--folder-path-connect-bold-duotone]"
			>
			</span>
			<p class="text-accent" class:hidden={!breadcrumbMobile}>{title}</p>
		</button>
	</div>
	<div class="flex items-center">
		<a class="btn btn-square btn-ghost" title="Indietro" href="/">
			<span class="text-primary icon-[akar-icons--arrow-back-thick-fill]"></span>
		</a>
	</div>
	<div class="navbar min-h-0 p-0 justify-start items-center">
		<div
			class="breadcrumbs sm:flex lg:text-lg sm:items-start text-sm sm:flex-wrap font-semibold"
			class:hidden={breadcrumbMobile}
		>
			<ul>
				<li>
					<a class="ml-1 flex items-center" href="/">
						<span class="text-xl icon-[akar-icons--home-alt1]"></span>
					</a>
				</li>
				{#if degree != null}
					<li>
						<a class="flex items-center" href={'/dash/' + degree}>
							<span class="text-xl icon-[ic--round-school]"></span>
						</a>
					</li>
				{/if}
				{#each urlParts || [] as part}
					{@const href = getPartHref(part) + '?' + $page.url.searchParams}
					<li><a {href} class="flex flex-wrap whitespace-normal">{part}</a></li>
				{/each}
			</ul>
		</div>
	</div>
  <div class="navbar-end">
    <div class="flex flex-1 justify-end">
      {#if $auth.state == AUTHENTICATED}
        <button class="btn" on:click|preventDefault={() => logout()}>
          Logout
          <div class="avatar">
            <div class="w-8 rounded-full">
              <img src={$auth.user.avatarUrl} />
            </div>
          </div>
        </button>
      {:else}
        <a 
        class="sm:ml-2 p-1 flex flex-shrink-0"
          href={LOGIN_URL($page.url)}>Login</a>
      {/if}
      <a
        class="sm:ml-2 p-1 flex items-center rounded-lg btn-ghost flex-shrink-0 w-8"
        href={editUrls.github_repo}
        >
        <span class="text-2xl icon-[akar-icons--github-fill]"></span>
      </a>
		</div>
	</div>
	{#if !!fuzzy}
		<div class="flex flex-1 justify-end mr-2">
			<button
				title="Search"
				class="lg:ml-2 md:min-w-max p-2 bg-base-300 rounded-xl btn-ghost"
				on:click|preventDefault={() => fuzzy.show()}
			>
				<span class="text-primary icon-[akar-icons--search] align-middle"></span>
				<span class="hidden md:inline">
					<kbd class="kbd-sm">Ctrl</kbd>+
					<kbd class="kbd-sm">K</kbd>
				</span>
			</button>
		</div>
	{/if}
</div>

{#if !!fuzzy}
	<FuzzySearch data={data.fuzzy} bind:this={fuzzy} />
{/if}
