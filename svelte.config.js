import staticAdapter from '@sveltejs/adapter-static';
import vercelAdapter from '@sveltejs/adapter-vercel';
import nodeAdapter from '@sveltejs/adapter-node';

import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const BASE_PATH = process.env.BASE_PATH || '';
const GITHUB_PAGES = process.env.GITHUB_ACTIONS === 'true';
const CSUNIBO_DEPLOY = process.env.CSUNIBO_DEPLOY === 'true';

/**
 *
 * @returns {import('@sveltejs/kit').Adapter}
 */
function chooseAdapter() {
	if (GITHUB_PAGES) {
		return staticAdapter({ fallback: '404.html' });
	} else if (CSUNIBO_DEPLOY) {
		return nodeAdapter();
	} else {
		return vercelAdapter();
	}
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: chooseAdapter(),
		paths: {
			base: BASE_PATH == '' ? '' : `/${BASE_PATH}`
		}
	}
};

export default config;
