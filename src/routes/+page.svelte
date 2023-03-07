<script lang="ts">
	import teachings from '$lib/teachings';
	import { page } from '$app/stores';
</script>

<ul>
	{#each teachings as teaching}
		{@const href = new URL(teaching.url, $page.url).toString()}
		<li>
			<a {href}>
				{#if teaching.name}
					{teaching.name}
				{:else}
					{teaching.url}
				{/if}
			</a>
		</li>
	{/each}
</ul>
