import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@client': path.resolve(__dirname, './client/src'),
    },
    // Ensure node modules are resolved from the project root
    preserveSymlinks: true
  },
  root: './client',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      // Make sure Material UI is properly bundled
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE' || 
            warning.message.includes('Use of eval') ||
            warning.message.includes('failed to resolve import')) {
          return;
        }
        warn(warning);
      }
    }
  },
  server: {
    port: 5173,
  }
}) 