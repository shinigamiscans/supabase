import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			// SPA-specific options
			pages: 'build', // Output directory for static files
			assets: 'build', // Directory for static assets
			fallback: 'index.html', // Use fallback for SPA behavior
			precompress: false // Optional: Disable precompression
		}),
		paths: {
			base: '', // Base path, leave empty for Cloudflare Pages
		},
		prerender: {
			entries: [] // Ensure no routes are pre-rendered
		}
	}
};

export default config;
