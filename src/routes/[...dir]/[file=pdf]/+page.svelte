<script lang="ts">
	import { onMount } from 'svelte';
	import { onDestroy } from 'svelte';
	import type { PageData } from './$types';
	import type { OnProgressParameters } from 'pdfjs-dist';
	import type { PDFPageProxy } from 'pdfjs-dist/types/src/display/api';

	// import 'carta-md/dark.css';
	import '$lib/styles/github.scss';

	import PdfCutter from '$lib/components/polleg/PdfCutter.svelte';
	import Instructions from '$lib/components/polleg/Instructions.svelte';
	import PdfViewer from '$lib/components/polleg/PdfViewer.svelte';
	import QuestionViewer from '$lib/components/polleg/QuestionViewer.svelte';
	import { page } from '$app/stores';
	import { base } from '$app/paths';

	import Navbar from '$lib/components/Navbar.svelte';
	import { WHOAMI_URL } from '$lib/auth';
	import { logout } from '$lib/stores/auth';

	export let data: PageData;
	const scale = 3;

	let user: { avatarUrl: any; admin: any } | undefined = undefined;
	let edit: boolean = false;

	let loaded = 0.0; // percentage
	let pageCanvas: HTMLCanvasElement, fullCanvas: HTMLCanvasElement;
	let canvases: HTMLCanvasElement[] = [];
	let width = 0,
		height = 0;

	let pages: PDFPageProxy[] = [];
	let numPages: number;

	let parentPath = '/';

	onDestroy(() => {
		pageUnsubscribe();
	});

	const pageUnsubscribe = page.subscribe((page) => {
		const path = page.params.dir.split('/');
		path.push(page.params.file);
		path.pop();
		parentPath = base + '/' + path.join('/');
	});

	async function init() {
		await fetchUser();

		if (data.questions) {
			if (data.questions.length === 0) return;
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
				width = Math.max(fullCanvas?.width, viewport.width);
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
		}
	}

	onMount(init);

	async function fetchUser() {
		let res = await fetch(WHOAMI_URL, {
			method: 'GET',
			credentials: 'include'
		});

		if (res.status == 200) {
			user = await res.json();
		}
	}

	async function removePdfCutter(dataRet: PageData) {
		edit = false;
		data.questions = dataRet.questions;
		if (data.questions == null) {
			data.questions = [];
		}
		await init();
	}

	function setEditMode(flag: boolean) {
		edit = flag;
	}
</script>

<main class="max-w-6xl min-w-fit p-4 mx-auto">
	<Navbar title={$page.params.file} />

	{#if data.isExam}
		{#if edit}
			<PdfCutter id={data.id} url={data.url} show={removePdfCutter} />
		{:else}
			<!-- If the questions aren't present show instructions and pdf -->
			{#if data.questions?.length !== 0}
				<QuestionViewer {canvases} />
			{:else}
				<Instructions isAdmin={user?.admin} {setEditMode} />
				<PdfViewer url={data.url} width={'90%'} height={'900vh'} />
			{/if}

			<canvas bind:this={pageCanvas} style="display: none" />
			<canvas bind:this={fullCanvas} style="display: none" />
		{/if}
	{:else}
		<PdfViewer url={data.url} width={'90%'} height={'900vh'} />
	{/if}
</main>

<style>
	canvas {
		width: var(--width);
		height: var(--height);
		border-radius: 0.5rem;
	}
</style>
