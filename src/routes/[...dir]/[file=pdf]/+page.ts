import sha256 from 'sha256';
import type { PageLoad } from './$types';
import { ASSET_URL } from '$lib/const';

export const load = (async ({ fetch, params }) => {
  const path = params.dir + '/' + params.file
  return {
    url: ASSET_URL(path),
    id: sha256(path),
  };
}) satisfies PageLoad;

