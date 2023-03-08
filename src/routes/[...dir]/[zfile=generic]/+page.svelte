<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<iframe title="Embedded resource" src={data.url} />

<style>
	iframe {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		border: 0;
		width: 100vw;
		height: 100vh;
	}
</style>
