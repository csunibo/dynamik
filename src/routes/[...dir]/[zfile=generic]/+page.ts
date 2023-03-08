import type { PageLoad } from './$types';
import { ASSET_URL } from '$lib/const';

export const load = (async ({ params }) => {
  const url = ASSET_URL(params.dir + '/' + params.zfile);

  return {
    url
  };
}) satisfies PageLoad;
