<script lang="ts">
	import TEACHINGS from '../../config/courses.json' assert { type: 'json' };

	const WORKFLOW_NAMES = ['filenames', 'build-and-deploy'];

	const PROJECTS = [
		{
			title: 'Bot',
			projects: [{ name: 'Informabot', url: 'informabot', workflows: ['codeql'] }]
		},
		{
			title: 'Web scrapers',
			projects: [{ name: 'Raccoglitesi', url: 'raccoglitesi', workflows: ['pages'] }]
		},
		{
			title: 'Modelli di tesi',
			projects: [
				{ name: 'Asciidoc', url: 'asciidoc-thesis', workflows: ['asciidoc'] },
				{ name: 'LaTeX', url: 'latex-thesis', workflows: ['tex'] }
			]
		},
		{
			title: 'Altro',
			projects: [
				{ name: 'csurename', url: 'csurename', workflows: ['rust'] },
				{ name: 'Diario tirocinio', url: 'diario-tirocinio', workflows: ['pages'] },
				{ name: 'Laboratori', url: 'lab', workflows: ['check', 'build-and-deploy'] }
			]
		}
	];

	const WORKFLOW_URL = (project: string, workflow: string) =>
		`https://github.com/csunibo/${project}/actions/workflows/${workflow}.yml`;
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
								{@const href = WORKFLOW_URL(teaching.url, workflow)}
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

	<hr class="my-12 border-primary" />
	<h2 class="text-center text-2xl">Progetti</h2>

	{#each PROJECTS as category}
		<h3 class="text-center text-xl font-bold my-4">{category.title}</h3>
		<div class="grid grid-cols-4 gap-4">
			{#each category.projects as proj}
				<div>
					<h4 class="font-bold">{proj.name}</h4>
					<div class="flex gap-2">
						{#each proj.workflows as workflow}
							{@const href = WORKFLOW_URL(proj.url, workflow)}
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
</div>
