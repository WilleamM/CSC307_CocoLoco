import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'fs';
import { join } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-staticwebapp-config',
      closeBundle() {
        // Copy staticwebapp.config.json to dist folder after build
        try {
          copyFileSync(
            join(__dirname, 'staticwebapp.config.json'),
            join(__dirname, 'dist', 'staticwebapp.config.json')
          );
        } catch (error) {
          console.warn('Could not copy staticwebapp.config.json:', error.message);
        }
      },
    },
  ],
});
