<script lang="ts">
	import IntersectionObserver from 'svelte-intersection-observer';
	import { ANSWER_URL, QUESTION_URL, VOTE_URL } from '$lib/const';
	import { Carta, CartaViewer } from 'carta-md';
	import { emoji } from '@cartamd/plugin-emoji';
	import { slash } from '@cartamd/plugin-slash';
	import { code } from '@cartamd/plugin-code';
	import type { Question } from '$lib/polleg';
	import { toast } from '@zerodevx/svelte-toast';

	const carta = new Carta({
		extensions: [emoji(), slash(), code()]
	});

	export let question: number;
	export let user;

	let data: Question = {};
	let spinner: HTMLSpanElement;
	let visible: boolean = false;

	export const load = async () => {
		const res = await fetch(QUESTION_URL(question));
		data = await res.json();
		for (let i = 0; i < data?.answers?.length; i++) {
			try {
				const resAns = await fetch(VOTE_URL(data.answers[i].id), {
					credentials: 'include'
				});
				const dataAns = await resAns.json();
				data.answers[i].vote = dataAns.vote;
			} catch (e) {
				// never done before
				data.answers[i].vote = 0;
			}
			data.answers[i].count = data.answers[i].upvotes - data.answers[i].downvotes;
			// data?.answers[i].count = data?.answers[i].upvotes - data?.answer[i].downvotes
		}

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

	export const deleteAnswer = async (id: number) => {
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

			// let newAns = data?.answers?.filter(function (item: any) {
			// 	// console.log(item.id, id);
			// 	return item.id != id;
			// });
			// data.answers = newAns;
			await load();
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

	const vote = async (answer: number, v: number) => {
		if (data?.answers?.filter((ans: any) => ans.id == answer)[0].vote == v) v = 0;
		await (
			await fetch(VOTE_URL(answer), {
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ vote: v }),
				method: 'POST',
				credentials: 'include'
			})
		).json();
		await load();
	};

	// when visible changes (i.e., is set to true) trigger the loading
	$: visible, load();
</script>

{#if visible}
	{#if data?.answers == null || data?.answers?.length == 0}
		<div class="flex justify-center">No answer found</div>
	{:else}
		<div class="flex w-full flex-col gap-2 items-center">
			{#each data?.answers || [] as answer, index}
				<div class="w-full flex flex-row rounded-lg bg-base-100 border-secondary shadow-md p-6">
					<!-- Voting Section -->
					<div class="flex flex-col items-center p-2">
						<!-- Upvote Button -->
						<!-- {console.log("voto", answer?.vote)} -->
						<button
							class={'flex items-center justify-center w-10 h-10 rounded-full transition-colors hover:bg-success focus:outline-none ' +
								(answer?.vote == 1 ? 'bg-success' : 'bg-neutral-content')}
							on:click={() => vote(answer.id, 1)}
						>
							<span class="icon-[material-symbols--arrow-upward] text-neutral"></span>
						</button>

						<!-- Vote Count -->
						<span class="text-xl p-2 font-semibold">{answer.count}</span>

						<!-- Downvote Button -->
						<button
							class={'flex items-center justify-center w-10 h-10 rounded-full transition-colors hover:bg-error focus:outline-none ' +
								(answer?.vote == -1 ? 'bg-error' : 'bg-neutral-content')}
							on:click={() => vote(answer.id, -1)}
						>
							<span class="icon-[material-symbols--arrow-downward] text-neutral"></span>
						</button>
					</div>
					<!-- Answer Content -->
					<div class="flex flex-1 flex-col">
						<div class="flex justify-end">
							<div class="text-sm flex justify-center items-center">
								<a href="https://github.com/{answer.user}">
									{answer.user}
								</a>
							</div>

							<a href="https://github.com/{answer.user}">
								<img
									class="w-8 h-8 rounded-full ml-3"
									src={'https://github.com/' + answer.user + '.png'}
									alt={answer.user + ' profile picture'}
								/>
							</a>
						</div>
						<div class="flex flex-1 ml-2">
							<p>{answer.content}</p>
							<!--
								fa schifo sto componente
								<CartaViewer value={answer.content} {carta} /> 
							-->
						</div>

						{#if user?.username == answer?.user || user?.admin}
							<div class="flex justify-end">
								<button
									class="btn btn-error"
									on:click|preventDefault={() => deleteAnswer(answer.id)}
								>
									Delete
								</button>
							</div>
						{/if}
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
