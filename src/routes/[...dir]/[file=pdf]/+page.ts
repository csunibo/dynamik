import sha256 from 'sha256';
import type { PageLoad } from './$types';
import { ASSET_URL } from '$lib/const';

interface Question {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  document: string;
  start: number;
  end: number;
}

interface Document {
  id: string;
  questions: Question[];
  url: string;
}

export const load = (async ({ fetch, params }) => {
  const path = params.dir + '/' + params.file
  const id = sha256(path)

  const res = await fetch(`http://localhost:3000/documents/${id}`, {
    credentials: 'include'
  });

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


