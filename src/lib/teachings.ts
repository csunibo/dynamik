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

export async function isTeachingActive(fetch: typeof window.fetch, teaching: Teaching) {
	try {
		await getManifest(fetch, teaching.url);
		return teaching;
	} catch {
		return null;
	}
}

export async function getActiveTeachings(fetch: typeof window.fetch, course: Course) {
	const allTeachings = course.years.flatMap((year: TeachingYear) => year.teachings);
	const promises = allTeachings.map(async (t) => await isTeachingActive(fetch, t));
	return (await Promise.all(promises)).filter((t) => t != null);
}

import TEACHINGS from '../config/courses.json' assert { type: 'json' };
export default TEACHINGS as Course[];
