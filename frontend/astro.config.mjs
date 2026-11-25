import {defineConfig} from 'astro/config';
import tailwind from '@tailwindcss/vite';

export default defineConfig({
  build: {format: 'file', inlineStylesheets: 'never'},
  compressHTML: false,
  vite: {plugins: [tailwind()]},
});
