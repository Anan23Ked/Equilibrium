import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
const r = (p) => resolve(fileURLToPath(new URL('.', import.meta.url)), p);

export default defineConfig({
  root: 'client',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: r('client/index.html'),
        about: r('client/about.html'),
        timeline: r('client/timeline.html'),
        country: r('client/country.html'),
      },
    },
  },
});