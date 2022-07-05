export enum Teachings {
  LINGUAGGI_DI_PROGRAMMAZIONE = "linguaggi-di-programmazione",
}

export const BASE_URL = `https://csunibo.github.io`;
export const API_URL = (teaching: Teachings) => `${BASE_URL}/${teaching}`;
export const STATIK_URL = (teaching: Teachings, path: string) =>
  `${BASE_URL}/${teaching}${path}${path.endsWith("/") ? "" : "/"}statik.json`;
