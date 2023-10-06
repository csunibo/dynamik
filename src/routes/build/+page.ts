import type { PageLoad } from './$types';
import { getActiveCourses } from '$lib/teachings';
import TEACHINGS from '$lib/teachings';

export const load = (async ({ fetch, _ }) => {
	streaming: {
		activeCourses: TEACHINGS.map((c) => getActiveCourses(fetch, c));
	}
}) satisfies PageLoad;
