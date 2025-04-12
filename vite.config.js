import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/visitor_pass/', // Add this line for GitHub Pages
  plugins: [react()],
});
