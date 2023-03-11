import type { ParamMatcher } from '@sveltejs/kit';
import { BUNDLED_LANGUAGES } from 'shiki';

const EXTRA_BUNDLED_LANGUAGES = [
	...BUNDLED_LANGUAGES.map((bundle) => [bundle.id, ...(bundle.aliases || [])]).flat(),
	'c++',
	'tsx',
	'jsx',
	'hdl'
];

export const match = ((file) =>
	EXTRA_BUNDLED_LANGUAGES.includes(file.split('.').pop() || '')) satisfies ParamMatcher;
