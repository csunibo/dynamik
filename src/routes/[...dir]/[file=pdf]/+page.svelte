<script lang="ts">
	import { onDestroy } from 'svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

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

	export let data: PageData;

	let user: { avatarUrl: any; admin: any } | undefined = undefined;
	let editMode: boolean = false;

	let canvases: HTMLCanvasElement[] = [];

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
	}

	onMount(init);

	async function removePdfCutter(dataRet: PageData) {
		edit = false;
		data.questions = dataRet.questions;
		if (data.questions == null) {
			data.questions = [];
		}
		await init();
	}

	async function fetchUser() {
		let res = await fetch(WHOAMI_URL, {
			method: 'GET',
			credentials: 'include'
		});

		if (res.status == 200) {
			user = await res.json();
		}
	}

	function setEditMode(flag: boolean) {
		editMode = flag;
	}
</script>

<main class="max-w-6xl min-w-fit p-4 mx-auto">
	<Navbar title={$page.params.file} />

	{#if data.isExam}
		{#if editMode}
			<PdfCutter id={data.id} url={data.url} show={removePdfCutter} />
		{:else if data.questions?.length !== 0}
			<QuestionViewer {canvases} {user} {data} />
		{:else}
			<!-- If the questions aren't present show instructions and pdf -->
			<Instructions isAdmin={user?.admin} {setEditMode} />
			<PdfViewer url={data.url} width={'90%'} height={'900vh'} />
		{/if}
	{:else}
		<!-- If it's not an exam, view the pdf -->
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
