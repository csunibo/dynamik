import { DEGREES } from '$lib/teachings';
import type { PageLoad } from './$types';

export const load = (async () => {
	return {
		degrees: DEGREES
	};
}) satisfies PageLoad;
