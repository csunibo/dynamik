import type { PageLoad } from './$types';
import { ASSET_URL } from '$lib/const';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import type { File, Statik } from '$lib/api';

export const load = (async ({ fetch, params }) => {
	const fileContentReq = await fetch(ASSET_URL(params.dir + '/' + params.file));
	const fileContent = await fileContentReq.text();
	const mdRendered = await marked(fileContent, { async: true });
	const mdClean = DOMPurify.sanitize(mdRendered);

	const fileInfo: Promise<File> = fetch(ASSET_URL(params.dir + '/statik.json'))
		.then((res) => res.json())
		.then((statik: Statik) => statik.files?.find((file) => file.name === params.file))
		.then((file) => {
			if (file == null) throw new Error(`File not found: ${params.dir}/${params.file}`);
			return file;
		});

	return {
		rendered: mdClean,
		info: { fileInfo }
	};
}) satisfies PageLoad;
