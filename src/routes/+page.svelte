<script lang="ts">
	import teachings from '$lib/teachings';
	import { base } from '$app/paths';
</script>

<ul>
	{#each teachings as teaching}
		{@const href = base + '/' + teaching.url}
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
