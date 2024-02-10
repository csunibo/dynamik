<script lang="ts">
	import { writable } from 'svelte/store';
	import Login from './Login.svelte';
	import UPLD from '$lib/upld';
	import teachings from '../../config/teachings.json';
	import { page } from '$app/stores';
	import Error from '../+error.svelte';

	interface FileUpload {
		file: string;
		file_name: string;
		id: number; // unique id for each upload
		isNameValid: boolean;
	}

	const repo = ['appunti', 'dispense', 'esercizi', 'lavagne', 'libri', 'lucidi', 'prove', 'varie'];

	const search = writable('');

	$: isOpen = false;
	$: selectedIndex = -1;

	let allTeachingNames: string[] = teachings.map((teaching) => teaching.name);
	let teaching_Pair: { [key: string]: string } = {};

	teachings.forEach((teaching) => {
		teaching_Pair[teaching.name] = teaching.url;
	});
	$: filteredTeachings = $search
		? allTeachingNames.filter((teaching) => teaching.toLowerCase().includes($search.toLowerCase()))
		: allTeachingNames;

	function selectTeaching(teaching: string, index: number) {
		selectedIndex = index;
		search.set(teaching);
		isOpen = false;
	}

	// ------ Handle from page -------
	let selectedDir = writable('');
	$: {
		let url = $page.url.toString().split('?')[1]?.split(',') || '';
		$search = Object.keys(teaching_Pair).find((key) => teaching_Pair[key] === url[0] || '') || '';
		$selectedDir = url[1] || '';
	}

	enum Key {
		ArrowDown = 'ArrowDown',
		ArrowUp = 'ArrowUp',
		Enter = 'Enter'
	}

	const handleKeyDown = (event: KeyboardEvent): void => {
		switch (event.key) {
			case Key.ArrowDown:
				if (selectedIndex < filteredTeachings.length - 1) selectedIndex++;
				break;
			case Key.ArrowUp:
				if (selectedIndex > 0) selectedIndex--;
				break;
			case Key.Enter:
				selectTeaching(filteredTeachings[selectedIndex], selectedIndex);
				break;
		}
	};

	let file_uploads: FileUpload[] = [];

	/**
	 * Handle the file input
	 */
	const handleFileChange = async (event: Event): Promise<void> => {
		const fileInput = event.target as HTMLInputElement;
		if (fileInput.files) {
			for (let i = 0; i < fileInput.files.length; i++) {
				const file = fileInput.files[i];
				file_uploads = [
					...file_uploads,
					{
						file: await toBase64(file),
						file_name: file.name,
						id: Date.now() + i, // unique id for each upload
						isNameValid: checkFileName(file.name)
					}
				];
			}
		}
	};

	const checkFileName = (fileName: string): boolean => {
		fileName = fileName.split('.').slice(0, -1).join('.'); // get the name without extension
		return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(fileName);
	};

	const handleInputChange = (
		event: Event & { currentTarget: EventTarget & HTMLInputElement },
		fileId: number
	): void => {
		const newFileName = (event.target as HTMLInputElement).value;
		const fileIndex = file_uploads.findIndex((file) => file.id === fileId);
		if (fileIndex !== -1) {
			file_uploads[fileIndex].file_name = newFileName;
			file_uploads[fileIndex].isNameValid = checkFileName(newFileName);
			file_uploads = [...file_uploads]; // force reactivity
		}
	};

	const removeFile = (id: number): void => {
		file_uploads = file_uploads.filter((upload) => upload.id !== id);
	};

	// ------ LOGIN ------
	$: logged = true; // true se è già loggato, false mostra popup login github

	function submit(): void {
		logged = checkLogin();
		let fileNames: string[] = [];
		let files: string[] = [];

		file_uploads.forEach((upload) => {
			fileNames.push(upload.file_name);
			files.push(upload.file);
		});

		let urlselectedTeaching = teaching_Pair[$search];

        console.log($selectedDir, "----")
		UPLD.set({
			repo: urlselectedTeaching,
			dir: $selectedDir.toString(),
			file_name: fileNames,
			file: files
		});
	}

	function checkLogin() {
		if (!logged) return true;
		else return false;
	}

	// ------ DRAG & DROP -------
	let isDraggingOver = false;
	function dragOverHandler(event: { preventDefault: () => void; }): void {
		event.preventDefault();
		isDraggingOver = true;
	}

	function dragLeaveHandler(event: any): void {
		isDraggingOver = false;
	}

	async function dropHandler(event: { preventDefault: () => void; dataTransfer: { files: any; }; }): Promise<void> {
		event.preventDefault();
		isDraggingOver = false;
		const files = event.dataTransfer.files;
		if (files) {
			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				file_uploads = [
					...file_uploads,
					{
						file: await toBase64(file),
						file_name: file.name,
						id: Date.now() + i, // unique id for each upload
						isNameValid: checkFileName(file.name)
					}
				];
			}
		}
	}

	const toBase64 = (file: File) =>
		new Promise<string>((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = reject;
		});
