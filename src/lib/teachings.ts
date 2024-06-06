import { getManifest } from '$lib/api';
import { filterAsync } from './filter';

export type Teaching = {
  name: string;
  url: string;
  chat?: string;
  website?: string;
  professors?: string[];
  degree?: string;
};

export type Year = {
  year: number;
  chat?: string;
};

export type DegreeTeaching = {
  name: string;
  year?: number;
  mandatory: boolean;
};

export type Degree = {
  id: string;
  name: string;
  icon: string;
  teachings?: DegreeTeaching[];
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

export function yearToFlatTeachings(d: Degree, y: number): string[] {
  let res: string[] = [];

  if (d.teachings) {
    d.teachings.forEach((x) => {
      if ((x.year && x.year == y) || (!x.year && y == 0))
        res = res.concat(x.name);
    });
  }

  //if (studyDiagram.mandatory) res = res.concat(studyDiagram.mandatory);
  //if (studyDiagram.electives) res = res.concat(studyDiagram.electives);
  return res;
}

export function allMandatoryTeachingsFromYear(d: Degree, y: number): string[] {
  let res: string[] = [];

  if (d.teachings) {
    d.teachings.forEach((x) => {
      if ((x.year && x.year == y) || (!x.year && y == 0)) {
        if (x.mandatory) {
          res = res.concat(x.name);
        }
      }
    });
  }

  return res;
}

export function allElectivesTeachingsFromYear(d: Degree, y: number): string[] {
  let res: string[] = [];

  if (d.teachings) {
    d.teachings.forEach((x) => {
      if ((x.year && x.year == y) || (!x.year && y == 0)) {
        if (!x.mandatory) {
          res = res.concat(x.name);
        }
      }
    });
  }

  return res;
}

export function allTeachingsMandatoryElectives(d: Degree, mandatory: boolean): string[] {
  let res: string[] = [];
  if (d.teachings) {
    d.teachings.forEach((x) => {
      if (x.mandatory == mandatory) {
        res = res.concat(x.name);
      }
    });
  }
  return res;
}

export function allTeachingsToString(d: Degree): string[] {
  let res: string[] = [];

  if (d.teachings) {
    d.teachings.forEach((x) => (res = res.concat(x.name)));
  }

  return res;
}

export async function getActiveTeachings(
  fetch: typeof window.fetch,
  degree: Degree
): Promise<string[]> {
  const years = degree.years;
  if (!years) return [];
  const allTeachings = allTeachingsToString(degree);
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
import { text } from '@sveltejs/kit';
import { expoOut } from 'svelte/easing';
import { derived } from 'svelte/store';
export { DEGREES };
