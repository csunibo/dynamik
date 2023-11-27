import { DEGREES, TEACHINGS } from '$lib/teachings';
import type { PageLoad } from './$types';

export const load = (async () => {
	return {
		degrees: DEGREES,
		teachings: TEACHINGS
	};
}) satisfies PageLoad;
