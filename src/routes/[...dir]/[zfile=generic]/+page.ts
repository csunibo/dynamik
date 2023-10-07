import type { PageLoad } from './$types';
import { ASSET_URL } from '$lib/const';

export const load: PageLoad = async ({ params }) => {
	const fileUrl = ASSET_URL(params.dir + '/' + params.zfile);

	return {
		url: fileUrl
	};
};
