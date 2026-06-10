import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// Сборка для GitHub Pages (проектный сайт по подпути /am-concept/).
// Билд выводится в корень репозитория, который Pages отдаёт из ветки.
export default defineConfig({
  plugins: [react()],
  base: "/am-concept/",
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  build: {
    outDir: path.resolve(__dirname, ".."),
    emptyOutDir: false,
    assetsDir: "assets",
  },
});
