<script lang="ts">
	import { base } from '$app/paths';
	import type { Course } from '$lib/teachings';
	import Line from './Line.svelte';

	export let data: {
		courses: Course[];
	};
</script>

<svelte:head>
	<title>Dynamik | Homepage</title>
</svelte:head>

<div class="flex justify-center">
	<div class="container max-w-5xl">
		<h1 class="text-4xl m-10 font-semibold text-center">Benvenuto su Dynamik! 👋</h1>

		<ul class="menu p-2 text-lg">
			{#each data.courses as course}
				<Line name={course.name} icon={course.icon} href="{base}/dash/{course.id}" />
			{/each}

			<Line name="Settings" icon="🔧" href="{base}/settings" />
		</ul>
	</div>
</div>
