import type { ParamMatcher } from '@sveltejs/kit';
import { match as generic } from './generic';

export const match = ((path) => !generic(path)) satisfies ParamMatcher;
