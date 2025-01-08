import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // 入口文件
        main: "src/main.ts"
      }
    }
  }
});