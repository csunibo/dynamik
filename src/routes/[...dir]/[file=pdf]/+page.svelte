<script lang="ts">
	import { onMount } from 'svelte';
	import { onDestroy } from 'svelte';
	import type { PageData } from './$types';
	import type { OnProgressParameters } from 'pdfjs-dist';
	import type { PDFPageProxy } from 'pdfjs-dist/types/src/display/api';

	import { toast } from '@zerodevx/svelte-toast';
	import 'carta-md/dark.css';
	import '$lib/styles/github.scss';

	import Answers from '$lib/components/Answers.svelte';
	import PdfCutter from '$lib/components/PdfCutter.svelte';
	import ReplyBox from '$lib/components/ReplyBox.svelte';
	import { page } from '$app/stores';
	import { base } from '$app/paths';

	import type { Degree, Year } from '$lib/teachings';
	import { EDIT_URLS } from '$lib/const';

	export let data: PageData;
	const scale = 3;

	let user: { avatarUrl: any; admin: any } | undefined = undefined;
	let edit: boolean = false;

	let showReplyBoxFor: number = null;

	let answers: Answers[] = [];
	let values: string[] = [];

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

	async function removePdfCutter(dataRet: PageData) {
		edit = false;
		data.questions = dataRet.questions;
		if (data.questions == null) {
			data.questions = [];
		}
		await init();
	}

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
	let isOpen = false;
	const gh_mobile_dropdown = () => {
		isOpen = !isOpen;
	};
</script>

