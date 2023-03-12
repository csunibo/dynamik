import type { PageLoad } from './$types';
import { ASSET_URL } from '$lib/const';
import { marked } from 'marked';
import type { File, Statik } from '$lib/api';

export const load = (async ({ fetch, params }) => {
	const res = await fetch(ASSET_URL(params.dir + '/' + params.file));
	const body = await res.text();
	const rendered = await marked(body, { async: true });

	const fileInfo: Promise<File> = fetch(ASSET_URL(params.dir + '/statik.json'))
		.then((res) => res.json())
		.then((statik: Statik) => statik.files?.find((file) => file.name === params.file))
		.then((file) => {
			if (file == null) throw new Error(`File not found: ${params.dir}/${params.file}`);
			return file;
		});

	return {
		rendered,
		info: { fileInfo }
	};
}) satisfies PageLoad;
