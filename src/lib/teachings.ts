import type { PageLoad } from './$types';
import { getManifest } from '$lib/api';
import { error } from '@sveltejs/kit';

export type Teaching = {
	name: string;
	url: string;
	telegram?: string;
	optional?: boolean;
};

export type TeachingYear = {
	year: number;
	teachings: Teaching[];
};

export type Course = {
	id: string;
	name: string;
	icon: string;
	years: TeachingYear[];
};

export async function getActiveCourse(fetch: typeof window.fetch, teaching:
  Teaching) {
	try {
		await getManifest(fetch, teaching.url);
		return true;
	} catch {
		return false;
	}
}

export async function getActiveCourses(fetch: typeof window.fetch, course:
  Course) {
	const allTeachings = course.years.flatMap((year: TeachingYear) =>
    year.teachings);
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

import TEACHINGS from '../config/courses.json' assert { type: 'json' };
export default TEACHINGS as Course[];
