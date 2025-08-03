process.env.VITE_DISABLE_FILE_WATCHER_RETRY = 'true';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    cors: true,
    allowedHosts: [
      'jay-composed-bhutan-parties.trycloudflare.com',
      'localhost',
      '127.0.0.1'
    ]
  }
});
