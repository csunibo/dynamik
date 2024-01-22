import { persisted } from 'svelte-local-storage-store';
import { derived } from 'svelte/store';

export const doneFiles = persisted<Record<string, boolean>>('doneFiles', {});

export const getDoneStatus = (fileUrl: string) => {
	const store = derived(doneFiles, ($doneFiles) => $doneFiles[fileUrl] ?? false);
	return {
		...store,

		set: (value: boolean) => {
			doneFiles.update((doneFiles) => ({ ...doneFiles, [fileUrl]: value }));
		},

		toggle: () => {
			doneFiles.update((doneFiles) => ({ ...doneFiles, [fileUrl]: !doneFiles[fileUrl] }));
		}
	};
};

export const anyFileDone = (fileUrls: string[]) => {
	return derived(doneFiles, ($doneFiles) =>
		fileUrls.some((fileUrl) => $doneFiles[fileUrl] ?? false)
	);
};
