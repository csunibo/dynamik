import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((file) => {
	return /^.+\.[a-z0-9]+$/.test(file);
}) satisfies ParamMatcher;
