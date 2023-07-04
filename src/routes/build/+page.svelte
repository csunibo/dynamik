<script lang="ts">
	import TEACHINGS from '$lib/teachings';

	const WORKFLOW_NAMES = ['check.yml', 'build-and-deploy.yml'];
</script>

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
					<div>
						<h4 class="font-bold">{teaching.name}</h4>
						<div class="flex gap-2">
							{#each WORKFLOW_NAMES as workflow}
								{@const href = `https://github.com/csunibo/${teaching.url}/actions/workflows/${workflow}`}
								{@const src = `${href}/badge.svg`}
								<a {href}>
									<img {src} alt="Not found" />
								</a>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		{/each}
	{/each}
</div>
