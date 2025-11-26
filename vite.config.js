// Vite configuration dedicated to a lightweight React UI.
import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react"
  },
  server: {
    port: 5173,
    host: "127.0.0.1"
  }
});


