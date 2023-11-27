import { getActiveTeachings } from "$lib/teachings";
import { DEGREES } from "$lib/teachings";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const activeTeachings = DEGREES.map((c) => getActiveTeachings(fetch, c));

  return {
    activeTeachings: Promise.all(activeTeachings),
  };
};
