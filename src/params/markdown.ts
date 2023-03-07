import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param) => {
    console.debug('markdown.ts: match() called with param: ' + param);
  return /^.+\.md$/.test(param);
}) satisfies ParamMatcher;
