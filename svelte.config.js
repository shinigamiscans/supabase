import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			fallback: 'index.html', // Use fallback for dynamic routes
		}),
		paths: {
			base: '', // If deploying under a subpath, specify it here
		},
		prerender: {
			entries: [], // Disable automatic prerendering for all routes
		}
	}
};

export default config;