<main class="max-w-6xl min-w-fit p-4 mx-auto">
	<div class="navbar flex bg-base-200 rounded-box shadow-sm px-5 mb-5">
		<div class="sm:hidden flex justify-start items-center">
			<button class="sm:hidden flex btn btn-ghost btn-sm" on:click={mobileBreadcrumb}>
				<span
					class="sm:hidden flex text-2xl items-center text-accent icon-[solar--folder-path-connect-bold-duotone]"
				>
				</span>
				<p class="text-accent" class:hidden={!breadcrumbMobile}>{title}</p>
			</button>
		</div>
		<div class="navbar min-h-0 p-0 justify-start items-center">
			<div
				class="breadcrumbs sm:flex lg:text-lg sm:items-start text-sm sm:flex-wrap font-semibold"
				class:hidden={breadcrumbMobile}
			>
				<ul>
					<li>
						<a class="ml-1 flex items-center" href="/">
							<span class="text-xl icon-[akar-icons--home-alt1]"></span>
						</a>
					</li>
					<!-- {#if degree}
						<li>
							<a class="flex items-center" href={'/dash/' + degree}>
								<span class="text-xl icon-[ic--round-school]"></span>
							</a>
						</li>
					{/if} -->
					{#each urlParts as part}
						{@const href = getPartHref(part) + '?' + $page.url.searchParams}
						<li><a {href} class="flex flex-wrap whitespace-normal">{part}</a></li>
					{/each}
				</ul>
			</div>
		</div>
		<div class="navbar-end">
			<details class="dropdown dropdown-end sm:hidden" on:toggle={gh_mobile_dropdown}>
				<summary class="flex flex-1 justify-end">
					<div
						class={`btn btn-sm hover:text-primary ${isOpen ? 'bg-primary text-base-100' : ' focus:text-primary'} p-0.5`}
					>
						<span class="text-xl icon-[akar-icons--more-vertical]"></span>
					</div>
				</summary>
				<ul
					class="shadow menu dropdown-content bg-base-300 rounded-lg min-w-max divide-y divide-neutral-content/30"
				>
					<li>
						<a class="btn btn-sm rounded-lg btn-ghost mb-2" href={editUrls.github_repo}>
							<p>View repo on</p>
							<span class="text-2xl icon-[akar-icons--github-fill]"></span>
						</a>
					</li>

					{#if user === undefined}
						<li>
							<button
								class="btn btn-outline btn-sm text-accent hover:btn-ghost hover:btn-accent hover:text-base-content"
								on:click|preventDefault={() =>
									(window.location.href =
										'http://localhost:3000/login?redirect_uri=http://localhost:5173' +
										data.url.slice(25))}
							>
								Login with
								<span class="text-2xl icon-[akar-icons--github-fill]"></span>
							</button>
						</li>
					{:else}
						<li class="flex flex-row items-center w-fit pt-2">
							<div class="btn btn-circle">
								<img
									src={user.avatarUrl}
									title="GitHub user avatar"
									alt="GitHub user avatar"
									class="rounded-full"
								/>
							</div>
							<div class="flex flex-col gap-0 p-0">
								<p class="font-medium italic mt-1">Hi, {user?.username}!</p>
								<button
									class="btn hover:bg-accent/80 btn-sm"
									on:click|preventDefault={() => {
										window.location.href =
											'http://localhost:3000/logout?redirect_uri=http://localhost:5173' +
											data.url.slice(25);
										user = undefined;
									}}
								>
									<span class="icon-[akar-icons--sign-out] mr-2 text-lg"></span>
									<p class="">LogOut</p>
								</button>
							</div>
						</li>
					{/if}
				</ul>
			</details>
			<!-- desktop github options -->
			<div class="hidden sm:flex">
				<div class="flex flex-1 justify-end">
					<a
						class="flex items-center rounded-lg btn-ghost flex-shrink-0 w-8 p-1"
						href={editUrls.github_repo}
					>
						<span class="text-2xl icon-[akar-icons--github-fill]"></span>
					</a>
				</div>
				{#if user === undefined}
					<button
						class="btn btn-outline btn-sm text-accent hover:btn-ghost hover:btn-accent hover:text-base-content"
						on:click|preventDefault={() =>
							(window.location.href =
								'http://localhost:3000/login?redirect_uri=http://localhost:5173' +
								data.url.slice(25))}
					>
						Login with
						<span class="text-2xl icon-[akar-icons--github-fill]"></span>
					</button>
				{:else}
					<details class="dropdown">
						<summary class="btn btn-circle p-2">
							<img
								src={user.avatarUrl}
								title="GitHub user avatar"
								alt="GitHub user avatar"
								class="w-12 rounded-full"
							/>
						</summary>
						<ul class="shadow menu dropdown-content">
							<li>
								<button
									class="btn btn-neutral hover:bg-accent/80"
									on:click|preventDefault={() => {
										window.location.href =
											'http://localhost:3000/logout?redirect_uri=http://localhost:5173' +
											data.url.slice(25);
										user = undefined;
									}}
								>
									<div class="inline-flex items-center">
										<span class="icon-[akar-icons--sign-out] mr-2 text-lg"></span>
										<p class="">LogOut</p>
									</div>
								</button>
							</li>
						</ul>
					</details>
				{/if}
			</div>
		</div>
	</div>
</main>

{#if data.isTest}
	{#if edit}
		<PdfCutter id={data.id} url={data.url} show={removePdfCutter} />
	{:else}
		{#if data.questions?.length === 0}
			<div class="flex justify-center mb-2">
				<div class="text-center">
					<span class="text-5xl icon-[solar--sad-circle-broken]"></span>
					<p class="text-xl mb-8">
						Sorry, but the document isn't ready for responses yet. Please check back soon!
					</p>

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
				<object
					data={data.url}
					title="PDF Document"
					type="application/pdf"
					width="90%"
					height="900vh"
				>
					<iframe
						src={data.url}
						title="PDF not supported on this browser"
						width="90%"
						height="900vh"
					>
						<p>This browser does not support PDF!</p>
					</iframe>
				</object>
			</div>
		{/if}
		<canvas bind:this={pageCanvas} style="display: none" />
		<canvas bind:this={fullCanvas} style="display: none" />
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
			<!-- 
			{#if showReplyBoxFor == index}
				<div class="fixed bottom-0 w-full z-10"></div>
			{/if} -->
		{/each}
	{/if}
{:else}
	<div class="flex justify-center mb-5">
		<object data={data.url} title="PDF Document" type="application/pdf" width="90%" height="900vh">
			<iframe src={data.url} title="PDF not supported on your browser" width="90%" height="900vh">
				<p>This browser does not support PDF!</p>
			</iframe>
		</object>
	</div>
{/if}

<style>
	canvas {
		width: var(--width);
		height: var(--height);
		border-radius: 0.5rem;
	}
</style>
