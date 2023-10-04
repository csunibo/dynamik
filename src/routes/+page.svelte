<script lang="ts">
	import { base } from '$app/paths';
	import type { Course } from '$lib/teachings';

	export let data: {
		courses: Course[];
	};
</script>

<svelte:head>
	<title>CSUnibo | Homepage</title>
		<!-- OG meta graph -->
	<meta name="title" property="og:title" content="Risorse CSUnibo" />
	<meta name="type" property="og:type" content="website" />
	<meta name="description" property="og:description" content="Risorse per gli studenti dei corsi di laurea del dipartimento di informatica (DISI) dell'Università di Bologna"/>
</svelte:head>

<div class="flex justify-center">
	<div class="container max-w-5xl">
		<h1 class="text-4xl m-10 font-semibold text-center">Benvenuto su CSUnibo!</h1>

		<ul class="menu p-2 text-lg">
			{#each data.courses as course}
				<li>
					<a class="py-10 justify-center" href="{base}/dash/{course.id}">
						{course.icon}
						{course.name}
						{course.icon}
					</a>
				</li>
			{/each}

			<li><a class="py-10 justify-center" href="{base}/settings">🔧 Settings 🔧</a></li>
		</ul>
	</div>
</div>
