import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param) => /^.+\.md$/.test(param)) satisfies ParamMatcher;
