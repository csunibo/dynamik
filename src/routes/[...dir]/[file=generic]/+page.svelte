<script lang="ts">
	import type { PageData } from './$types';
	import { marked } from 'marked';
	import markedKatex from '$lib/marked-katex';
	marked.use(markedKatex());

	import 'katex/dist/katex.min.css';

	export let data: PageData;
	console.log(data);
</script>

<iframe src={data.url} />

<style>
	iframe {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		border: 0;
		width: 100vw;
		height: 100vh;
	}
</style>
