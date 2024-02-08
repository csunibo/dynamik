import { error } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */

// TODO: sostituire con UPLD url.



export async function GET({ url }) {
	// const code = url.searchParams.get('code');
	// const backendUrl = `${backend}${code}`;

	// // make a get request to the backend
	// const response = await fetch(backendUrl);
	// const cookie = response.headers.get('set-cookie');
	// // parse cookie into dict
	// const data = await response.json();
	// const cookieDict = parseCookie(cookie as string);

	// const headers = {
	// 	'set-cookie': `yourCookieName=${cookieDict['access_token']}; HttpOnly`,
	// 	Location: '/upld/end'
	// };

	// return new Response(null, {
	// 	status: 302, // or 301 for a permanent redirect
	// 	headers: headers
	// });

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
