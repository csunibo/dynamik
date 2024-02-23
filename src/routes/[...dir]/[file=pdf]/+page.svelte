<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import type { PageData } from './$types';
	import type { OnProgressParameters } from 'pdfjs-dist';
	import type { PDFPageProxy } from 'pdfjs-dist/types/src/display/api';

	interface Part {
		start: number;
		end?: number;
		canvas?: HTMLCanvasElement;
	}

	export let data: PageData;
	const scale = 2;

	let loaded = 0.0; // percentage
	let pageCanvas: HTMLCanvasElement, fullCanvas: HTMLCanvasElement;
	let width = 0,
		height = 0;

	let pages: PDFPageProxy[] = [];
	let parts: Part[] = [];

	console.log(data);

	onMount(async () => {
		const pageCtx = pageCanvas.getContext('2d')!;
		const fullCtx = fullCanvas.getContext('2d')!;

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

		for (let i = 1; i <= pdf.numPages; i++) {
			const page = await pdf.getPage(i);
			pages.push(page);

			// rendering onto the temporary canvas
			const viewport = page.getViewport({ scale });
			width = Math.max(fullCanvas.width, viewport.width);
			height += viewport.height;
		}

		fullCanvas.width = width;
		fullCanvas.height = height;
		let currHeight = 0;
		for (const page of pages) {
			const viewport = page.getViewport({ scale });
			pageCanvas.width = viewport.width;
			pageCanvas.height = viewport.height;
			await page.render({
				canvasContext: pageCtx,
				viewport: viewport
			}).promise;

			// copying it over to the full canvas
			fullCtx.drawImage(pageCanvas, 0, currHeight);
			currHeight += viewport.height;

			// cleanup
			pageCtx.clearRect(0, 0, viewport.width, viewport.height);
			pageCanvas.width = 0;
			pageCanvas.height = 0;
		}

		for (const question of doc.questions) {
			const canvas = (question as any).canvas as HTMLCanvasElement;
			canvas.height = (question.end - question.start) * scale;
			canvas.width = width;
			const ctx = canvas.getContext('2d');
			ctx?.drawImage(fullCanvas, 0, -question.start * 2);
		}
	});
</script>

<canvas bind:this={pageCanvas} />
<canvas
	bind:this={fullCanvas}
	style="width: {width / scale}px; height: {height / scale}px; display: none"
/>

{#each data.questions as part, index}
	<canvas
		data-id={index}
		bind:this={doc.questions[index].canvas}
		style="--width: {width / scale}px; --height: {part.end - part.start}px"
	/>
	<div>answer goes here</div>
{/each}

<style>
	canvas {
		width: var(--width);
		height: var(--height);
		padding: 1rem 0;
	}
</style>
