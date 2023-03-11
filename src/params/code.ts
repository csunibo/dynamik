import type { ParamMatcher } from '@sveltejs/kit';
import { BUNDLED_LANGUAGES } from 'shiki';

const EXTRA_BUNDLED_LANGUAGES = [
  ...BUNDLED_LANGUAGES.map((bundle) => [bundle.id, ...(bundle.aliases || [])]).flat(),
  'txt',
  'c++',
  'tsx',
  'jsx',
  'hdl'
].filter((lang) => lang != 'md');

export const match = ((file) =>
  EXTRA_BUNDLED_LANGUAGES.includes(file.split('.').pop() || '')) satisfies ParamMatcher;
