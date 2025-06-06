import vue from "@vitejs/plugin-vue";
import postcssPrefixSelector from "postcss-prefix-selector";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: "./lib/main.ts",
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}/index.js`,
    },
    commonjsOptions: {
      include: [/vxe-table-v3/],
    },
    rollupOptions: {
      external: ["vue", "vue/jsx-runtime"],
      output: {
        assetFileNames: "style.css",
        chunkFileNames: "chunks/[name].[hash].js",
        entryFileNames: "[name].js",
      },
    },
    copyPublicDir: false,
  },
  css: {
    postcss: {
      plugins: [
        postcssPrefixSelector({
          prefix: `.vxe-table-wrapper-v3`,
          transform(_prefix, selector, prefixedSelector) {
            // 只对 .xxx class 类起作用，而对于 :root, @keyframe, [data-xxx] 不起作用。
            if (selector.startsWith(".") || selector.startsWith("#")) {
              return prefixedSelector;
            }
            return selector;
          },
        }),
        // 由于 3.5.9 版本没有使用 css 变量，所以这里不需要做转换。
        // 自定义插件：替换 CSS 变量名
        // {
        //   postcssPlugin: "replace-css-vars",
        //   Once(root) {
        //     root.walkDecls((decl) => {
        //       if (decl.value.includes("--vxe-ui-")) {
        //         decl.value = decl.value.replace(/--vxe-ui-/g, "--vxe3-ui-");
        //       }
        //       if (decl.prop.includes("--vxe-ui-")) {
        //         decl.prop = decl.prop.replace(/--vxe-ui-/g, "--vxe3-ui-");
        //       }
        //     });
        //   },
        // },
      ],
    },
  },
});
