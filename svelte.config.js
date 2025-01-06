import adapter from '@sveltejs/adapter-cloudflare';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(), // Use Cloudflare adapter
		paths: {
			base: '', // Base path for deployment
		},
		prerender: {
			entries: [] // Disable prerendering to ensure Cloudflare handles all requests dynamically
		}
	},
	preprocess: preprocess({
		postcss: true,
	}),
};

export default config;
