import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param) => /^.+\.(asciidoc|adoc)$/.test(param)) satisfies ParamMatcher;
