<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import type { OnProgressParameters } from 'pdfjs-dist';

	interface Part {
		start: number;
		end?: number;
	}

	export let data: PageData;
	let canvas;
	let loaded = 0.0; // percentage
	let width = 0;
	let parts: Part[] = [];
	let pageCoords: number[] = [];

	console.log(data);
	const doc = {
		id: data.id,
		questions: [
			{
				id: 1,
				start: 200,
				end: 200
			},
			{
				id: 1,
				start: 400,
				end: 500
			}
		]
	};
	console.log(parts);

	onMount(async () => {
		const { GlobalWorkerOptions, getDocument } = await import('pdfjs-dist');
		GlobalWorkerOptions.workerSrc = new URL(
			'pdfjs-dist/build/pdf.worker.min.mjs',
			import.meta.url
		).toString();

		const loadingPdf = getDocument(data.url);
		loadingPdf.onProgress = (params: OnProgressParameters) => {
			loaded = params.loaded / params.total;
		};
		const pdf = await loadingPdf.promise;

		let maxHeight = 0;
		for (let i = 1; i <= pdf.numPages; i++) {
			const page = await pdf.getPage(i);
			const viewport = page.getViewport({ scale: 1 });
			maxHeight += viewport.height;
			width = viewport.width;
			console.log(maxHeight);
		}
		parts = doc.questions.reduce<Part[]>((parts, question) => {
			if (parts.length == 0) {
				parts = [{ start: 0 }];
			}
			parts[parts.length - 1].end = question.start;
			return [...parts, { start: question.end }];
		}, []);
		parts[parts.length - 1].end = maxHeight;
		console.log(parts);
	});
</script>

{#each parts as part, index}
	<canvas
		data-id={index}
		bind:this={canvas}
		style="--width: {width}px; --height: {part.end - part.start}px"
	/>
	{#if index != parts.length - 1}
		<div>answer goes here</div>
	{/if}
{/each}

<style>
	canvas {
		width: var(--width);
		height: var(--height);
		padding: 1rem 0;
	}
</style>
