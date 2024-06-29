export const AUTH_BASE_URL =
  import.meta.env.VITE_AUTH_BASE_URL || 'http://cslogin.students.cs.unibo.it';

export const LOGIN_URL = (current_uri: string) =>
  `${AUTH_BASE_URL}/login?redirect_uri=${current_uri}`;
export const WHOAMI_URL = `${AUTH_BASE_URL}/whoami`;
export const LOGOUT_URI = `${AUTH_BASE_URL}/logout`;
