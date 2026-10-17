import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Capacitor serves the built files from the app's own storage, so assets must use relative paths.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  build: { outDir: "dist", sourcemap: false },
});
