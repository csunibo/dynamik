<script lang="ts">
	import { page } from '$app/stores';
	import settings from '$lib/settings';
	import type { File, Directory } from '$lib/api';
	import { formatDate } from '$lib/date';

	export let data: File | Directory;
	export let customUrl: string | undefined = undefined;
	$: base = $page.url.pathname.split('?')[0];

	$: isFile = 'mime' in data;
	$: external = 'mime' in data ? data.mime === 'text/statik-link' : false;

	let isSpinning = false;
	async function downloadFile() {
		isSpinning = true;
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
		isSpinning = false;
		URL.revokeObjectURL(urlObject);
	}
	let isDone = false;

	$: isDone = getDoneStatus(data.url);

	function getDoneStatus(fileName: string) {
		return localStorage.getItem(fileName) === 'done';
	}

	function toggleDone() {
		isDone = !isDone;
		localStorage.setItem(data.url, isDone ? 'done' : 'not done');
	}
</script>

<div class="contents">
	<div class="contents">
		<span class="flex items-center flex-[1_0_auto] w-max">
			{#if external}
				<span class="flex text-xl icon-[akar-icons--link-chain] mr-2" style="color: #AFD2E9"></span>
				<a
					class="flex link link-hover text-primary sm:flex-wrap"
					href={data.url}
					target="_blank"
					rel="noreferrer"
				>
					{data.name}
				</a>
			{:else if isFile}
				<button class="flex text-xl mr-2 align-center" on:click={toggleDone} type="button">
					<span
						class="text-bold icon-[solar--file-bold-duotone]"
						style={isDone ? '' : 'color: #AFD2E9'}
						class:icon-[solar--file-check-bold-duotone]={isDone}
						class:text-success={isDone}
					></span>
				</button>
				<a
					class="flex link link-hover sm:flex-wrap text-primary"
					class:line-through={isDone}
					href="{base}/{data.name}?{$page.url.searchParams}"
					target={$settings.newTab ? '_blank' : '_self'}
				>
					{data.name}
				</a>
			{:else}
				<span class="flex icon-[solar--folder-bold] text-xl mr-2" style="color: #FDE74C"></span>
				<a
					class="flex link link-hover sm:flex-wrap text-primary"
					href={customUrl ?? base + '/' + data.name + '?' + $page.url.searchParams}
				>
					{data.name}
				</a>
			{/if}
		</span>
		<div class="flex flex-0"></div>
		<span class="flex items-center justify-end whitespace-nowrap text-xs">
			{#if isFile}
				{isFile && data.size != '0 B' ? data.size : '-'}
				{#if data.size != '0 B'}
					<button class="flex text-lg ml-3" on:click={downloadFile}>
						<span
							class="text-accent text-3xl {isSpinning
								? 'icon-[eos-icons--loading]'
								: 'icon-[solar--download-square-bold]'}"
						></span>
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
