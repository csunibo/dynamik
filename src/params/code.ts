import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((file) => {
  // TODO
  return /^.+\.(c|cpp|ts(x)|js(x))$/.test(file);
}) satisfies ParamMatcher;
