import type { PageLoad } from './$types';
import TEACHINGS, { type Course, type Teaching, type TeachingYear } from '$lib/teachings';
import { getManifest } from '$lib/api';

async function getActiveCourse(fetch: typeof window.fetch, teaching: Teaching) {
	try {
		await getManifest(fetch, teaching.url);
		return true;
	} catch {
		return false;
	}
}

async function getActiveCourses(fetch: typeof window.fetch, course: Course) {
	const allTeachings = course.years.flatMap((year: TeachingYear) => year.teachings);
	const activeTeachings: Teaching[] = [];

	const promises = allTeachings.map(async (teaching: Teaching) => {
		const isActive = await getActiveCourse(fetch, teaching);
		if (isActive) {
			activeTeachings.push(teaching);
		}
	});

	await Promise.allSettled(promises);

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
