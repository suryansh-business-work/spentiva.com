import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5000,
    host: true
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
