import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    host: true,
    cors: true,
    strictPort: true,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'publisher.transitionmarketingai.com',
      '*.manusvm.computer',
      '5176-i9l4vaxy1hlnjk7y22wy6-72bda4a3.manusvm.computer'
    ]
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
  },
});

