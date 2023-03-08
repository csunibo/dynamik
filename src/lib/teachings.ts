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
					{ name: 'Analisi 1', url: 'ing-analisi-1-t' },
					{ name: 'Algebra e geometria', url: 'ing-algebra-e-geometria-t' },
					{ name: 'Fondamenti di informatica 1', url: 'ing-fondamenti-di-informatica-1-t' },
					{ name: 'Analisi 2', url: 'ing-analisi-2-t' },
					{ name: 'Fondamenti di informatica 2', url: 'ing-fondamenti-di-informatica-2-t' }
				]
			}
		]
	}
];

export default TEACHINGS;
