<script lang="ts">
	import teachings from '$lib/teachings';
	import { page } from '$app/stores';
</script>

<ul>
	{#each teachings as teaching}
		<li>
			<a href={$page.url + '/' + teaching.url}>
				{#if teaching.name}
					{teaching.name}
				{:else}
					{teaching.url}
				{/if}
			</a>
		</li>
	{/each}
</ul>
