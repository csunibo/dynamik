<script lang="ts">
	console.log('ciaop');
	import { Carta, CartaEditor } from 'carta-md';
	import { emoji } from '@cartamd/plugin-emoji';
	import { slash } from '@cartamd/plugin-slash';
	import { code } from '@cartamd/plugin-code';

	const carta = new Carta({
		extensions: [emoji(), slash(), code()]
	});

	export let unfinishedReply: string;
	export let closeCallback: () => void;
	export let sendAnswerCallback: () => void;
	export let questionIndex: number = -1;
	export let questionId: number;
	export let parentAuthor: string = '';
	export let parentAnswerId: number = null;

	function composeRecipientName() {
		console.log(parentAuthor);
		let res = `Queston ${questionIndex + 1}`;

		if (parentAuthor != '') {
			res = `Answer of ${parentAuthor}`;
		}

		return res;
	}

	async function sendComment(qid: number, index: number, parent: number) {
		let answer = { question: qid, content: unfinishedReply };
		if (parent != null) {
			answer = { question: qid, content: unfinishedReply, parent: parent };
		}
		let res = await (
			await fetch('http://localhost:3000/answers', {
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(answer),
				method: 'PUT',
				credentials: 'include'
			})
		).json();

		if (res.id) {
			unfinishedReply = '';
			closeCallback();
		}
		sendAnswerCallback(res, index);
	}

	const recipientName = composeRecipientName();
</script>

<div class="flex justify-center flex-1">
	<div class="flex w-4/6 flex-col gap-1 p-8">
		<!-- <h2 class="text-lg mx-5 pl-16 font-bold bg-slate-700">Reply to {recipientName}</h2> -->
		<div class="flex flex-1 w-full">
			<CartaEditor bind:value={unfinishedReply} mode="tabs" theme="github" {carta} />
		</div>
		<div class="flex flex-row-reverse justify-around">
			<button
				class="btn btn-active hover:btn-secondary"
				type="submit"
				on:click|preventDefault={() => {
					sendComment(questionId, questionIndex, parentAnswerId);
				}}
			>
				Comment!
			</button>
			<button class="btn btn-active hover:btn-neutral" on:click|preventDefault={closeCallback()}
				>cancel</button
			>
		</div>
	</div>
</div>
