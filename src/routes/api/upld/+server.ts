import { error } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */

// TODO: sostituire con UPLD url.
const backendBase = 'http://130.136.3.76:8000';

const backend = `${backendBase}/oauth/redirect?code=`;

interface oAuthResponse {
	access_token: string;
	username: string;
	email: string;
	jwt_token: string;
}

// https://www.30secondsofcode.org/js/s/parse-or-serialize-cookie/
const parseCookie = (str: string) =>
	str
		.split(';')
		.map((v) => v.split('='))
		.reduce(
			(acc, v) => {
				if (v.length < 2) return acc;
				acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
				return acc;
			},
			{} as Record<string, string>
		);

// {"access_token":"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","username":"ali-benny","email":"alice17bee@gmail.com"}
export async function GET({ url }) {
	const code = url.searchParams.get('code');
	const backendUrl = `${backend}${code}`;

	// make a get request to the backend
	const response = await fetch(backendUrl);
	const cookie = response.headers.get('set-cookie');
	// parse cookie into dict
	const data = await response.json();
	const cookieDict = parseCookie(cookie as string);

	const headers = {
		'set-cookie': `yourCookieName=${cookieDict['access_token']}; HttpOnly`,
		Location: '/upld/end'
	};

	return new Response(null, {
		status: 302, // or 301 for a permanent redirect
		headers: headers
	});

	// TODO: pensare a come rispondere e settare la roba nel frontend (dico accessToken).

	const min = Number(url.searchParams.get('min') ?? '0');
	const max = Number(url.searchParams.get('max') ?? '1');
	const d = max - min;
	if (isNaN(d) || d < 0) {
		error(400, 'min and max must be numbers, and min must be less than max');
	}
	const random = min + Math.random() * d;
	return new Response(String(random));
}
// in base a 130.136... devo abilitare le richieste cors
// const express = require('express');
// const cors = require('cors');

// const app = express();

// // Abilita CORS per tutte le richieste
// app.use(cors());

// // Il tuo codice qui...

// app.listen(8000, () => {
// 	console.log('Server listening on port 8000');
// });