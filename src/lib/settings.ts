import { persisted } from 'svelte-local-storage-store';
import type TEACHINGS from '$lib/teachings';

export const themes = ['halloween', 'autumn', 'dracula', 'csunibo_light', 'csunibo_dark'] as const;
type Theme = (typeof themes)[number];

export const DEFAULT_COURSE_KEY = 'default';

export interface Settings {
	theme: Theme;
	newTab: boolean;
	isoDates: boolean;
	defaultCourse: (typeof TEACHINGS)[number]['id'] | typeof DEFAULT_COURSE_KEY;
}

const settings = persisted<Settings>('settings', {
	theme: 'csunibo_dark',
	newTab: false,
	defaultCourse: DEFAULT_COURSE_KEY
	isoDates: false
});

export default settings;
