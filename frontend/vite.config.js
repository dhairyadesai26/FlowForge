import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    port: 3000,
    strictPort: true,
    open: true,
    proxy: {
      '/api': { target: 'http://localhost:5000', changeOrigin: true },
      '/socket.io': { target: 'http://localhost:5000', changeOrigin: true, ws: true },
    },
  },
  preview: {
    port: 3000,
    strictPort: true,
    open: true,
  },
  test: {
    mockReset: true,
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    exclude: ["node_modules", "src/tests/e2e"],
  },
  plugins: [react()],
});
