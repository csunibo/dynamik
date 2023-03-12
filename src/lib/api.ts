export interface Statik extends Directory {
	directories?: Directory[];
	files?: File[];
}

export interface Directory {
	name: string;
	path: string;
	size: string;
	time: string;
	url: string;
}

export interface File extends Directory {
	mime: string;
}

export type Fuzzy = FuzzyFile[];

export interface FuzzyFile {
	mime: string;
	name: string;
	path: string;
	url: string;
}
