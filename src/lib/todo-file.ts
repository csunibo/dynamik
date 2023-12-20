import { writable } from 'svelte/store';

function createLocalStorageStore(key: string, startValue: boolean) {
	const { subscribe, set, update } = writable(startValue);

	return {
		subscribe,
		set: (value: boolean) => {
			// Fix: Change the parameter type to boolean
			localStorage.setItem(key, value.toString()); // Convert boolean value to string before storing in localStorage
			set(value);
		},
		update,
		remove: () => {
			localStorage.removeItem(key);
			set(startValue);
		}
	};
}

export const doneStatusPage = createLocalStorageStore('doneStatusPage', false);

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
