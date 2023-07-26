export type Teaching = {
  name: string;
  url: string;
};

export type TeachingYear = {
  year: number;
  teachings: Teaching[];
};

export type Course = {
  id: string;
  name: string;
  icon: string;
  years: TeachingYear[];
};

const TEACHINGS: Course[] = [
  {
    id: 'informatica',
    name: 'Informatica',
    icon: '🧑‍💻',
    years: [
      {
        year: 1,
        teachings: [
          { name: 'Architettura degli elaboratori', url: 'architettura-degli-elaboratori' },
          { name: "Logica per l'informatica", url: 'logica-per-informatica' },
          { name: 'Programmazione', url: 'programmazione' },
          { name: 'Algebra e geometria', url: 'algebra-e-geometria' },
          { name: 'Algoritmi e strutture dati', url: 'algoritmi-e-strutture-di-dati' },
          { name: 'Analisi matematica', url: 'analisi-matematica' }
        ]
      },
      {
        year: 2,
        teachings: [
          { name: 'Calcolo numerico', url: 'calcolo-numerico' },
          { url: 'ottimizzazione-combinatoria', name: 'Ottimizzazione combinatoria' },
          {
            name: 'Calcolo delle probabilità e statistica',
            url: 'calcolo-delle-probabilita-e-statistica'
          },
          { name: 'Tecnologie web', url: 'tecnologie-web' },
          { name: 'Linguaggi di programmazione', url: 'linguaggi-di-programmazione' },
          { name: 'Reti di calcolatori', url: 'reti-di-calcolatori' },
          { name: 'Sistemi operativi', url: 'sistemi-operativi' }
        ]
      },
      {
        year: 3,
        teachings: [
          { name: 'Basi di dati', url: 'basi-di-dati' },
          { name: 'Ingegneria del software', url: 'ingegneria-del-software' },
          {
            name: "Introduzione all'apprendimento automatico",
            url: 'introduzione-apprendimento-automatico'
          },
          { name: 'Fondamenti di cybersecurity', url: 'fondamenti-di-cybersecurity' },
          { name: 'Informatica teorica', url: 'informatica-teorica' }
        ]
      }
    ]
  },
  {
    id: 'ingegneria',
    name: 'Ingegneria Informatica',
    icon: '👨‍🔧',
    years: [
      {
        year: 1,
        teachings: [
          { name: 'Fondamenti di informatica 1', url: 'ing-fondamenti-di-informatica-1-t' },
          { name: 'Analisi 1', url: 'ing-analisi-matematica-1-t' },
          { name: 'Algebra e geometria', url: 'ing-algebra-e-geometria-t' },

          { name: 'Fondamenti di informatica 2', url: 'ing-fondamenti-di-informatica-2-t' },
          { name: 'Analisi 2', url: 'ing-analisi-matematica-2-t' },
          { name: 'Reti logiche', url: 'ing-reti-logiche-t' }
        ]
      },
      {
        year: 2,
        teachings: [
          { name: 'Matematica applicata', url: 'ing-matematica-applicata-t' },
          { name: 'Calcolatori elettronici', url: 'ing-calcolatori-elettronici-t' },
          { name: 'Fisica generale', url: 'ing-fisica-generale-t' },
          { name: 'Sistemi informativi', url: 'ing-sistemi-informativi-t' },

          { name: 'Sistemi operativi', url: 'ing-sistemi-operativi-t' },
          { name: 'Fondamenti di telecomunicazioni', url: 'ing-fondamenti-di-telecomunicazioni-t' },
          {
            name: 'Economia e organizzazione aziendale',
            url: 'ing-economia-e-organizzazione-aziendale-t'
          },
          { name: 'Elettrotecnica', url: 'ing-elettrotecnica-t' }
        ]
      }
    ]
  },
  {
    id: 'informatica-magistrale',
    name: 'Informatica Magistrale',
    icon: '🧑‍🏫',
    years: [
      {
        year: 1,
        teachings: [
          { name: 'Usability e user experience design', url: 'usability-e-user-experience-design' },
          { name: 'Complementi di linguaggi di programmazione', url: 'complementi-di-linguaggi-di-programmazione' },
          { name: 'Complementi di basi di dati', url: 'complementi-di-basi-di-dati' },
          { name: 'Intelligenza artificiale', url: 'intelligenza-artificiale' },
        ]
      }
    ]
  }
];

export default TEACHINGS;

