import swr from "swr";

export enum Teachings {
  ALGORITMI_E_STRUTTURE_DI_DATI = "algoritmi-e-strutture-di-dati",
  ALGEBRA_E_GEOMETRIA = "algebra-e-geometria",
  PROGRAMMAZIONE = "programmazione",
  ANALISI_MATEMATICA = "analisi-matematica",
  LOGICA_PER_INFORMATICA = "logica-per-informatica",
  LINGUAGGI_DI_PROGRAMMAZIONE = "linguaggi-di-programmazione",
  SISTEMI_OPERATIVI = "sistemi-operativi",
  RETI_DI_CALCOLATORI = "reti-di-calcolatori",
  CALCOLO_DELLE_PROBABILITA_E_STATISTICA = "calcolo-delle-probabilita-e-statistica",
  TECNOLOGIE_WEB = "tecnologie-web",
  OTTIMIZZAZIONE_COMBINATORIA = "ottimizzazione-combinatoria",
}

export const BASE_URL = `https://csunibo.github.io`;
export const API_URL = (teaching: Teachings) => `${BASE_URL}/${teaching}`;
export const STATIK_URL = (teaching: Teachings, path: string) =>
  `${BASE_URL}/${teaching}${path}${path.endsWith("/") ? "" : "/"}statik.json`;
export const FUZZY_URL = (teaching: Teachings) =>
  `${BASE_URL}/${teaching}/fuzzy.json`;

const fetcher = (url: string) => fetch(url).then((r) => r.json());
export const useSWR = <T>(url: string | null) =>
  swr<T>(url, fetcher, {
    suspense: true,
  });
