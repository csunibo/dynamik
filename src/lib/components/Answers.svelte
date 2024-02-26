<script lang="ts">
	import IntersectionObserver from 'svelte-intersection-observer';
	import { QUESTION_URL, VOTE_URL } from '$lib/const';
	import type { Question } from '$lib/polleg';

	export let question: number;
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
		}
		console.log(data);
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
	{#if data?.answers == null}
		<div class="flex justify-center">No answer found</div>
	{:else}
		<div class="flex w-full flex-col gap-2 items-center">
			{#each data?.answers || [] as answer, index}
				<div class="w-full flex flex-row rounded-lg bg-base-100 border-secondary shadow-md p-6">
					<!-- Voting Section -->
					<div class="flex flex-col items-center p-2">
						<!-- Upvote Button -->
						<button
							class={'flex items-center justify-center w-10 h-10 rounded-full transition-colors hover:bg-success focus:outline-none ' +
								(answer.vote == 1 ? 'bg-success' : 'bg-neutral-content')}
							on:click={() => vote(answer.id, 1)}
						>
							<span class="icon-[material-symbols--arrow-upward] text-neutral"></span>
						</button>

						<!-- Vote Count -->
						<span class="text-xl p-2 font-semibold">{answer.upvotes - answer.downvotes}</span>

						<!-- Downvote Button -->
						<button
							class={'flex items-center justify-center w-10 h-10 rounded-full transition-colors hover:bg-error focus:outline-none ' +
								(answer.vote == -1 ? 'bg-error' : 'bg-neutral-content')}
							on:click={() => vote(answer.id, -1)}
						>
							<span class="icon-[material-symbols--arrow-downward] text-neutral"></span>
						</button>
					</div>
					<!-- Answer Content -->
					<div class="flex flex-1 flex-col">
						<a href="https://github.com/{answer.user}">
							<div class="flex justify-end">
								<div class="text-sm flex justify-center items-center">
									{answer.user}
								</div>
								<img
									class="w-8 h-8 rounded-full ml-3"
									src={'https://github.com/' + answer.user + '.png'}
									alt={answer.user + ' profile picture'}
								/>
							</div>
						</a>
						<div class="flex flex-1 ml-1">
							<p>
								{answer.content}
							</p>
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
