import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    historyApiFallback: true, // Ensure all paths fallback to index.html
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
    outDir: "dist", // Ensure this matches your build folder
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
