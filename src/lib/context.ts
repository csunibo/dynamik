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
	//! così funziona anche se in realtà il modo corretto di farlo sarebbe senza l'if: 
	// il problema è che se non c'è nessun context con chiave 'degree' getContext restituisce undefined e quindi non abbiamo alcun corso, anche se in realtà era stato settato
	return global_deg;
}
