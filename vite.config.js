import { sveltekit } from '@sveltejs/kit/vite';

export default {
	plugins: [sveltekit()],
	server: {
		fs: {
			allow: ['.'], // Allow serving files from the project root
		},
	},
};
