import type { PageLoad } from './$types';
import type { Statik } from '$lib/api';
import { STATIK_URL } from '$lib/const';

export const load = (async ({ fetch, params }) => {
	const path = params.dir ? params.dir + '/' + params.zfile : params.zfile;
	const statikUrl = STATIK_URL(path);
	const res = await fetch(statikUrl);
	if (!res.ok) {
		throw new Error(`Failed to load manifest at ${statikUrl}`);
	}
	const manifest: Statik = await res.json();
	return {
		manifest
	};
}) satisfies PageLoad;
