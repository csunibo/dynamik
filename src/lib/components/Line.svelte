<script lang="ts">
	import dayjs from 'dayjs';
	import { page } from '$app/stores';
	import type { File, Directory } from '$lib/api';

	export let data: File | Directory;
	export let customUrl: string | undefined = undefined;

	const isExternal = (data: File | Directory) => {
		if ('mime' in data) {
			return data.mime === 'text/statik-link';
		} else {
			return false;
		}
	};

	const formatDate = (date: string) => {
		const dayjsDate = dayjs(date);
		return dayjsDate.format('YYYY-MM-DD') + '\u00a0' + dayjsDate.format('HH:mm');
	};

	let isFile = 'mime' in data;
</script>

<div class="contents">
	<div class="contents">
		{#if isFile}
			<span>file</span>
			{#if isExternal(data)}
				<a class="link text-primary" href={data.url} target="_blank" rel="noreferrer">
					{data.name} (link)
				</a>
			{:else}
				<a class="link text-primary" href="{$page.url}/{data.name}">
					{data.name}
				</a>
			{/if}
		{:else}
			<span>dir</span>
			<a class="link text-primary" href={customUrl ?? $page.url + '/' + data.name}>{data.name}</a>
		{/if}

		<span class="whitespace-nowrap">
			{isFile && data.size ? data.size : '-'}
		</span>
		<span class="hidden md:block">
			{data.time ? formatDate(data.time) : '-'}
		</span>
	</div>
</div>
