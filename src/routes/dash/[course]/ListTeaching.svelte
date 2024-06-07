<script lang="ts" context="module">
	export type TeachingsBatch = {
		year: number;
		teachings: Teaching[];
	};
</script>

<script lang="ts">
	import type { Teaching } from '$lib/teachings';
	import { base } from '$app/paths';

	export let years: TeachingsBatch[];
	export let activeYears: Teaching[];
	export let title: string;
	export let from: string | undefined = undefined;

	function getUrl(teaching: Teaching) {
		let url = base + '/' + teaching.url;
		if (from != null) url += '?from=' + from;
		return url;
	}
</script>

<ul class="menu p-2">
	{#each years as year}
		{#if year.teachings.length > 0}
			{@const type = year.year != 0 ? year.year.toString() + ' anno' : 'Generali'}
			<li class="menu-title">
				<span class="text-2xl mt-5 italic">{type} {title}</span>
			</li>
			<div class="divider mt-0"></div>
			<div class="flex flex-row flex-wrap">
				{#each year.teachings as teaching}
					{#if teaching}
						{@const disabled = !activeYears.includes(teaching)}
						<li
							class:disabled
							class="flex flex-row xs:flex-1 justify-center border-base-content items-center m-2 border-2 rounded-md join"
						>
							<a
								href={disabled ? null : getUrl(teaching)}
								class="flex-wrap max-w-xs text-center text-lg join-item"
							>
								{teaching.name ? teaching.name : teaching.url}
							</a>
							{#if teaching.chat != null && teaching.chat !== ''}
								<a
									href={disabled ? null : 'https://' + teaching.chat}
									class="text-center join-item border-l-2"
									title="Link alla community"
								>
									<span class="text-2xl icon-[akar-icons--people-group]"></span>
								</a>
							{/if}
						</li>
					{/if}
				{/each}
			</div>
		{/if}
	{/each}
</ul>
