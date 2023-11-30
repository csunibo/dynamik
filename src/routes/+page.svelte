<script lang="ts">
	import { persisted } from 'svelte-local-storage-store';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import type { Degree } from '$lib/teachings';
	import Line from './Line.svelte';

	export let data: {
		degrees: Degree[];
	};

	let showFeature = false;
	const bannerStore = persisted<{ show: boolean }>('banner', { show: true });
	onMount(() => {
		showFeature = $bannerStore.show;
	});

	const setShowFeature = (value: boolean) => {
		$bannerStore.show = value;
		showFeature = value;
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

{#if showFeature}
	<div class="bg-blue-500 text-white p-4">
		<div class="flex items-center justify-between">
			<div><!-- justifier --></div>
			<p class="font-semibold">
				Dai un occhiata <a
					class="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
					href="{base}/settings">qui</a
				> 🔥 Ora puoi selezionare il tuo corso preferito! Ogni volta che accedi verrai subito portato
				al tuo corso 🔥
			</p>
			<button
				class="text-white hover:text-gray-300 focus:outline-none"
				on:click={() => setShowFeature(false)}
			>
				&#10005; <!-- Close icon (X) -->
			</button>
		</div>
	</div>
{/if}

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
				{#if degree.years}
					<Line name={degree.name} icon={degree.icon} href="{base}/dash/{degree.id}" />
				{:else}
					<Line name={degree.name} icon={degree.icon} href="{base}/{degree.id}" />
				{/if}
			{/each}

			<Line name="Impostazioni" icon="🔧" href="{base}/settings" />
			<Line name="Stato" icon="📊" href="{base}/build" />
		</ul>
	</div>
</div>
