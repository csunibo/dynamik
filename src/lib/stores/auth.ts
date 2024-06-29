import { WHOAMI_URL, LOGOUT_URI } from '$lib/auth';
import { writable } from 'svelte/store';

export const AUTHENTICATED = 'authenticated';
export const UNAUTHENTICATED = 'unauthenticated';

interface AuthenticatedState {
  state: 'authenticated',
  user: Whoami
}

interface UnauthenticatedState {
  state: 'unauthenticated'
}

const defaultState: UnauthenticatedState = {
  state: 'unauthenticated',
};

interface Error {
  error: string
}

interface Whoami {
  username: string
  avatarUrl: string
  name: string
  email: string
  admin: boolean
}

const store = writable<UnauthenticatedState | AuthenticatedState>(defaultState);

export const checkAuth = async () => {
  const req = await fetch(WHOAMI_URL, { credentials: 'include' })
  const res: Whoami | Error = await req.json();
  if (!('error' in res)) {
    const state: AuthenticatedState = {
      state: AUTHENTICATED,
      user: res
    };
    store.set(state);
  }
}

export const logout = async () => {
  await fetch(LOGOUT_URI, { credentials: 'include' })
  store.set(defaultState);
}

export const auth = store;
