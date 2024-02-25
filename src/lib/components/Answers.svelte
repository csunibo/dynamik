<script lang="ts">
	import IntersectionObserver from 'svelte-intersection-observer';
	import { QUESTION_URL, VOTE_URL } from '$lib/const';
	import type { Question } from '$lib/polleg';

	export let question: number;
	let data: Question = {};
	let spinner: HTMLSpanElement;
	let visible: boolean;

	const load = async () => {
		const res = await fetch(QUESTION_URL(question));
		data = await res.json();
		console.log(data);
		visible = true;
	};

	const vote = async (answer: number, v: number) => {
		const res = await (
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
	<div class="flex w-full flex-col gap-2 items-center">
		{#each data?.answers || [] as answer, index}
			<div class="lg:w-4/6 w-full flex flex-row rounded-lg border-2 border-secondary shadow-md p-6">
				<!-- Voting Section -->
				<div class="flex flex-col items-center p-2">
					<!-- Upvote Button -->
					<button
						class="flex items-center justify-center w-10 h-10 bg-neutral-content rounded-full transition-colors hover:bg-success focus:outline-none"
						on:click={() => vote(answer.id, 1)}
					>
						<span class="icon-[material-symbols--arrow-upward] text-neutral"></span>
					</button>

					<!-- Vote Count -->
					<span class="text-xl p-2 font-semibold">{answer.upvotes - answer.downvotes}</span>

					<!-- Downvote Button -->
					<button
						class="flex items-center justify-center w-10 h-10 bg-neutral-content rounded-full transition-colors hover:bg-error focus:outline-none"
						on:click={() => vote(answer.id, -1)}
					>
						<span class="icon-[material-symbols--arrow-downward] text-neutral"></span>
					</button>
				</div>
				<!-- Answer Content -->
				<div class="flex flex-1 flex-col">
					<div class="flex justify-end">
						<div class="text-sm flex justify-center items-center">
							<span>
								{answer.user}
							</span>
						</div>
						<img
							class="w-8 h-8 rounded-full ml-3"
							src={'https://github.com/' + answer.user + '.png'}
							alt={answer.user + ' profile picture'}
						/>
					</div>
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
<!-- <IntersectionObserver once element={spinner} bind:intersecting={visible}> -->
<!-- 	<span bind:this={spinner} class="loading loading-spinner loading-md"></span> -->
<!-- </IntersectionObserver> -->
