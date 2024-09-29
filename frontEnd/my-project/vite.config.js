import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import pluginRewriteAll from 'vite-plugin-rewrite-all';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {port: 3000},
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:3800',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, ''),
  //     },
  //   },
  // },
});
