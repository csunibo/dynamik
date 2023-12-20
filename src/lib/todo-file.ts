import { persisted } from 'svelte-local-storage-store';

export const doneStatusPage = persisted<boolean>('doneStatusPage', false);

// done file status
export function getDoneStatus(fileName: string) {
	return localStorage.getItem(fileName) === 'done';
}
export function getDoneStatusPage(base: string) {
	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (key && key.startsWith(base)) {
			doneStatusPage.set(true);
			return true;
		}
	}
	return false;
}

export function toggleDone(data: string, isDone: boolean) {
	isDone = !isDone;
	localStorage.setItem(data, isDone ? 'done' : 'not done');
	getDoneStatusPage(data);
}

export function cleanDonePage(page: string) {
	for (let i = localStorage.length - 1; i >= 0; i--) {
		const key = localStorage.key(i);
		if (key && key.startsWith(page) && localStorage.getItem(key) === 'done') {
			localStorage.removeItem(key);
		}
	}
	doneStatusPage.set(false);
}
