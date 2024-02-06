<script lang="ts">
	import { writable } from 'svelte/store';
	import upload from '$lib/upld';
	import teachings from '../../config/teachings.json';

	const repo = ['appunti', 'dispense', 'esercizi', 'lavagne', 'libri', 'lucidi', 'prove', 'varie'];

	const search = writable('');
	let selectedTeaching = '';
	let allTeachingNames: string[] = teachings.map((teaching) => teaching.name);
	let isOpen = false;
	let selectedIndex = 0;
	let selectedDir = '';
	let file_name = '';

	$: filteredTeachings = $search
		? allTeachingNames.filter((teaching) => teaching.toLowerCase().includes($search.toLowerCase()))
		: allTeachingNames;

	const selectTeaching = (teaching: string) => {
		selectedTeaching = teaching;
		search.set(teaching);
		isOpen = false;
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		switch (event.key) {
			case 'ArrowDown':
				if (selectedIndex < filteredTeachings.length - 1) selectedIndex++;
				break;
			case 'ArrowUp':
				if (selectedIndex > 0) selectedIndex--;
				break;
			case 'Enter':
				selectTeaching(filteredTeachings[selectedIndex]);
				break;
		}
	};

	let file_uploads: {
		file: File;
		file_name: string;
		id: number; // unique id for each upload
		isNameValid: boolean;
	}[] = [];

	const handleFileChange = (event: Event) => {
		const fileInput = event.target as HTMLInputElement;
		if (fileInput.files) {
			for (let i = 0; i < fileInput.files.length; i++) {
				const file = fileInput.files[i];
				file_uploads = [
					...file_uploads,
					{
						file: file,
						file_name: file.name,
						id: Date.now() + i, // unique id for each upload
						isNameValid: checkFileName(file.name)
					}
				];
			}
		}
	};

	const renameFile = (id: number, newName: string) => {
		const upload = file_uploads.find((upload) => upload.id === id);
		if (upload) {
			upload.file_name = newName;
		}
		file_uploads = [...file_uploads]; // force reactivity
	};

	const checkFileName = (fileName: string) => {
		fileName = fileName.split('.')[0];
		return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(fileName);
	};

	const removeFile = (id: number) => {
		file_uploads = file_uploads.filter((upload) => upload.id !== id);
	};

	function submit() {
		file_uploads.forEach((upload) => {
			upload.push({
				repo: selectedTeaching,
				dir: selectedDir,
				file_name: file_name
			});
		});
	}

	// ------ DRAG & DROP -------
	let isDraggingOver = false;
	function dragOverHandler(event) {
		event.preventDefault();
		isDraggingOver = true;
	}

	function dragLeaveHandler(event) {
		isDraggingOver = false;
	}

	function dropHandler(event) {
		event.preventDefault();
		isDraggingOver = false;
		const files = event.dataTransfer.files;
		if (files) {
			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				file_uploads = [
					...file_uploads,
					{
						file: file,
						file_name: file.name,
						id: Date.now() + i, // unique id for each upload
						isNameValid: checkFileName(file.name)
					}
				];
			}
		}
	}
</script>

