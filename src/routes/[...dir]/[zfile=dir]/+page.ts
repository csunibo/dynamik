import type { PageLoad } from './$types';
import { getManifest, getFuzzy } from '$lib/api';

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
