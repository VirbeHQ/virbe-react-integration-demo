import {defineConfig, loadEnv} from 'vite';
import viteReact from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';
import TanStackRouterVite from '@tanstack/router-plugin/vite';

// https://vite.dev/config/
export default ({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  const base = process.env.VITE_PUBLIC_PATH || '/';

  return defineConfig({
    base: base,
    plugins: [svgr({}), TanStackRouterVite({ autoCodeSplitting: true }), viteReact()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  });
}
