import sha256 from 'sha256';
import type { PageLoad } from './$types';
import { ASSET_URL, DOCUMENT_URL, GH_PAGES_BASE_URL } from '$lib/const';
import type { Document, Question } from '$lib/polleg';
import { toast } from '@zerodevx/svelte-toast';

export const load = (async ({ fetch, params }) => {
	const filePath = params.dir + '/' + params.file;

	// If the file is an exam, fetch the questions' document and load polleg
	if (params.file.includes('testo')) {
		const GHFileUrl = GH_PAGES_BASE_URL + '/' + filePath;
		const res = await fetch(GHFileUrl, {});

		if (res.status == 200) {
			const id = sha256(filePath);

			const res = await fetch(DOCUMENT_URL(id), {});

			let questions: Question[] = [];
			const body: Document | { error: string } = await res.json();
			if (!(body as { error: string }).error) {
				// set the questions if it's not an error
				questions = (body as Document).questions;
			} else {
				toast.push('Error: question not fetched', {
					theme: {
						'--toastColor': 'mintcream',
						'--toastBackground': 'rgba(244,67,54,0.9)',
						'--toastBarBackground': '#e74c3c'
					}
				});
			}

			return {
				url: ASSET_URL(filePath),
				id: id,
				questions,
				isExam: true
			};
		}
	}

	return {
		url: ASSET_URL(filePath),
		isExam: false
	};
}) satisfies PageLoad;
