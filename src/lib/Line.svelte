<script lang="ts">
	import type { File, Directory } from '$lib/api';

	const isExternal = (data: File | Directory) => (data as File).mime === 'text/statik-link';

	export let data: File | Directory;
	export let base: URL;
	let isFile: boolean = false;
	if ((data as File).mime) {
		isFile = true;
	}
</script>

<div class="contents">
	<div class="contents">
		{#if isFile}
			<span>dir</span>
			{#if isExternal(data)}
				<a class="link" href={data.url} target="_blank" rel="noreferrer">
					{data.name} (link)
				</a>
			{:else}
				<a class="link" href="{base}/{data.name}">
					{data.name}
				</a>
			{/if}
		{:else}
			<span>file</span>
			<a class="link" href={base + '/' + data.name}>{data.name}</a>
		{/if}
		<span class="whitespace-nowrap">{data.size}</span>
		<span class="hidden md:block">{data.time}</span>
	</div>
</div>
