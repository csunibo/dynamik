<script lang="ts">
	import { onMount } from 'svelte';
	import settings from '$lib/settings';
    import { page } from '$app/stores';
	import { goto } from '$app/navigation';
    
    const urlState=$page.url.searchParams.get('state');
	if(urlState!==null){
		console.log(urlState)
		//TODO not know if work
		settings.update((s) => {
			s.githubToken = {token:atob(urlState),expireDate:Date.now()+60*60*2};
			return s;
		});
	}
    const redirectTo=$page.url.searchParams.get('path');
	if(redirectTo!==null){
		goto(atob(redirectTo));
	}

	onMount(() => {
		settings.subscribe(() => {
			document.firstElementChild!.setAttribute('data-theme', $settings.theme);
		});
	});

</script>

<slot />

<style>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>