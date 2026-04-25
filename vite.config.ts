import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/** GitHub project Pages default (must match the repo URL segment, case-sensitive). */
const defaultPagesBase = "/WorkBenchHr/";

/** Override in CI with `VITE_BASE_PATH` (e.g. `/` for a user.github.io root site). */
function normalizeBase(raw: string | undefined): string {
  const b = (raw ?? "").trim();
  if (b === "" || b === "/") return "/";
  const withSlashes = `/${b.replace(/^\/+|\/+$/g, "")}/`;
  return withSlashes;
}

function resolveBase(): string {
  if (process.env.VITE_BASE_PATH !== undefined && process.env.VITE_BASE_PATH.trim() !== "") {
    return normalizeBase(process.env.VITE_BASE_PATH);
  }
  return process.env.NODE_ENV === "production" ? defaultPagesBase : "/";
}

export default defineConfig({
  base: resolveBase(),
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  server: {
    host: true,
    port: 5173,
  },
});
