import type { ParamMatcher } from '@sveltejs/kit';
import { bundledLanguagesInfo } from 'shiki/langs';

const IGNORED_LANGUAGES = ['md', 'html'];

const EXTRA_BUNDLED_LANGUAGES = [
	...bundledLanguagesInfo.map((info) => [info.id, ...(info.aliases || [])]).flat(),
	'txt',
	'c++',
	'tsx',
	'jsx',
	'hdl'
];

export const match = ((file) => {
	const ext = file.split('.').pop() || '';
	return (
		/\./g.test(file) && EXTRA_BUNDLED_LANGUAGES.includes(ext) && !IGNORED_LANGUAGES.includes(ext)
	);
}) satisfies ParamMatcher;
