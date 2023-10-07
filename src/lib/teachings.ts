import { getManifest } from '$lib/api';
import { filterAsync } from './filter';

export type Teaching = {
	name: string;
	url: string;
	chat?: string;
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

export async function isTeachingActive(fetch: typeof window.fetch, teaching: Teaching) {
	try {
		await getManifest(fetch, teaching.url);
		return true;
	} catch {
		return false;
	}
}

export async function getActiveTeachings(fetch: typeof window.fetch, course: Course) {
	const allTeachings = course.years.flatMap((year) => year.teachings);
	const activeTeachings = await filterAsync(allTeachings, (t) => isTeachingActive(fetch, t));

	return activeTeachings;
}

import TEACHINGS from '../config/courses.json' assert { type: 'json' };
export default TEACHINGS as Course[];
