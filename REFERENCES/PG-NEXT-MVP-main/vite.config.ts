import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/tests/setup.ts",
    css: true,
    include: ["src/tests/**/*.test.ts", "src/tests/**/*.test.tsx"],
    exclude: ["References/**", "dist/**", "node_modules/**"],
  },
});