</script>

<main class="max-w-5xl p-4 mx-auto">
	<!-- Navbar -->
	<nav class="navbar flex bg-base-200 text-neutral-content rounded-box shadow-sm px-5 mb-5">
		<div class="navbar-start"></div>
		<div class="navbar min-h-0 p-0 justify-center items-center">
			<h1 class="text-xl font-semibold text-base-content">Carica i tuoi file</h1>
		</div>
		<div class="navbar-end flex items-center">
			<button
				class="btn btn-square btn-ghost"
				title="Indietro"
				on:click|preventDefault={() => history.back()}
			>
				<span class="text-primary icon-[akar-icons--arrow-back-thick-fill]"></span>
			</button>
		</div>
	</nav>
	<div class="form-control font-semibold m-3">
		<!-- Choose teaching -->
		<label for="repository">Scegli la repository</label>
		<input
			required
			id="repository"
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
			<ul
				class="mt-20 absolute rounded-lg shadow-lg bg-base-100 text-base-content bg-opacity-60 backdrop-blur backdrop-filter w-full max-w-md z-50 max-h-96 overflow-auto"
			>
				{#each filteredTeachings as teaching, index}
					<li
						class="cursor-pointer hover:bg-primary hover:text-base-100 px-4 py-2 {selectedIndex ===
						index
							? 'bg-primary text-base-100'
							: ''}"
					>
						<button
							on:mousedown={() => {
								selectTeaching(teaching, index);
								$search = teaching;
								isOpen = false;
							}}
						>
							{teaching}
						</button>
					</li>
				{/each}
			</ul>
		{/if}
		<br />
		<!-- Choose dir -->
		<label for="select-dir">Scegli la cartella</label>
		<select
			required
			class="select select-primary text-base"
			bind:value={$selectedDir}
			id="select-dir"
		>
			{#each repo as dir}
				<option>{dir}</option>
			{/each}
		</select>
		<br />
		<!-- Drag & drop files -->
		<div
			role="button"
			tabindex="0"
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
							<span
								class="transition hover:transition text-accent hover:text-error icon-[solar--file-smile-bold-duotone] hover:icon-[solar--file-remove-bold-duotone] text-8xl"
							></span>
						</button>
						<div class="flex items-center relative">
							<input
								required
								class="input border-b-accent relative focus:outline-accent {upload.isNameValid
									? 'border-b-success'
									: 'border-b-error border-b-4'} pr-7"
								type="text"
								bind:value={upload.file_name}
								on:input={(event) => handleInputChange(event, upload.id)}
							/>
							<span
								class="absolute right-2 top-1/2 transform -translate-y-1/2 text-lg icon-[akar-icons--pencil]"
							></span>
						</div>
					</div>
				{/each}
			</div>
		{/if}
		<h1>
			<span>* Rinomina eventuali file sottolineati in </span>
			<span class="text-error">rosso</span>
			<span> in kebab-case per velocizzare l'approvazione.</span>
		</h1>
		<button
			class="m-5 flex transition justify-center items-center bg-primary shadow-lg hover:bg-success hover:shadow-success/50 shadow-primary/50 text-white font-bold py-2 px-4 rounded"
			on:click={submit}
			><span class="m-1 text-lg icon-[akar-icons--send]"></span>Crea una Pull Request su GitHub</button
		>
	</div>

	<!-- Modal login -->
	{#if !logged}
		<Login show={logged} />
	{/if}
</main>
