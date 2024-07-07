<script lang="ts">
	import { toast } from '@zerodevx/svelte-toast';
	import ReplyBox from '$lib/components/polleg/ReplyBox.svelte';
	import AnswerList from '$lib/components/polleg/AnswerList.svelte';
	import PDFBox from '$lib/components/polleg/PDFBox.svelte';
	import { EDIT_URLS } from '$lib/const';
	import { type FullPDF, type Box, extractFullPDF } from '$lib/pdfcanvas';
	import type { OnProgressParameters } from 'pdfjs-dist';
	import type { PDFPageProxy } from 'pdfjs-dist/types/src/display/api';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	export let user;
	export let data;

  // TODO: remove
	let showReplyBoxFor: number = null;
	let answers: Answers[] = [];
	let values: string[] = [];

	let fullCanvas: HTMLCanvasElement;
	let pdf: FullPDF | null = null;
	let boxes: Box[] = [];
	let loaded = 0.0; // percentage
  $: percentage = Math.floor(loaded * 100)

	const init = async () => {
    const { GlobalWorkerOptions, getDocument } = await import('pdfjs-dist');
    GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();

    const loadingPdf = getDocument(data.url);
    loadingPdf.onProgress = (params: OnProgressParameters) => {
      loaded = params.loaded / params.total;
    };
    const rawPdf = await loadingPdf.promise;
    pdf = await extractFullPDF(fullCanvas, rawPdf);
    boxes = pdf.pages;
	}

	onMount(init);

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

	$: isExpanded = [];

	function toggleExpanded(index: number) {
		if (isExpanded[index] == undefined) isExpanded[index] = true;
		else isExpanded[index] = !isExpanded[index];
	}
</script>

{#if pdf == null || loaded != 1}
  <main class="h-[50vh] flex flex-1 flex-col items-center justify-center">
    <h1 class="text-xl font-bold py-4">Loading PDF: {percentage}%</h1>
    <progress class="progress w-56" value={percentage} max="100"></progress>
  </main>
{:else}
<main class="flex flex-1 flex-col">
  {#each boxes as box, index}
    <PDFBox {pdf} {box} />
    {#if box.question}
        TODO: QUESTION
    {/if}
  {/each}
</main>
{/if}

<!--
{#each (data?.questions || []) as question, index}
  <div class="w-fit xl:mx-48 lg:mx-16 md:m-8 m-2 mb-4 justify-center">
    <div class="overflow-hidden rounded-lg p-1">
      <canvas class="w-full h-full" data-id={index} />
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
            <AnswerList {user} question={question.id} bind:this={answers[index]} />
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
-->

<canvas bind:this={fullCanvas} style="display: none" />
