// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // User-site repo (brendanflatley.github.io) serves from the domain root,
  // so no `base` path is needed.
  site: 'https://brendanflatley.github.io',
});
