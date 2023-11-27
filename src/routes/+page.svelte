<script lang="ts">
	import { base } from '$app/paths';
	import type { Degree } from '$lib/teachings';
	import Line from './Line.svelte';

	export let data: {
		degrees: Degree[];
	};
</script>

<svelte:head>
	<title>Risorse CSUnibo</title>
	<!-- OG meta graph -->
	<meta name="title" property="og:title" content="Dashboard" />
	<meta
		name="description"
		property="og:description"
		content="Risorse per gli studenti dei corsi di laurea del dipartimento di informatica (DISI) dell'Università di Bologna"
	/>
</svelte:head>

<div class="flex justify-center">
	<div class="container max-w-5xl">
		<div class="m-10">
			<h1 class="text-4xl font-semibold text-center">Risorse</h1>
			<h3 class="text-2 font-semibold text-center">
				Raccolte di materiali per lo studio da <span class="underline"
					><a href="https://csunibo.students.cs.unibo.it">CSUnibo</a></span
				>
			</h3>
		</div>
		<ul class="menu p-2 text-lg">
			{#each data.degrees as degree}
				<Line name={degree.name} icon={degree.icon} href="{base}/dash/{degree.id}" />
			{/each}

			<Line name="Impostazioni" icon="🔧" href="{base}/settings" />
			<Line name="Stato" icon="📊" href="{base}/build" />
		</ul>
	</div>
</div>
