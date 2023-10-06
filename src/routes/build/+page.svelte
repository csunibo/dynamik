<script lang="ts">
	import type { PageData } from './$types';
	import type { Course, Teaching } from '$lib/teachings';
	import TEACHINGS from '$lib/teachings';

	const WORKFLOW_NAMES = ['filenames', 'build-and-deploy'];
	const WORKFLOW_URL = (project: string, workflow: string) =>
		`https://github.com/csunibo/${project}/actions/workflows/${workflow}.yml`;

	export let data: PageData;
	let activeYears: Teaching[] = [];

	onMount(async () => {
		activeYears = (await data.streaming?.activeCourses) ?? [];
	});
</script>
<main class="md:container md:m-auto p-4">
  <nav class="navbar flex bg-base-200 text-neutral-content rounded-box shadow-sm px-5 mb-5">
    <div class="navbar-start">
      <h1 class="text-xl font-semibold text-base-content">
        Stato delle raccolte
      </h1>
    </div>
    <div class="navbar-end">
      <a class="btn btn-square btn-ghost" title="Indietro" href="/"> ⬆️ </a>
    </div>
  </nav>
  <div class="m-8">
    {#each TEACHINGS as course, i}
      {#if i > 0}
        <hr class="my-8 border-primary" />
      {/if}
      <h2 class="text-center text-2xl">{course.name}</h2>
      {#each course.years as years}
        <h3 class="text-center text-xl font-bold my-4">{years.year}</h3>
        <div class="grid grid-cols-4 gap-4">
          {#each years.teachings as teaching}
					  {@const enabled = activeYears.includes(teaching)}
            <div>
              <h4 class="font-bold">{teaching.name}</h4>
              {#if enabled}
                <div class="flex gap-2">
                  {#each WORKFLOW_NAMES as workflow}
                    {@const href = WORKFLOW_URL(teaching.url, workflow)}
                    {@const src = `${href}/badge.svg`}
                    <a {href}>
                      <img {src} alt="Not found" />
                    </a>
                  {/each}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      {/each}
    {/each}
  </div>
</main>