<main class="max-w-6xl min-w-fit p-4 mx-auto">
	<!-- Navbar -->
	<div class="navbar flex bg-base-200 rounded-box shadow-sm px-5 mb-5">
		<div class="navbar min-h-0 p-0 justify-center items-center">
			<h1 class="font-bold text-xl">Carica i tuoi file</h1>
		</div>
	</div>
	<form class="form-control font-semibold m-3">
		<!-- Choose teaching -->
		<label>Scegli la repository</label>
		<input
			required
			class="input select-primary"
			type="text"
			bind:value={$search}
			on:input={() => {
				isOpen = true;
			}}
			on:blur={() => setTimeout(() => (isOpen = false), 100)}
			on:keydown={handleKeyDown}
			placeholder="Select a teaching..."
		/>

		{#if isOpen}
			<ul class="mt-20 absolute rounded shadow-lg bg-base-100 text-base-content w-full">
				{#each filteredTeachings as teaching, index (teaching)}
					<li
						class="cursor-pointer hover:bg-primary hover:text-base-content px-4 py-2 {selectedIndex ===
						index
							? 'bg-primary text-base-content'
							: ''}"
					>
						<button on:click={() => selectTeaching(teaching)}>
							{teaching}
						</button>
					</li>
				{/each}
			</ul>
		{/if}
		<br />
		<!-- Choose dir -->
		<label>Scegli la cartella</label>
		<select required class="select select-primary text-base" bind:value={selectedDir}>
			{#each repo as dir}
				<option>{dir}</option>
			{/each}
		</select>
		<br />
		<!-- Drag & drop files -->
		<div
			class="flex items-center justify-center w-full {isDraggingOver ? 'bg-primary/20' : ''}"
			on:dragover={dragOverHandler}
			on:dragleave={dragLeaveHandler}
			on:drop={dropHandler}
		>
			<label
				for="dropzone-file"
				class="flex flex-col items-center justify-center w-full border-2 border-base-content/50 border-dashed rounded-lg cursor-pointer hover:bg-primary/20 bg-neutral hover:border-primary {file_uploads.length >
				0
					? 'h-32'
					: 'h-64'}"
			>
				<div class="flex flex-col items-center justify-center pt-5 pb-6">
					<span class="mb-2 text-base-content/50 icon-[akar-icons--cloud-upload] text-6xl"></span>
					<p class="mb-2 text-sm text-base-content/50">
						<span class="font-semibold">Click to upload</span> or drag and drop
					</p>
					<p class="text-xs text-base-content/50">PDF, MD, TEX and more</p>
				</div>
				<input id="dropzone-file" type="file" class="hidden" on:change={handleFileChange} />
			</label>
		</div>
		{#if file_uploads}
			<div class="flex flex-wrap justify-around m-3">
				{#each file_uploads as upload (upload.id)}
					<div class="m-1 flex flex-col items-center justify-center">
						<button
							on:click={() => {
								removeFile(upload.id);
								file_uploads = [...file_uploads];
							}}
						>
							<div class="group">
								<span
									class="group-hover:hidden text-accent icon-[solar--file-smile-bold-duotone] text-8xl"
								></span>
								<span
									class="hidden group-hover:block text-error icon-[solar--file-remove-bold-duotone] text-8xl"
								></span>
							</div>
						</button>
						<div class="flex items-center">
							<input
								required
								class="input border-b-accent relative focus:outline-accent {upload.isNameValid
									? 'border-b-success'
									: 'border-b-error border-b-4'}"
								type="text"
								bind:value={upload.file_name}
								on:blur={() => renameFile(upload.id, upload.file_name)}
							/>
							<span class="text-lg icon-[akar-icons--pencil]"></span>
						</div>
					</div>
				{/each}
			</div>
			<h1 class="flex">
				* Rinomina eventuali file sottolineati in <p class="text-error ml-1 mr-1">rosso</p>
				in kebabe-case per velocizzare l'approvazione.
			</h1>
		{/if}
		<button
			type="submit"
			class="m-5 flex justify-center items-center bg-primary shadow-lg hover:bg-success hover:shadow-success/50 shadow-primary/50 text-white font-bold py-2 px-4 rounded"
			on:click={submit}
			><span class="m-1 text-lg icon-[akar-icons--send]"></span>Crea una Pull Request su GitHub</button
		>
	</form>
</main>

<style>
	:global(Select) {
		@apply bg-base-100 text-base-content rounded shadow;
	}
	:global(.svelte-select .listContainer) {
		@apply mt-1 rounded shadow-lg;
	}
	:global(.svelte-select .selectedValue) {
		@apply cursor-pointer;
	}
	:global(.svelte-select .listItem) {
		@apply cursor-pointer;
	}
</style>
