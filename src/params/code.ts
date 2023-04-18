import type { ParamMatcher } from '@sveltejs/kit';
import { BUNDLED_LANGUAGES } from 'shiki';

const IGNORED_LANGUAGES = ['md', 'html'];

const EXTRA_BUNDLED_LANGUAGES = [
	...BUNDLED_LANGUAGES.map((bundle) => [bundle.id, ...(bundle.aliases || [])]).flat(),
	'txt',
	'c++',
	'tsx',
	'jsx',
	'hdl'
];

export const match = ((file) => {
	const ext = file.split('.').pop() || '';
	return EXTRA_BUNDLED_LANGUAGES.includes(ext) && !IGNORED_LANGUAGES.includes(ext);
}) satisfies ParamMatcher;
