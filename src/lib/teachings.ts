export type Teaching = {
	name: string;
	url: string;
	telegram: string;
	optional: boolean;
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

import TEACHINGS from '../config/courses.json' assert { type: 'json' };
export default TEACHINGS as Course[];
