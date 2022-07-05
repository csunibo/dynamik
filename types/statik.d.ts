declare module "statik" {
  export interface Directory {
    directories?: Directory[];
    files?: File[];
    name: string;
    path: string;
    size: string;
    time: Date;
    url: string;
  }

  export interface FuzzyFile {
    mime: string;
    name: string;
    path: string;
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
}
