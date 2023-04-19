<script lang="ts">
	import { page } from '$app/stores';
	import settings from '$lib/settings';
	import type { File, Directory } from '$lib/api';
	import { formatDate } from '$lib/date';

	export let data: File | Directory;
	export let customUrl: string | undefined = undefined;

	const isExternal = (data: File | Directory) =>
		'mime' in data ? data.mime === 'text/statik-link' : false;

	let isFile = 'mime' in data;
</script>

<div class="contents">
	<div class="contents">
		{#if isFile}
			<span><code>file</code></span>
			{#if isExternal(data)}
				<a class="link link-hover text-primary" href={data.url} target="_blank" rel="noreferrer">
					{data.name} (link)
				</a>
			{:else}
				<a class="link link-hover text-primary" href="{$page.url}/{data.name}">
					{data.name}
				</a>
			{/if}
		{:else}
			<span><code>dir</code></span>
			<a class="link link-hover text-primary" href={customUrl ?? $page.url + '/' + data.name}>
				{data.name}
			</a>
		{/if}

		<span class="whitespace-nowrap">
			{isFile && data.size ? data.size : '-'}
		</span>
		<span class="hidden md:block">
			{data.time ? formatDate($settings, data.time) : '-'}
		</span>
	</div>
</div>
