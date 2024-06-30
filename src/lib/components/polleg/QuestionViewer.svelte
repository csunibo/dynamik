<script lang="ts">
	import { toast } from '@zerodevx/svelte-toast';
	import ReplyBox from '$lib/components/polleg/ReplyBox.svelte';
	import Answers from '$lib/components/polleg/Answers.svelte';
	import { EDIT_URLS } from '$lib/const';
	import type { OnProgressParameters } from 'pdfjs-dist';
	import type { PDFPageProxy } from 'pdfjs-dist/types/src/display/api';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	const scale = 3;
	let loaded = 0.0; // percentage
	let width = 0,
		height = 0;
	let pages: PDFPageProxy[] = [];
	let numPages: number;

	let pageCanvas: HTMLCanvasElement, fullCanvas: HTMLCanvasElement;
	export let canvases: HTMLCanvasElement[];
	export let user;
	export let data;

	let showReplyBoxFor: number = null;
	let answers: Answers[] = [];
	let values: string[] = [];

	async function init() {
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

	function sendAnswerCallback(res: { id: any }, index: string | number) {
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

	function genTitle(parts: string[]) {
		if (parts.length === 0) return 'Risorse';
		const title = kebabToTitle(parts[0]);

		if (parts.length === 1) {
			return title;
		} else if (parts.length === 2) {
			return titleToAcronym(title) + ' > ' + kebabToTitle(parts[1]);
		} else {
			return titleToAcronym(title) + ' >...> ' + kebabToTitle(parts[parts.length - 1]);
		}
	}

	$: title = genTitle(urlParts);

	//function showReplyBox(question, index) {}
	$: isExpanded = [];

	function toggleExpanded(index: number) {
		if (isExpanded[index] == undefined) isExpanded[index] = true;
		else isExpanded[index] = !isExpanded[index];
	}

	// -- breadcrumbs --
	let editUrls = EDIT_URLS($page.url.pathname);
	let breadcrumbMobile = true;
	function mobileBreadcrumb() {
		breadcrumbMobile = !breadcrumbMobile;
	}

	$: urlParts = $page.url.pathname
		.split('/')
		.slice(1)
		.filter((p) => p !== ''); // otherwise we get an empty string at the end

	const getPartHref = (part: string) =>
		$page.url.pathname
			.split('/')
			.slice(0, $page.url.pathname.split('/').indexOf(part) + 1)
			.join('/');

	function kebabToTitle(str: string) {
		return str
			.split('-')
			.map((s) => s[0].toUpperCase() + s.slice(1))
			.join(' ');
	}

	function titleToAcronym(str: string) {
		return str
			.split(' ')
			.map((s) => s[0].toUpperCase())
			.join('');
	}
</script>

<div>
	{#each data?.questions as question, index}
		<div class="w-fit xl:mx-48 lg:mx-16 md:m-8 m-2 mb-4 justify-center">
			<div class="overflow-hidden rounded-lg p-1">
				<canvas class="w-full h-full" data-id={index} bind:this={canvases[index]} />
			</div>
			<div class="flex justify-start items-start {isExpanded[index] ? 'flex-wrap' : ''}">
				<div
					class="collapse collapse-arrow rounded-3xl {isExpanded[index] ? 'mb-3' : 'w-fit mr-4'}"
				>
					<input type="checkbox" on:click={() => toggleExpanded(index)} />
					<div
						class="collapse-title flex items-center justify-start bg-secondary/70 rounded-3xl max-w-min font-extrabold text-lg sm:text-xl"
					>
						<span class="icon-[solar--chat-line-bold-duotone] text-3xl mr-3"></span>
						Answers
					</div>
					<div class="bg-secondary/50 pt-4 collapse-content flex flex-1 flex-col rounded-3xl">
						<div class="flex justify-center flex-1">
							<Answers {user} question={question.id} bind:this={answers[index]} />
						</div>
					</div>
				</div>

				{#if user}
					<div class="collapse rounded-3xl {isExpanded ? '' : 'w-full'}">
						<input type="checkbox" />
						<div
							class="collapse-title flex items-center justify-center text-lg font-extrabold bg-primary/70 text-bold rounded-3xl w-fit"
						>
							<span class="icon-[solar--add-circle-bold-duotone] text-3xl mr-2"></span>
							Add your answer
						</div>
						<div class="bg-primary/50 collapse-content flex flex-1 flex-col rounded-3xl">
							<ReplyBox
								closeCallback={() => {
									showReplyBoxFor = null;
								}}
								bind:unfinishedReply={values[index]}
								questionIndex={index}
								questionId={question.id}
								{sendAnswerCallback}
							/>
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/each}
</div>

<canvas bind:this={pageCanvas} style="display: none" />
<canvas bind:this={fullCanvas} style="display: none" />
