export interface Statik extends Directory {
  directories?: Directory[];
  files?: File[];
}

export interface Directory {
  name: string;
  path: string;
  size: string;
  time: Date;
  url: string;
}

export interface File {
  mime: string;
  name: string;
  path: string;
  size: string;
  time: Date;
  url: string;
}

export type Fuzzy = FuzzyFile[]

export interface FuzzyFile {
  mime: string;
  name: string;
  path: string;
  url: string;
}
