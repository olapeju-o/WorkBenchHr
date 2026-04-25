import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/** GitHub project Pages: set `VITE_BASE_PATH=/your-repo-name/` in CI (leading and trailing slash). */
function normalizeBase(raw: string | undefined): string {
  const b = (raw ?? "/").trim();
  if (b === "" || b === "/") return "/";
  const withSlashes = `/${b.replace(/^\/+|\/+$/g, "")}/`;
  return withSlashes;
}

export default defineConfig({
  base: normalizeBase(process.env.VITE_BASE_PATH),
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  server: {
    host: true,
    port: 5173,
  },
});
