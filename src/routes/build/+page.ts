import { getActiveTeachings } from '$lib/teachings';
import { DEGREES, TEACHINGS } from '$lib/teachings';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const activeTeachings = DEGREES.map((c) => getActiveTeachings(fetch, c));

	return {
		activeTeachings: await Promise.all(activeTeachings),
		degrees: DEGREES,
		teachings: TEACHINGS
	};
};
