import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { attachMarketNewsApi } from "./vite-news-api";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "casandra-market-news-api",
      configureServer(server) {
        attachMarketNewsApi(server);
      },
    },
  ],
  server: { port: 5173 },
  build: { outDir: "dist" },
});
