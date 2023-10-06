import type { PageLoad } from './$types';
import { getActiveTeachings } from '$lib/teachings';
import TEACHINGS from '$lib/teachings';

export const load: PageLoad = async ({ fetch }) => {
	const activeTeachings = TEACHINGS.map((c) => getActiveTeachings(fetch, c));

	return {
		activeTeachings: Promise.all(activeTeachings)
	};
};
