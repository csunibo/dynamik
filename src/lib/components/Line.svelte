<script lang="ts">
	import { page } from '$app/stores';
	import settings from '$lib/settings';
	import type { File, Directory } from '$lib/api';
	import { formatDate } from '$lib/date';

	export let data: File | Directory;
	export let customUrl: string | undefined = undefined;

	$: isFile = 'mime' in data;
	$: external = 'mime' in data ? data.mime === 'text/statik-link' : false;
</script>

<div class="contents">
	<div class="contents">
		{#if external}
			<span><code>🔗</code></span>
			<a class="link link-hover text-primary" href={data.url} target="_blank" rel="noreferrer">
				{data.name}
			</a>
		{:else if isFile}
			<span><code>📄</code></span>
			<a class="link link-hover text-primary" href="{$page.url}/{data.name}">
				{data.name}
			</a>
		{:else}
			<span><code>📁</code></span>
			<a class="link link-hover text-primary" href={customUrl ?? $page.url + '/' + data.name}>
				{data.name}
			</a>
		{/if}

		<span class="whitespace-nowrap text-right text-xs self-center">
			{isFile && data.size ? data.size : '-'}
		</span>
		<span class="hidden md:block">
			{data.time ? formatDate($settings, data.time) : '-'}
		</span>
	</div>
</div>
