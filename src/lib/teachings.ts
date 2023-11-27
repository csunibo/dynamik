import { getManifest } from "$lib/api";
import { filterAsync } from "./filter";

export type Teaching = {
  name: string;
  url: string;
  chat?: string;
  optional?: boolean;
  website: string;
  professors: string[];
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
  years?: TeachingYear[];
  chat?: string;
};

export async function isTeachingActive(fetch: typeof window.fetch, teaching: Teaching) {
  try {
    await getManifest(fetch, teaching.url);
    return true;
  } catch {
    return false;
  }
}

export function yearToFlatTeachings(y: Year): Teaching[] {
  let res: Teaching[] = [];
  if (y.mandatory) {
    res += y.mandatory;
  }
  if (y.electives) {
    res += y.electives;
  }
  return res;
}

export async function getActiveTeachings(fetch: typeof window.fetch, course: Degree) {
  const allTeachings = course.years.flatMap(yearToFlatTeachings);
  const activeTeachings = await filterAsync(allTeachings, (t) => isTeachingActive(fetch, t));

  return activeTeachings;
}

// TEACHINGS
import teachingsArray from "../config/teachings.json" assert { type: "json" };

function teachingToIndexedTeaching(t: Teaching): [string, Teaching] {
  return [t.Url, t];
}

const TEACHINGS = new Map<string, Teaching>(teachingsArray.map(teachingToIndexedTeaching));
export { TEACHINGS };

// DEGREES
import DEGREES from "../config/degrees.json" assert { type: "Degree[]" };
export { DEGREES };
