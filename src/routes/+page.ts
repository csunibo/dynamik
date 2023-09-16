import TEACHINGS from '$lib/teachings';
import type { PageLoad } from './$types';

export const load = (async () => {
	console.debug(TEACHINGS)
	return {
		courses: TEACHINGS
	};
}) satisfies PageLoad;
