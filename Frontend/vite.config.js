import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", // Build output directory
  },
  server: {
    port: 3000,
    cors: true, // Allow CORS if needed
    historyApiFallback: true, // Handle SPA routing
  },
  preview: {
    port: 3000,
    historyApiFallback: true, // Ensure fallback during preview
  },
  base: "/", // Ensure relative paths
});
