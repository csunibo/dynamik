import type { PageLoad } from './$types';
import TEACHINGS from '../config/courses.json';

export const load = (async () => {
	return {
		courses: TEACHINGS
	};
}) satisfies PageLoad;
