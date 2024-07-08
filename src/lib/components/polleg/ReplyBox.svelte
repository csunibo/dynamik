<script lang="ts">
	import { Carta, CartaEditor } from 'carta-md';
	import { emoji } from '@cartamd/plugin-emoji';
	import { slash } from '@cartamd/plugin-slash';
	import { code } from '@cartamd/plugin-code';

	import { POLLEG_BASE_URL } from '$lib/const';

	const carta = new Carta({
		extensions: [emoji(), slash(), code()]
	});

	let body: string;
	export let submit: (content: string) => void;
	export let questionIndex: number = -1;
	export let questionId: number;
	export let parentAuthor: string = '';
	export let parentAnswerId: number = null;

	function composeRecipientName() {
		let res = `Queston ${questionIndex + 1}`;

		if (parentAuthor != '') {
			res = `Answer of ${parentAuthor}`;
		}

		return res;
	}

	async function sendComment(qid: number, index: number, parent: number) {
		let answer = { question: qid, content: body };
		if (parent != null) {
			answer = { question: qid, content: body, parent: parent };
		}
		let res = await (
			await fetch(POLLEG_BASE_URL + '/answers', {
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(answer),
				method: 'PUT',
				credentials: 'include'
			})
		).json();

		if (res.id) {
			body = '';
		}
		submit(res, index);
	}

	const recipientName = composeRecipientName();
</script>

<div class="rounded-xl max-w-4xl w-full flex flex-col items-center justify-center mb-4">
  <div class="w-full">
    <CartaEditor bind:value={body} mode="tabs" theme="github" {carta} />
  </div>
  <div class="flex w-full justify-end py-3">
    <button class="btn btn-seconday btn-sm" on:click|preventDefault={() => {
        sendComment(questionId, questionIndex, parentAnswerId);
      }}>
      Submit
    </button>
  </div>
</div>
