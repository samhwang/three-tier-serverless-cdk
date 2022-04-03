import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import relay from 'vite-plugin-relay';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
  plugins: [
    react({
      exclude: /\.test\.(t|j)sx?$/,
    }),
    relay,
  ],
  build: {
    outDir: 'build',
  },
});
