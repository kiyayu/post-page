import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    historyApiFallback: true,
    host: true,
    strictPort: true,
    cors: true,
  },
  preview: {
    port: 3000,
    strictPort: true,
    host: true,
    historyApiFallback: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  base: "/",
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
