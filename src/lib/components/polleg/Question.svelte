<script lang="ts">
import type { Question } from '$lib/polleg';
import { QUESTION_URL } from '$lib/const';

import ReplyBox from '$lib/components/polleg/ReplyBox.svelte';

export let question: Question;

let expanded: bool = false;
let loading: bool = true;
let spinner: HTMLSpanElement;

const sortCriteria = () => {
  let x: number = a.count;
  let y: number = b.count;
  if (x > y) {
    return -1;
  }
  if (x < y) {
    return 1;
  }
  return 0;
};

const load = async () => {
  if(!expanded)
    return

  const res = await fetch(QUESTION_URL(question.id));
  const data = await res.json();

  if (!data.answers)
    data.answers = []

  question.answers = data.answers.sort(sortCriteria)
  loading = false
};

$: expanded, load();

</script>

<div class="flex items-center flex-col pb-6">
  {#if expanded}
    {#if loading}
    <span bind:this={spinner} class="loading loading-spinner loading-md my-4" />
    {:else}
      {JSON.stringify(question.answers)}
    {/if}
    <ReplyBox submit={} />
  {/if}
  <button class="btn btn-primary" on:click|preventDefault={() => {expanded = !expanded; loading = true}}>
    {!expanded ? 'Show answers' : 'Hide answers'}
  </button>
</div>
