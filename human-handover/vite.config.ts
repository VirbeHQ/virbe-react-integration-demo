import { defineConfig } from 'vite';
import viteReact from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';
import TanStackRouterVite from '@tanstack/router-plugin/vite';

// https://vite.dev/config/
export default defineConfig({
  base: '/samples/handover',
  plugins: [svgr({}), TanStackRouterVite({ autoCodeSplitting: true }), viteReact()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
