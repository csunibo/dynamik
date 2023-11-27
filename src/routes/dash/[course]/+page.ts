import { getActiveTeachings } from '$lib/teachings';
import { DEGREES, TEACHINGS } from '$lib/teachings';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, params }) => {
	const course = DEGREES.find((c) => c.id === params.course);

	if (course == null) {
		throw error(404, `Course '${params.course}' not found`);
	}

	// Filter out inactive teachings
	const activeCourses = getActiveTeachings(fetch, course);

	return {
		course,
		streaming: {
			activeTeachings: activeCourses,
			teachings: TEACHINGS
		}
	};
}) satisfies PageLoad;
