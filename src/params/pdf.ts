import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param) => /^.+\.pdf$/.test(param)) satisfies ParamMatcher;
