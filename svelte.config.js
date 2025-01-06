import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: adapter({
            // Customize routes for Cloudflare
            routes: {
                include: ['/*'], // Include all routes
                exclude: ['<files>', '<prerendered>'], // Exclude static files and prerendered pages from invoking a function
            },
            platformProxy: {
            },
        }),
    },
    preprocess: vitePreprocess(), // Enable modern preprocessing with Vite
    onwarn: (warning, handler) => {
        // Suppress accessibility warnings (optional)
        if (warning.code.startsWith('a11y-')) return;
        handler(warning);
    },
};

export default config;
