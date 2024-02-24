<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import type { OnProgressParameters } from 'pdfjs-dist';
	import type { PDFPageProxy } from 'pdfjs-dist/types/src/display/api';

	import { toast } from '@zerodevx/svelte-toast';
	import { Carta, CartaEditor } from 'carta-md';
	import { emoji } from '@cartamd/plugin-emoji';
	import { slash } from '@cartamd/plugin-slash';
	import { code } from '@cartamd/plugin-code';
	import 'carta-md/dark.css';
	import '$lib/styles/github.scss';

	import Answers from '$lib/components/Answers.svelte';

	const carta = new Carta({
		extensions: [emoji(), slash(), code()]
	});

	export let data: PageData;
	const scale = 3;

	console.log(data);

	let loaded = 0.0; // percentage
	let pageCanvas: HTMLCanvasElement, fullCanvas: HTMLCanvasElement;
	let canvases: HTMLCanvasElement[] = [];
	let width = 0,
		height = 0;

	let pages: PDFPageProxy[] = [];
	let values: string[] = [];
	let numPages: number;

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
		numPages = pdf.numPages;

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

		for (let i = 0; i < data.questions.length; i++) {
			const canvas = canvases[i];
			const question = data.questions[i];
			let sHeight: number = (question.end - question.start) * scale;
			canvas.height = sHeight;
			canvas.width = width;
			canvas.style.width = `100%`;
			const ctx = canvas.getContext('2d');
			ctx?.drawImage(fullCanvas, 0, -question.start * scale);
		}
	});

	async function sendComment(qid: number, index: number) {
		let res = await (
			await fetch('http://localhost:3000/answers', {
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ question: qid, content: values[index] }),
				method: 'PUT',
				credentials: 'include'
			})
		).json();

		if (res.id) {
			toast.push('Success!', {
				theme: {
					'--toastColor': 'mintcream',
					'--toastBackground': 'rgba(72,187,120,0.9)',
					'--toastBarBackground': '#2F855A'
				}
			});
		} else {
			toast.push('Error!', {
				theme: {
					'--toastColor': 'mintcream',
					'--toastBackground': 'rgba(244,67,54,0.9)',
					'--toastBarBackground': '#e74c3c'
				}
			});
		}
	}
</script>

<canvas bind:this={pageCanvas} style="display: none" />
<canvas bind:this={fullCanvas} style="display: none" />

{#each data.questions as question, index}
	<div class="w-full p-5 justify-center">
		<canvas data-id={index} bind:this={canvases[index]} />
		<Answers question={question.id} />
		<div class="flex justify-center flex-1">
			<div class="flex w-4/6 flex-col gap-1">
				<div class="flex flex-1 w-full">
					<CartaEditor bind:value={values[index]} mode="tabs" theme="github" {carta} />
				</div>
				<button
					class="btn btn-active hover:btn-secondary"
					type="submit"
					on:click|preventDefault={() => sendComment(question.id, index)}
				>
					Comment!
				</button>
			</div>
		</div>
	</div>
{/each}

<style>
	canvas {
		width: var(--width);
		height: var(--height);
		padding: 1rem 0;
	}
</style>
