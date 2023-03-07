<script lang="ts">
	import teachings from '$lib/teachings';
</script>

<ul>
	{#each teachings as teaching}
		<li>
			<a href={teaching.url}>
				{#if teaching.name}
					{teaching.name}
				{:else}
					{teaching.url}
				{/if}
			</a>
		</li>
	{/each}
</ul>
