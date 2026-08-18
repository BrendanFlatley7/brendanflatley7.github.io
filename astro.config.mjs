// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // The account is BrendanFlatley7, so the user site lives at
  // brendanflatley7.github.io. A repo of exactly that name serves from the
  // domain root and needs no `base`.
  site: 'https://brendanflatley7.github.io',
});
