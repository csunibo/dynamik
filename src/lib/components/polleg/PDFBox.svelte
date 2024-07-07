<script lang="ts">
import type { FullPDF, Box } from '$lib/pdfcanvas';
import { renderBox } from '$lib/pdfcanvas';
import { onMount } from 'svelte';

export let pdf: FullPDF;
export let box: Box;
let canvas: HTMLCanvasElement;

onMount(() => renderBox(pdf, canvas, box))
</script>

<div class="overflow-hidden rounded-xl mb-6 max-w-6xl">
  <canvas class="h-full w-full" bind:this={canvas} />
</div>
