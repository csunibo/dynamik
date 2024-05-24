<script lang="ts">
	import { page } from '$app/stores';
	$: error = $page.error;
</script>

<div class="flex justify-center h-screen items-center">
	<div class="text-center">
		<h1 class="text-5xl mb-6 font-mono">{$page.status}</h1>

		<p class="text-xl font-mono text-base-content">
			{#if error == null}
				Unknown error!
			{:else}
				{error.message}
			{/if}
		</p>

		<button class="btn btn-ghost mt-10" on:click|preventDefault={() => history.back()}>
			Go back to previous page
		</button>
	</div>
</div>
