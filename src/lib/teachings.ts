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



import * as TEACHINGS from "../../config/courses.json" assert { type: "json" };
export default TEACHINGS as Course[];
