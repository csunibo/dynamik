<script lang="ts">
	import IntersectionObserver from 'svelte-intersection-observer';
	import { ANSWER_URL, QUESTION_URL, VOTE_URL } from '$lib/const';
	import { Carta, CartaViewer } from 'carta-md';
	import { emoji } from '@cartamd/plugin-emoji';
	import { slash } from '@cartamd/plugin-slash';
	import { code } from '@cartamd/plugin-code';
	import type { Question } from '$lib/polleg';
	import { toast } from '@zerodevx/svelte-toast';
	import Page from '../../routes/+page.svelte';
	import ReplyBox from './ReplyBox.svelte';

	export let question: number;
	export let user;

	let data: Question = {};
	let spinner: HTMLSpanElement;
	let visible: boolean = false;

	let showReplyBoxFor: number = null;
	let unfinishedReplies: string[] = [];

	export const addComment = (answerData: any) => {
		answerData.count = 0;
		answerData.vote = 0;
		if (data?.answers === undefined) data.answers = [];
		data.answers.push(answerData);
		console.log('aggiunto');
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

	const deleteAnswer = async (id: number) => {
		let res = await fetch(ANSWER_URL(id), {
			method: 'DELETE',
			credentials: 'include'
		});

		if (res.status == 200) {
			toast.push('Delete done!', {
				theme: {
					'--toastColor': 'mintcream',
					'--toastBackground': 'rgba(72,187,120,0.9)',
					'--toastBarBackground': '#2F855A'
				}
			});

			let newAns = data?.answers?.filter(function (item: any) {
				return item.id != id;
			});
			data.answers = newAns;
		} else {
			res = await res.json();
			toast.push('Error: ' + res.error, {
				theme: {
					'--toastColor': 'mintcream',
					'--toastBackground': 'rgba(244,67,54,0.9)',
					'--toastBarBackground': '#e74c3c'
				}
			});
		}
	};

	const vote = async (index: number, answerId: number, newVote: number) => {
		if (data?.answers[index].vote == newVote) newVote = 0;

		let res = await (
			await fetch(VOTE_URL(answerId), {
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ vote: newVote }),
				method: 'POST',
				credentials: 'include'
			})
		).json();

		if (res) {
			let oldVote = data.answers[index].vote;
			if (oldVote == 1 && (newVote == 0 || newVote == -1)) {
				data.answers[index].upvotes--;
			}
			if (oldVote == -1 && (newVote == 0 || newVote == 1)) {
				data.answers[index].downvotes--;
			}

			if (newVote == 1) {
				data.answers[index].upvotes++;
			}
			if (newVote == -1) {
				data.answers[index].downvotes++;
			}
			data.answers[index].count = data.answers[index].upvotes - data.answers[index].downvotes;
			data.answers[index].vote = newVote;
			//customSort();
		} else {
			toast.push('Error: ' + res.error, {
				theme: {
					'--toastColor': 'mintcream',
					'--toastBackground': 'rgba(244,67,54,0.9)',
					'--toastBarBackground': '#e74c3c'
				}
			});
		}
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
				<div class="w-full flex flex-row rounded-lg bg-base-200 border-secondary shadow-md p-4">
					<!-- Voting Section -->
					<div class="flex flex-col items-center m-1">
						<!-- Upvote Button -->
						<!-- {console.log("voto", answer?.vote)} -->
						<button
							class={'flex items-center justify-center w-10 h-10 rounded-full transition-colors hover:outline hover:outline-success focus:outline-none ' +
								(answer?.vote == 1 ? 'text-success' : 'text-neutral-content')}
							on:click={() => vote(index, answer.id, 1)}
						>
							<span class="icon-[akar-icons--circle-chevron-up-fill] text-4xl"></span>
						</button>

						<!-- Vote Count -->
						<span class="text-xl p-2 font-semibold">{answer.count}</span>

						<!-- Downvote Button -->
						<button
							class={'flex items-center justify-center w-10 h-10 rounded-full transition-colors hover:outline hover:outline-error focus:outline-none ' +
								(answer?.vote == -1 ? 'text-error' : 'text-neutral-content')}
							on:click={() => vote(index, answer.id, -1)}
						>
							<span class="icon-[akar-icons--circle-chevron-down-fill] text-4xl"></span>
						</button>
					</div>
					<!-- Answer Content -->
					<div class="flex flex-1 flex-col">
						<div class="flex justify-end items-center w-full text-sm">
							<a class="flex italic items-center" href="https://github.com/{answer.user}">
								{answer.user}
								<img
									class="w-8 h-8 rounded-full ml-2"
									src={'https://github.com/' + answer.user + '.png'}
									alt={answer.user + ' profile picture'}
								/>
							</a>
						</div>
						<div class="flex flex-1 ml-2">
							<p>{answer.content}</p>
							<!--
								fa schifo sto componente
							-->
							<!-- <CartaViewer bind:value={answer.content} {carta} />  -->
						</div>

						<div class="flex justify-end">
							{#if user}
								<button
									class="btn btn-circle hover:btn-accent text-accent hover:text-base-content"
									on:click|preventDefault={() => {
										if (showReplyBoxFor != null) {
											showReplyBoxFor = null;
										} else {
											showReplyBoxFor = index;
										}
									}}
								>
									<span class="icon-[ic--round-reply] text-3xl"></span>
								</button>
							{/if}
							{#if user?.username == answer?.user || user?.admin}
								<button
									class="btn btn-circle ml-3 hover:btn-error text-error hover:text-base-200"
									on:click|preventDefault={() => deleteAnswer(answer.id)}
								>
									<span class="icon-[solar--trash-bin-minimalistic-bold] text-3xl"></span>
								</button>
							{/if}
						</div>

						{#if showReplyBoxFor === index}
							<div class="w-full z-10">
								<ReplyBox
									closeCallback={() => {
										showReplyBoxFor = null;
									}}
									bind:unfinishedReply={unfinishedReplies[index]}
									questionId={question}
									sendAnswerCallback={() => {
										showReplyBoxFor = null;
									}}
									parentAuthor={answer.user}
									parentAnswerId={answer.id}
								/>
							</div>
						{/if}

						<div class="my-6">
							{#each answer.replies || [] as reply, index}
								<div class="divider divider-end divider-secondary mr-4">
									<a class="flex italic items-center" href="https://github.com/{answer.user}">
										{answer.user}
										<img
											class="w-8 h-8 rounded-full ml-2"
											src={'https://github.com/' + answer.user + '.png'}
											alt={answer.user + ' profile picture'}
										/>
									</a>
								</div>
								<div class="pl-4">
									{reply.content}
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
{/if}
{#if !visible}
	<IntersectionObserver once element={spinner} bind:intersecting={visible}>
		<span bind:this={spinner} class="loading loading-spinner loading-md"></span>
	</IntersectionObserver>
{/if}
