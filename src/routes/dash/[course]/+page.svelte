<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

{#if !data.course}
	<h1>Corso non trovato</h1>
{:else}
	<h1>Dashboard di {data.course.name}</h1>

	{#each data.course.years as year}
		<h2>{year.year}</h2>
		<ul>
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
		</ul>
	{/each}
{/if}
