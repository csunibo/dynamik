const { addDynamicIconSelectors } = require('@iconify/tailwind');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			gridTemplateColumns: {
				dir: 'min-content,auto,min-content',
				'dir-full': 'min-content,auto,min-content,max-content'
			}
		}
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('daisyui'),
		addDynamicIconSelectors()
	],
	daisyui: {
		themes: ['halloween', 'autumn', 'dracula']
	}
};
