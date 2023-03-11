import { persisted } from 'svelte-local-storage-store';

export const themes = ['halloween', 'retro'] as const;
type Theme = (typeof themes)[number];

export interface Settings {
	theme: Theme;
	newTab: boolean;
}

const settings = persisted<Settings>('settings', {
	theme: 'halloween',
	newTab: false
});

export default settings;
