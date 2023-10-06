import type { PageLoad } from './$types';
import { getActiveTeachings } from '$lib/teachings';
import TEACHINGS from '$lib/teachings';
import { error } from '@sveltejs/kit';

export const load = (async ({ fetch, params }) => {
	const course = TEACHINGS.find((c) => c.id === params.course);

	if (course == null) {
		throw error(404, `Course '${params.course}' not found`);
	}

	// Filter out inactive teachings
	const activeTeachings = getActiveTeachings(fetch, course);

	return {
		course,
		streaming: {
			activeTeachings
		}
	};
}) satisfies PageLoad;
