import { persisted } from 'svelte-local-storage-store';

export const themes = ['halloween', 'retro'] as const;
type Theme = (typeof themes)[number];


export interface GithubToken{
	token:string;
	expireDate:number;
}

export interface Settings {
	theme: Theme;
	newTab: boolean;
	isoDates: boolean;
	githubToken: GithubToken|undefined;
}

const settings = persisted<Settings>('settings', {
	theme: 'halloween',
	newTab: false,
	isoDates: true,
	githubToken:undefined
});

export default settings;
