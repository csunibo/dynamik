import { getActiveTeachings } from '$lib/teachings';
import { DEGREES, TEACHINGS } from '$lib/teachings';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, params }) => {
	const degreeParam = params.course,
		degree = DEGREES.find((c) => c.id === degreeParam);

	if (degree == null) {
		throw error(404, `Degree '${degreeParam}' not found`);
	}

	return {
		degree,
		teachings: TEACHINGS,
		streaming: {
			activeTeachings: getActiveTeachings(fetch, degree)
		}
	};
}) satisfies PageLoad;
