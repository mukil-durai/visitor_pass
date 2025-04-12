import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/visitor_pass/', // Matches your GitHub Pages deployment path
  plugins: [react()],
});
