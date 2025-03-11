import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  base: '/wobbly-nature/',
  plugins: [react()],
  server: {
    port: 2000,
  },
  build: {
    outDir: 'docs',
  },
});
