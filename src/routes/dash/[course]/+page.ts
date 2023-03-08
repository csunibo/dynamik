import type { PageLoad } from './$types';
import TEACHINGS from '$lib/teachings';

export const load = (async ({ params }) => {
	const course = TEACHINGS.find((c) => c.id === params.course);

	if (!course) {
		return { course: null };
	}

	return {
		course
	};
}) satisfies PageLoad;
