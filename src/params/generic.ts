import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((path) => {
  return /^.+\.[a-z0-9]+$/.test(path.split('/').pop() || "");
}) satisfies ParamMatcher;
