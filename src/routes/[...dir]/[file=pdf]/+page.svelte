<script lang="ts">
	import { onMount } from 'svelte';
	import { onDestroy } from 'svelte';
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
	import PdfCutter from '$lib/components/PdfCutter.svelte';
	import { page } from '$app/stores';
	import { base } from '$app/paths';

	const carta = new Carta({
		extensions: [emoji(), slash(), code()]
	});

	export let data: PageData;
	const scale = 3;

	// console.log(data);

	let user = undefined;
	let edit: boolean = false;

	let answers: Answers[] = [];

	let loaded = 0.0; // percentage
	let pageCanvas: HTMLCanvasElement, fullCanvas: HTMLCanvasElement;
	let canvases: HTMLCanvasElement[] = [];
	let width = 0,
		height = 0;

	let pages: PDFPageProxy[] = [];
	let values: string[] = [];
	let numPages: number;

	let parentPath = '/';

	const getPartHref = (part: string) =>
		$page.url.pathname
			.split('/')
			.slice(0, $page.url.pathname.split('/').indexOf(part) + 1)
			.join('/');

	onDestroy(() => {
		pageUnsubscribe();
	});

	const pageUnsubscribe = page.subscribe((page) => {
		const path = page.params.dir.split('/');
		path.push(page.params.file);
		path.pop();
		parentPath = base + '/' + path.join('/');
	});

	$: urlParts = $page.url.pathname.split('/').slice(1);

	async function init() {
		await fetchUser();
		if (data?.questions.length === 0) return;
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

	onMount(init);

	async function fetchUser() {
		let res = await await fetch('http://localhost:3000/whoami', {
			method: 'GET',
			credentials: 'include'
		});

		if (res.status == 200) {
			user = await res.json();
		}
	}

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
			answers[index].addComment(res);
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

	async function removePdfCutter(dataRet: PageData) {
		edit = false;
		data.questions = dataRet.questions;
		if (data.questions == null) {
			data.questions = [];
		}
		await init();
	}
</script>

<div class="max-w-6xl p-4 mx-auto">
	<div class="navbar flex bg-base-200 text-neutral-content rounded-box shadow-sm px-5 mb-5">
		<div class="flex justify-between w-full">
			<div class="lg:text-lg breadcrumbs text-sm">
				<ul>
					<li>🏠<a class="ml-1" href="/">Dynamik</a></li>
					{#each urlParts as part}
						{@const href = getPartHref(part)}
						<li><a {href}>{part}</a></li>
					{/each}
				</ul>
			</div>
			<div>
				{#if user === undefined}
					<button
						class="btn btn-ghost"
						on:click|preventDefault={() =>
							(window.location.href =
								'http://localhost:3000/login?redirect_uri=http://localhost:5173' +
								data.url.slice(25))}
					>
						Login with <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0,0,256,256">
							<g fill-opacity="0" fill="#dddddd" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,256v-256h256v256z" id="bgRectangle"></path></g><g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(8.53333,8.53333)"><path d="M15,3c-6.627,0 -12,5.373 -12,12c0,5.623 3.872,10.328 9.092,11.63c-0.056,-0.162 -0.092,-0.35 -0.092,-0.583v-2.051c-0.487,0 -1.303,0 -1.508,0c-0.821,0 -1.551,-0.353 -1.905,-1.009c-0.393,-0.729 -0.461,-1.844 -1.435,-2.526c-0.289,-0.227 -0.069,-0.486 0.264,-0.451c0.615,0.174 1.125,0.596 1.605,1.222c0.478,0.627 0.703,0.769 1.596,0.769c0.433,0 1.081,-0.025 1.691,-0.121c0.328,-0.833 0.895,-1.6 1.588,-1.962c-3.996,-0.411 -5.903,-2.399 -5.903,-5.098c0,-1.162 0.495,-2.286 1.336,-3.233c-0.276,-0.94 -0.623,-2.857 0.106,-3.587c1.798,0 2.885,1.166 3.146,1.481c0.896,-0.307 1.88,-0.481 2.914,-0.481c1.036,0 2.024,0.174 2.922,0.483c0.258,-0.313 1.346,-1.483 3.148,-1.483c0.732,0.731 0.381,2.656 0.102,3.594c0.836,0.945 1.328,2.066 1.328,3.226c0,2.697 -1.904,4.684 -5.894,5.097c1.098,0.573 1.899,2.183 1.899,3.396v2.734c0,0.104 -0.023,0.179 -0.035,0.268c4.676,-1.639 8.035,-6.079 8.035,-11.315c0,-6.627 -5.373,-12 -12,-12z"></path></g></g>
							</svg>
					</button>
				{:else}
					<details class="dropdown">
						<summary class="btn btn-circle p-2"
							><img src={user.avatarUrl} class="w-12 rounded-full" /></summary
						>
						<ul class="p-2 shadow menu dropdown-content z-[1] bg-base-300 rounded-box">
							<li>
								<a
									on:click|preventDefault={() => {
										window.location.href =
											'http://localhost:3000/logout?redirect_uri=http://localhost:5173' +
											data.url.slice(25);
										user = undefined;
									}}>Logout</a
								>
							</li>
						</ul>
					</details>
				{/if}
			</div>
		</div>
	</div>
</div>

{#if data.isTest}
	{#if edit}
		<PdfCutter id={data.id} url={data.url} show={removePdfCutter} />
	{:else}
		{#if data?.questions.length === 0}
			<div class="flex justify-center mb-2">
				<div class="text-center">
					<h1 class="text-5xl my-12">:(</h1>
					<p class="text-xl my-8">Documento non pronto per scrivere le risposte</p>

					{#if user?.admin}
						<button class="btn btn-ghost" on:click|preventDefault={() => (edit = true)}>
							Preparalo
						</button>
					{/if}
					<button class="btn btn-ghost" on:click|preventDefault={() => history.back()}>
						Torna indietro
					</button>
				</div>
			</div>
			<div class="flex justify-center mb-5">
				<object data={data.url} type="application/pdf" width="90%" height="900vh">
					<iframe src={data.url} width="90%" height="900vh">
						<p>This browser does not support PDF!</p>
					</iframe>
				</object>
			</div>
		{/if}
		<canvas bind:this={pageCanvas} style="display: none" />
		<canvas bind:this={fullCanvas} style="display: none" />
		{#each data?.questions as question, index}
			<div class="w-full p-5 justify-center">
				<canvas data-id={index} bind:this={canvases[index]} />
				<div class="collapse">
					<input type="checkbox" />
					<div class="collapse-title flex items-center justify-center font-large bg-secondary">
						Show/hide answers
					</div>
					<div class="bg-secondary collapse-content flex flex-1 flex-col">
						<div class="flex justify-center flex-1">
							<Answers {user} question={question.id} bind:this={answers[index]} />
						</div>
					</div>
				</div>
				<div class="collapse">
					<input type="checkbox" />
					<div class="collapse-title flex items-center justify-center font-large">
						Show/hide reply box
					</div>
					<div class="collapse-content flex flex-1 flex-col">
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
				</div>
			</div>
		{/each}
	{/if}
{:else}
	<div class="flex justify-center mb-5">
		<object data={data.url} type="application/pdf" width="90%" height="900vh">
			<iframe src={data.url} width="90%" height="900vh">
				<p>This browser does not support PDF!</p>
			</iframe>
		</object>
	</div>
{/if}

<style>
	canvas {
		width: var(--width);
		height: var(--height);
		padding: 1rem 0;
	}
</style>
