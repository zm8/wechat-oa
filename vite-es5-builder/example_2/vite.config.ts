import { defineConfig } from "vite";
import babel from "@rollup/plugin-babel";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // 入口文件
        main: "src/main.ts"
      },
      plugins: [
        // 配置 Babel 插件
        babel({
          babelHelpers: "bundled",
          extensions: [".js", ".jsx", ".ts", ".tsx", ".vue"]
        })
      ]
    }
  }
});