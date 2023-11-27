import { getFuzzy, getManifest } from '$lib/api';
import { TEACHINGS } from '$lib/teachings';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params, url }) => {
	// Get the relative path using params
	const path = params.dir ? params.dir + '/' + params.zfile : params.zfile;

	// Load the manifest
	const manifest = await getManifest(fetch, path);

	// Load the fuzzy search index
	const fuzzyPath = path.split('/').slice(0, 1).join('/');
	const fuzzy = await getFuzzy(fetch, fuzzyPath);

	const from = url.searchParams.get('from');

	return {
		manifest,
		fuzzy,
		from,
		teachings: TEACHINGS
	};
};
