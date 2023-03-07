import type { PageLoad } from './$types';
import type { Statik } from '$lib/api';

export const load = (async ({ fetch, params }) => {
	const res = await fetch(
		'https://csunibo.github.io/logica-per-informatica/' + params.dir + '/statik.json'
	);
	const manifest: Statik = await res.json();
	return {
		manifest
	};
}) satisfies PageLoad;
