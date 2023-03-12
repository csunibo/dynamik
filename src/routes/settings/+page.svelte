<script lang="ts">
	import { derived } from 'svelte/store';
	import settings, { themes as allThemes } from '$lib/settings';

	let themes = derived(settings, ({ theme }) => allThemes.filter((t) => t != theme));
</script>

<main class="md:container md:m-auto p-4">
	<h1 class="text-3xl font-bold my-8 text-primary">Settings</h1>

	<div class="form-control my-4">
		<label class="label">
			<span class="label-text">Theme</span>
			<select class="select select-primary" bind:value={$settings.theme}>
				<option disabled selected>{$settings.theme}</option>
				{#each $themes as theme}
					<option>{theme}</option>
				{/each}
			</select>
		</label>
	</div>

	<div class="form-control my-4">
		<label class="cursor-pointer label">
			<span class="label-text">Open documents in new tabs</span>
			<input type="checkbox" class="toggle toggle-primary" bind:checked={$settings.newTab} />
		</label>
	</div>

	<div class="form-control my-4">
		<label class="cursor-pointer label">
			<span class="label-text">
				Display dates as
				<a href="https://en.wikipedia.org/wiki/ISO_8601" class="link">ISO8601</a>
			</span>
			<input type="checkbox" class="toggle toggle-primary" bind:checked={$settings.isoDates} />
		</label>
	</div>
</main>
