<script lang="ts">
	export let url: string;
	export let width: string;
	export let height: string;
</script>

<div class="flex justify-center mb-5">
	<object data={url} title="PDF Document" type="application/pdf" {width} {height}>
		<iframe src={url} title="PDF not supported on your browser" {width} {height}>
			<p>This browser does not support PDF!</p>
		</iframe>
	</object>
</div>
