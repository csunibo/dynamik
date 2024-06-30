<script lang="ts">
	import IntersectionObserver from 'svelte-intersection-observer';
	import { QUESTION_URL, VOTE_URL } from '$lib/const';
	import type { Question } from '$lib/polleg';
	import SingleAnswer from './SingleAnswer.svelte';

	export let question: number;
	export let user;

	let data: Question = {};
	let spinner: HTMLSpanElement;
	let visible: boolean = false;

	export const addComment = (answerData: any) => {
		answerData.count = 0;
		answerData.vote = 0;
		if (data?.answers === undefined) data.answers = [];
		data.answers.push(answerData);
		//customSort();
	};

	export const load = async () => {
		const res = await fetch(QUESTION_URL(question));
		data = await res.json();

		for (let i = 0; i < data?.answers?.length; i++) {
			const resAns = await fetch(VOTE_URL(data.answers[i].id), {
				credentials: 'include'
			});

			if (resAns.status == 200) {
				const dataAns = await resAns.json();

				data.answers[i].vote = dataAns?.vote;
			} else {
				// never done before
				data.answers[i].vote = 0;
			}

			data.answers[i].count = data.answers[i].upvotes - data.answers[i].downvotes;
		}

		customSort();
	};

	const customSort = () => {
		data.answers = data?.answers?.sort(function (a: any, b: any) {
			let x: number = a.count;
			let y: number = b.count;
			if (x > y) {
				return -1;
			}
			if (x < y) {
				return 1;
			}
			return 0;
		});
	};

	// when visible changes (i.e., is set to true) trigger the loading
	$: visible, load();
</script>

{#if visible}
	{#if data?.answers == null || data?.answers?.length == 0}
		<div
			class="flex justify-center text-xl text-center font-semibold items-center mt-2 text-base-content/50"
		>
			There are no solutions yet.<br />Be the first to add one!
		</div>
	{:else}
		<div class="flex w-full flex-col gap-2 items-center">
			{#each data?.answers || [] as answer, index}
				<SingleAnswer {user} {answer} {index} {question} />
			{/each}
		</div>
	{/if}
{/if}
{#if !visible}
	<IntersectionObserver once element={spinner} bind:intersecting={visible}>
		<span bind:this={spinner} class="loading loading-spinner loading-md"></span>
	</IntersectionObserver>
{/if}
