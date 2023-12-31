import { persisted } from 'svelte-local-storage-store';
import { get } from 'svelte/store';

export interface ToDo {
	status: 'done' | 'not done';
	fileName: string;
}

export const doneStatusPage: ToDo[] = [];
export const doneFiles = persisted<ToDo[]>('doneFiles', []);

export function getDoneStatus(fileName: string) {
	const doneFilesValue = get(doneFiles);
	return doneFilesValue.some((file) => file.fileName === fileName && file.status === 'done');
}

export function getDoneStatusPage(base: string) {
	const donePage = get(doneFiles);
	return (
		donePage.some((file) => file.fileName.startsWith(base) && file.status === 'done') ||
		doneStatusPage.some((file) => file.fileName === base && file.status === 'done')
	);
}

function setDoneStatusPage(doneStatus: boolean, page: string) {
	const index = doneStatusPage.findIndex((name) => name.fileName.startsWith(page));
	if (index !== -1) {
		doneStatusPage[index].status = doneStatus ? 'done' : 'not done';
	} else {
		doneStatusPage.push({ status: doneStatus ? 'done' : 'not done', fileName: page });
	}
}

export function toggleDone(fileName: string, isDone: boolean, page: string) {
	isDone = !isDone;
	const doneFilesValue = get(doneFiles);
	const fileIndex = doneFilesValue.findIndex((file) => file.fileName === fileName);
	if (fileIndex !== -1) {
		doneFilesValue[fileIndex].status = isDone ? 'done' : 'not done';
	} else {
		doneFilesValue.push({ status: isDone ? 'done' : 'not done', fileName: fileName });
	}
	setDoneStatusPage(isDone, page);
	doneFiles.set(doneFilesValue);
	return isDone;
}

export function cleanDonePage(page: string) {
	let doneFilesValue = get(doneFiles);
	doneFilesValue = doneFilesValue.map((file) => {
		if (file.fileName.startsWith(page)) {
			return { ...file, status: 'not done' };
		}
		return file;
	});
	doneFiles.set(doneFilesValue);
	console.log('clean!');
	setDoneStatusPage(false, page);
}
