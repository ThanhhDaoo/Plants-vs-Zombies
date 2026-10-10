import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    host: true, // Open to local network so phone can test directly
    open: false,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
