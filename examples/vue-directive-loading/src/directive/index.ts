/**
 * 注册所有自定义指令
 * @file directive/index.ts
 */

import type { App } from "vue";
import { loading } from "./loading";

// 用来在 Vue 应用中注册指令的函数
export function setupDirective(app: App<Element>) {
  app.directive("loading", loading);
}
