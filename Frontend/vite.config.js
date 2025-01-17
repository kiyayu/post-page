import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    historyApiFallback: true, // Allow client-side routing in development
    host: true,
    strictPort: true,
    cors: true,
  },
  build: {
    outDir: "dist", // Output directory for build files
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  base: "/", // Ensures your app works correctly when hosted at the root of a domain
  resolve: {
    alias: {
      "@": "/src", // Easy import alias
    },
  },
});
