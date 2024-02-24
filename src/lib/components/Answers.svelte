<script lang="ts">
	import IntersectionObserver from 'svelte-intersection-observer';
	import { QUESTION_URL } from '$lib/const';
	import type { Question } from '$lib/polleg';

	export let question: number;
	let data: Question;
	let spinner: HTMLSpanElement;
	let visible: boolean;

	const load = async () => {
		const res = await fetch(QUESTION_URL(question));
		data = await res.json();
	};

	// when visible changes (i.e., is set to true) trigger the loading
	$: visible, load();
</script>

{#if visible}
	<div>
		answers go here (question id: {question})
		{#each data.answers as answer, index}
			{answer.user} - {answer.content}
		{/each}
	</div>
{/if}
<IntersectionObserver once element={spinner} bind:intersecting={visible}>
	<span bind:this={spinner} class="loading loading-spinner loading-md"></span>
</IntersectionObserver>
