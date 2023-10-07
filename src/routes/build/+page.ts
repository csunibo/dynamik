import type { PageLoad } from './$types';
import { getActiveTeachings } from '$lib/teachings';
import TEACHINGS from '$lib/teachings';

export const load: PageLoad = async ({ fetch, _ }) => ({
	activeTeachings: Promise.all(TEACHINGS.map((c) => getActiveTeachings(fetch, c)))
});
