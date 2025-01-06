import { sveltekit } from '@sveltejs/kit/vite';
import preprocess from 'svelte-preprocess';

export default {
	plugins: [sveltekit()],
	preprocess: preprocess({
		postcss: true,
	}),
	server: {
		fs: {
			allow: ['.'], // Allow serving files from the project root
		},
	},
};
