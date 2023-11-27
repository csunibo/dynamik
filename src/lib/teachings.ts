import { getManifest } from '$lib/api';
import { filterAsync } from './filter';

export type Teaching = {
	name: string;
	url: string;
	chat?: string;
	optional?: boolean;
	website?: string;
	professors?: string[];
	degree?: string;
};

export type YearStudyDiagram = {
	mandatory?: string[];
	electives?: string[];
};

export type Year = {
	year: number;
	chat?: string;
	teachings: YearStudyDiagram;
};

export type Degree = {
	id: string;
	name: string;
	icon: string;
	years?: Year[];
	chat?: string;
};

async function isTeachingActiveFromName(fetch: typeof window.fetch, teaching: string) {
	try {
		await getManifest(fetch, teaching);
		return true;
	} catch {
		return false;
	}
}

export async function isTeachingActive(fetch: typeof window.fetch, teaching: Teaching) {
	return isTeachingActiveFromName(fetch, teaching.url);
}

export function yearToFlatTeachings(y: Year): string[] {
	let res: string[] = [];
	const studyDiagram = y.teachings;
	if (studyDiagram.mandatory) res = res.concat(studyDiagram.mandatory);
	if (studyDiagram.electives) res = res.concat(studyDiagram.electives);
	return res;
}

export async function getActiveTeachings(
	fetch: typeof window.fetch,
	degree: Degree
): Promise<string[]> {
	const years = degree.years;
	if (!years) return [];
	const allTeachings = years.flatMap(yearToFlatTeachings);
	const activeTeachings = await filterAsync(allTeachings, (t) =>
		isTeachingActiveFromName(fetch, t)
	);

	return activeTeachings;
}

// TEACHINGS
import teachingsArray from '../config/teachings.json' assert { type: 'json' };

function teachingToIndexedTeaching(t: Teaching): [string, Teaching] {
	return [t.url, t];
}

const TEACHINGS = new Map<string, Teaching>(teachingsArray.map(teachingToIndexedTeaching));
export { TEACHINGS };

// DEGREES
import DEGREES from '../config/degrees.json' assert { type: 'Degree[]' };
export { DEGREES };
