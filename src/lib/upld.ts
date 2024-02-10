import { persisted } from 'svelte-local-storage-store';
import type { Degree } from './teachings';

const UPDL_URL = import.meta.env.VITE_UPLD_URL;

const CSGITBOT_URL = 'https://csgitbot.students.cs.unibo.it';

export interface createFileReturn {
    branch_name: string
    detail: string
}

export interface oAuthResponse {
    access_token: string;
    username: string;
    email: string;
    expiration: Date;
}

/// Just used to set the cookie to the client
export const apiGetCredentials = async (code: string) => {
    // For credentials see https://stackoverflow.com/questions/22432616/why-is-the-browser-not-setting-cookies-after-an-ajax-request-returns
    const res = await fetch(`${CSGITBOT_URL}/oauth/redirect?code=${code}`, {
        method: 'GET',
        credentials: 'include'
    });

    return res.json();
}

export const apiCreateFilesAndPush = async (repo: string, path :string, files: File[]): Promise<createFileReturn> => {
    let data = new FormData();
    data.append('repository', repo);
    data.append('path', path);
    files.forEach((file) => {
        data.append('files', file);
    });

    const res = await fetch(`${CSGITBOT_URL}/api/uploadfiles`, {
        method: 'POST',
        body: data,
        credentials: 'include' 
    });

    return res.json();
}

export const apiCreatePR = async (repo: string, branch_name: string, title: string): Promise<string> => {
    let params = new URLSearchParams();

    params.append('repository', repo);
    params.append('branch_name', branch_name);
    params.append('title', title);

    const res = await fetch(`${CSGITBOT_URL}/api/create-pr`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        credentials: 'include',
        body: params.toString()
    });

    return res.text();
}

// LEGACY UPLD down here

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
