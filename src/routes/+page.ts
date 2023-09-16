import TEACHINGS from '$lib/teachings';
import type { PageLoad } from './$types';

export const load = (async () => {
	return {
		courses: TEACHINGS
	};
}) satisfies PageLoad;
