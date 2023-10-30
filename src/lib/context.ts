import { writable, type Writable } from 'svelte/store';
import { getContext, setContext } from 'svelte';

type Degree = string;
type Context = Writable<string>;

export let global_deg = writable<Degree>('');

export function initDegree() {
	global_deg = writable<Degree>('');
}

export function setDegree(CdL: string) {
	global_deg = writable<Degree>(CdL);
	setContext('degree', global_deg);
}

export function getDegree() {
	if (global_deg == writable('')) global_deg = getContext<Context>('degree');
	return global_deg;
}
