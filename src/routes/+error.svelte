<script lang="ts">
</script>

<div class="flex justify-center">
	<div class="text-center">
		<h1 class="text-5xl my-12">404</h1>
		<p class="text-xl my-8">Pagina non trovata</p>

		<button class="btn btn-ghost" on:click|preventDefault={() => history.back()}>
			Torna indietro
		</button>
	</div>
</div>
