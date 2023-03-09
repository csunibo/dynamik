import type { PageLoad } from './$types';
import { ASSET_URL } from '$lib/const';
import { marked } from 'marked';

export const load = (async ({ fetch, params }) => {
	const res = await fetch(ASSET_URL(params.dir + '/' + params.file));
	const body = await res.text();
	const rendered = await marked(body, { async: true });

	return {
		rendered
	};
}) satisfies PageLoad;
