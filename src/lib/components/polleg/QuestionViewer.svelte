<script lang="ts">
	import { toast } from '@zerodevx/svelte-toast';
	import ReplyBox from '$lib/components/polleg/ReplyBox.svelte';
	import Answers from '$lib/components/polleg/Answers.svelte';
	import { EDIT_URLS } from '$lib/const';


	export let canvases: HTMLCanvasElement[];


	let showReplyBoxFor: number = null;
	let answers: Answers[] = [];
	let values: string[] = [];

	function sendAnswerCallback(res: { id: any }, index: string | number) {
		if (res.id) {
			toast.push('Success!', {
				theme: {
					'--toastColor': 'mintcream',
					'--toastBackground': 'rgba(72,187,120,0.9)',
					'--toastBarBackground': '#2F855A'
				}
			});
			answers[index].addComment(res);
		} else {
			toast.push('Error!', {
				theme: {
					'--toastColor': 'mintcream',
					'--toastBackground': 'rgba(244,67,54,0.9)',
					'--toastBarBackground': '#e74c3c'
				}
			});
		}
	}

	function genTitle(parts: string[]) {
		if (parts.length === 0) return 'Risorse';
		const title = kebabToTitle(parts[0]);

		if (parts.length === 1) {
			return title;
		} else if (parts.length === 2) {
			return titleToAcronym(title) + ' > ' + kebabToTitle(parts[1]);
		} else {
			return titleToAcronym(title) + ' >...> ' + kebabToTitle(parts[parts.length - 1]);
		}
	}

	$: title = genTitle(urlParts);

	//function showReplyBox(question, index) {}
	$: isExpanded = [];

	function toggleExpanded(index: number) {
		if (isExpanded[index] == undefined) isExpanded[index] = true;
		else isExpanded[index] = !isExpanded[index];
	}

	// -- breadcrumbs --
	let editUrls = EDIT_URLS($page.url.pathname);
	let breadcrumbMobile = true;
	function mobileBreadcrumb() {
		breadcrumbMobile = !breadcrumbMobile;
	}

	$: urlParts = $page.url.pathname
		.split('/')
		.slice(1)
		.filter((p) => p !== ''); // otherwise we get an empty string at the end

	const getPartHref = (part: string) =>
		$page.url.pathname
			.split('/')
			.slice(0, $page.url.pathname.split('/').indexOf(part) + 1)
			.join('/');

	function kebabToTitle(str: string) {
		return str
			.split('-')
			.map((s) => s[0].toUpperCase() + s.slice(1))
			.join(' ');
	}

	function titleToAcronym(str: string) {
		return str
			.split(' ')
			.map((s) => s[0].toUpperCase())
			.join('');
	}
</script>

<div>
	{#each data?.questions as question, index}
		<div class="w-fit xl:mx-48 lg:mx-16 md:m-8 m-2 mb-4 justify-center">
			<div class="overflow-hidden rounded-lg p-1">
				<canvas class="w-full h-full" data-id={index} bind:this={canvases[index]} />
			</div>
			<div class="flex justify-start items-start {isExpanded[index] ? 'flex-wrap' : ''}">
				<div
					class="collapse collapse-arrow rounded-3xl {isExpanded[index] ? 'mb-3' : 'w-fit mr-4'}"
				>
					<input type="checkbox" on:click={() => toggleExpanded(index)} />
					<div
						class="collapse-title flex items-center justify-start bg-secondary/70 rounded-3xl max-w-min font-extrabold text-lg sm:text-xl"
					>
						<span class="icon-[solar--chat-line-bold-duotone] text-3xl mr-3"></span>
						Answers
					</div>
					<div class="bg-secondary/50 pt-4 collapse-content flex flex-1 flex-col rounded-3xl">
						<div class="flex justify-center flex-1">
							<Answers {user} question={question.id} bind:this={answers[index]} />
						</div>
					</div>
				</div>

				{#if user}
					<div class="collapse rounded-3xl {isExpanded ? '' : 'w-full'}">
						<input type="checkbox" />
						<div
							class="collapse-title flex items-center justify-center text-lg font-extrabold bg-primary/70 text-bold rounded-3xl w-fit"
						>
							<span class="icon-[solar--add-circle-bold-duotone] text-3xl mr-2"></span>
							Add your answer
						</div>
						<div class="bg-primary/50 collapse-content flex flex-1 flex-col rounded-3xl">
							<ReplyBox
								closeCallback={() => {
									showReplyBoxFor = null;
								}}
								bind:unfinishedReply={values[index]}
								questionIndex={index}
								questionId={question.id}
								{sendAnswerCallback}
							/>
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/each}
</div>
