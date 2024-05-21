import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/sockjs': {
        target: 'http://localhost:4003',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
  define: {
    'global': {},
  },
});
