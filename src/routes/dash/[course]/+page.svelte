<script lang="ts">
	import { base } from '$app/paths';
	import type { PageData } from './$types';
	import { page } from '$app/stores';

	export let data: PageData;
</script>

{#if !data.course}
	<h1>Corso non trovato</h1>
{:else}
	<div class="flex justify-center mt-5">
		<div class="container max-w-5xl">
			<div class="navbar bg-neutral text-neutral-content rounded-box shadow-sm">
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
						{@const href = base + '/' + teaching.url}
						<li>
							<a {href}>
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
	</div>
{/if}
