import solid from "solid-start/vite";
import { defineConfig } from "vite";

const MINIFY = process.env.NODE_ENV === 'production';

export default defineConfig({
  build: {
    minify: MINIFY
  },
  plugins: [solid({ ssr: false })],
  // plugins: [solid()],
  server: {
    host: '0.0.0.0'
  }
});
