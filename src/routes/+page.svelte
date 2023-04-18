<script lang="ts">
	import { base } from '$app/paths';
	import type { Course } from '$lib/teachings';

	export let data: {
		courses: Course[];
	};
</script>

<div class="flex justify-center">
	<div class="container max-w-5xl">
		<h1 class="text-4xl m-10 font-semibold text-center">Benvenuto su Dynamik! 👋</h1>

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
