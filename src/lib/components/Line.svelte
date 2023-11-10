<script lang="ts">
	import { page } from '$app/stores';
	import settings from '$lib/settings';
	import type { File, Directory } from '$lib/api';
	import { formatDate } from '$lib/date';

	export let data: File | Directory;
	export let customUrl: string | undefined = undefined;
	// let base = $page.url.pathname.split('?')[0];

	$: isFile = 'mime' in data;
	$: external = 'mime' in data ? data.mime === 'text/statik-link' : false;

	async function downloadFile() {
		const url = data.url;
		const response = await fetch(url);
		const blob = await response.blob();
		const urlObject = window.URL.createObjectURL(new Blob([blob]));
		const a = document.createElement('a');
		a.href = urlObject;
		a.download = data.name;
		document.body.appendChild(a);
		a.click();
		a.remove();
	}
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
			<a
				class="link link-hover text-primary"
				href="{$page.url.pathname}/{data.name}?{$page.url.searchParams}"
				target={$settings.newTab ? '_blank' : '_self'}
			>
				{data.name}
			</a>
		{:else}
			<span><code>📁</code></span>
			<a
				class="link link-hover text-primary"
				href={customUrl ?? $page.url.pathname + '/' + data.name + '?' + $page.url.searchParams}
			>
				{data.name}
			</a>
		{/if}
		<span class="flex items-center justify-end whitespace-nowrap text-xs">
			{#if isFile}
				{isFile && data.size != '0 B' ? data.size : '-'}
				{#if data.size != '0 B'}
					<button class="flex text-lg ml-3" on:click={downloadFile}>
						<span class="text-accent text-3xl icon-[solar--download-square-bold]"></span>
					</button>
				{:else}
					<button disabled class="flex text-lg ml-3" on:click={downloadFile}>
						<span class="text-neutral text-3xl icon-[solar--download-square-bold]"></span>
					</button>
				{/if}
			{/if}
		</span>
		<span class="hidden md:block">
			{data.time ? formatDate($settings, data.time) : '-'}
		</span>
	</div>
</div>
