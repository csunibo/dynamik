import sha256 from 'sha256';
import type { PageLoad } from './$types';
import { ASSET_URL } from '$lib/const';

interface QuestionItem {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  document: string;
  start: number;
  end: number;
}

export const load = (async ({ fetch, params }) => {
  const path = params.dir + '/' + params.file
  const id = sha256(path)

  const res = await fetch(ASSET_URL(params.dir + '/' + id));
  const body: QuestionItem[] = await res.json();
  const QuestionMappedData = body.map(item => ({
    ID: item.ID,
    CreatedAt: item.CreatedAt,
    UpdatedAt: item.UpdatedAt,
    DeletedAt: item.DeletedAt,
    document: item.document,
    start: item.start,
    end: item.end,
  }));

  return {
    QuestionMappedData,
    url: ASSET_URL(path),
    id: id,
  };
}) satisfies PageLoad;


