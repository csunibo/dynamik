import type { PageLoad } from './$types';
import type { Fuzzy, Statik } from '$lib/api';
import { FUZZY_URL, STATIK_URL } from '$lib/const';

async function getManifest(fetch: typeof window.fetch, path: string): Promise<Statik> {
	const res = await fetch(STATIK_URL(path));
	if (!res.ok) {
		throw new Error(`Failed to load manifest at ${STATIK_URL(path)}`);
	}
	const manifest: Statik = await res.json();
	return manifest;
}

async function getFuzzy(fetch: typeof window.fetch, path: string): Promise<Fuzzy> {
	const res = await fetch(FUZZY_URL(path));
	if (!res.ok) {
		console.error(`Failed to load fuzzy at ${FUZZY_URL(path)}`);
		return [];
	}
	return await res.json();
}

export const load = (async ({ fetch, params }) => {
	// Get the relative path using params
	const path = params.dir ? params.dir + '/' + params.zfile : params.zfile;

	// Load the manifest
	const manifest = await getManifest(fetch, path);

	// Load the fuzzy search index
	const fuzzyPath = path.split('/').slice(0, 1).join('/');
	const fuzzy = await getFuzzy(fetch, fuzzyPath);

	return {
		manifest,
		fuzzy
	};
}) satisfies PageLoad;
