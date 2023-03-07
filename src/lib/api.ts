export interface Statik extends Directory {
	directories?: Directory[];
	files?: File[];
}

export interface Directory {
	url: string;
	time: string;
	name: string;
	path: string;
	size: string;
}

export interface File {
	url: string;
	time: string;
	name: string;
	path: string;
	size: string;
	mime: string;
}
