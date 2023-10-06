import type { PageLoad } from './$types';
import type { getActiveCourse } from
  '$lib/teachings';
import TEACHINGS from '$lib/teachings';

export const load = (async ({ fetch, params }) =>
	{
		streaming: {
			activeCourses: TEACHINGS.filter(t => getActiveCourse(fetch, t));
		}
	}) satisfies PageLoad;
