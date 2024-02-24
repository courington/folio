import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	build: {
		outDir: './docs' // relative to index.html
		// emptyOutDir: true, // true if outDir is inside root. if outDir is not inside root, uncomment this.
	}
});
