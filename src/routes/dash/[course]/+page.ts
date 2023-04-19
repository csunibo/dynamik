import type { PageLoad } from './$types';
import TEACHINGS, { type Course, type Teaching, type TeachingYear } from '$lib/teachings';
import { getManifest } from '$lib/api';

async function getActiveCourses(fetch: typeof window.fetch, course: Course) {
	const activeTeachings: Teaching[] = [];
	for (const year of course.years) {
		for (const teaching of year.teachings) {
			try {
				await getManifest(fetch, teaching.url);
				activeTeachings.push(teaching);
			} catch {
				// Do nothing
			}
		}
	}

	return activeTeachings;
}

export const load = (async ({ fetch, params }) => {
	const course = TEACHINGS.find((c) => c.id === params.course);

	if (!course) {
		return { course: null };
	}

	// Filter out inactive teachings
	const activeCourses = getActiveCourses(fetch, course);

	return {
		course,
		streaming: {
			activeCourses
		}
	};
}) satisfies PageLoad;
