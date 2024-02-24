import sha256 from 'sha256';
import type { PageLoad } from './$types';
import { ASSET_URL, DOCUMENT_URL } from '$lib/const';
import type { Document, Question } from '$lib/polleg';

export const load = (async ({ fetch, params }) => {
  const path = params.dir + '/' + params.file
  const id = sha256(path)

  const res = await fetch(DOCUMENT_URL(id), {});

  let questions: Question[] = []
  const body: Document | { error: string } = await res.json();
  if (!(body as { error: string }).error) {
    questions = (body as Document).questions;
  }

  return {
    url: ASSET_URL(path),
    id: id,
    questions,
  };
}) satisfies PageLoad;
