const ORG = 'csunibo';
export const RISORSE_BASE_URL =
  process.env.VITE_RISORSE_BASE_URL || 'https://risorse.students.cs.unibo.it';
export const GH_PAGES_BASE_URL = `https://${ORG}.github.io`;
const GH_BASE_URL = `https://github.com/${ORG}`;
const GH_DEV_BASE_URL = `https://github.dev/${ORG}`;
export const STATIK_URL = (path: string) => `${GH_PAGES_BASE_URL}/${path}/statik.json`;
export const ASSET_URL = (path: string) => `${GH_PAGES_BASE_URL}/${path}`;
export const FUZZY_URL = (path: string) => `${GH_PAGES_BASE_URL}/${path}/fuzzy.json`;
export const EDIT_URLS = (path: string) => {
  const [, repo, ...rest] = path.split('/');
  const filePath = rest.join('/');
  return {
    github: `${GH_BASE_URL}/${repo}/blob/main/${filePath}`,
    github_repo: `${GH_BASE_URL}/${repo}`,
    github_edit: `${GH_BASE_URL}/${repo}/edit/main/${filePath}`,
    github_dev: `${GH_DEV_BASE_URL}/${repo}/blob/main/${filePath}`
  };
};
export const MAX_YEARS_FOR_DEGREE = 3;


// const POLLEG_BASE_URL = 'https://polleg.students.cs.unibo.it`'
const POLLEG_BASE_URL = 'http://localhost:3000';
export const DOCUMENT_URL = (id: string) => `${POLLEG_BASE_URL}/documents/${id}`;
export const QUESTION_URL = (id: number) => `${POLLEG_BASE_URL}/questions/${id}`;
