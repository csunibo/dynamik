import { persisted } from 'svelte-local-storage-store';
import type { Degree } from './teachings';

const UPDL_URL = import.meta.env.VITE_UPLD_URL;

if (UPDL_URL == null) {
	throw new Error('Missing VITE_UPLD_URL');
}

export function getLoginUrl(redirectUrl: string | URL): string {
	return `${UPDL_URL}/login?redirect_uri=${redirectUrl}`;
}

export async function getWhoAmI(fetch: typeof window.fetch) {
	const res = await fetch(`${UPDL_URL}/whoami`, { credentials: 'include' });

	return res.json();
}

export interface Upload {
	repo: string;
	dir: string;
	file_name: string[];
	file: string[];
}
const UPLD = persisted<Upload>('upload', {
	repo: '',
	dir: '',
	file_name: [],
	file: []
});

export default UPLD;
