export type Teaching = {
	name?: string;
	year?: number;
	corso?: string;
	url: string;
};

export type TeachingYear = {
	year: number;
	teachings: Teaching[];
};

export type Course = {
	id: string;
	name: string;
	years: TeachingYear[];
};

const TEACHINGS: Course[] = [
	{
		id: 'informatica',
		name: 'Informatica',
		years: [
			{
				year: 1,
				teachings: [
					{ url: 'algoritmi-e-strutture-di-dati', name: 'Algoritmi e strutture dati' },
					{ url: 'algebra-e-geometria', name: 'Algebra e geometria' },
					{ url: 'programmazione', name: 'Programmazione' },
					{ url: 'analisi-matematica', name: 'Analisi matematica' },
					{ url: 'logica-per-informatica', name: 'Logica per informatica' }
				]
			}
		]
	},
	{
		id: 'ingegneria',
		name: 'Ingegneria Informatica',
		years: [
			{
				year: 1,
				teachings: [
					{ name: 'Fondamenti di informatica 1', url: 'ing-fondamenti-di-informatica-1-t' },
					{ name: 'Analisi 1', url: 'ing-analisi-1-t' },
					{ name: 'Algebra e geometria', url: 'ing-algebra-e-geometria-t' },

					{ name: 'Fondamenti di informatica 2', url: 'ing-fondamenti-di-informatica-2-t' },
					{ name: 'Analisi 2', url: 'ing-analisi-2-t' },
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
	}
];

export default TEACHINGS;
