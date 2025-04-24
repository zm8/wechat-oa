/**
 * v-loading 指令逻辑
 * @file directive/loading/index.ts
 */

import type { Directive, DirectiveBinding } from "vue";
import { createLoading } from "./createLoading";

interface El extends HTMLElement {
  __loadingInstance: ReturnType<typeof createLoading>;
}

type Binding = DirectiveBinding<boolean>;

// 获取指令传递的参数，包含动画大小、颜色和是否可见
const getProps = (el: El, binding: Binding) => {
  const size = el.getAttribute("loading-size");
  const color = el.getAttribute("loading-color");
  return {
    size: size === null ? undefined : Number(size),
    color: color === null ? undefined : color,
    isVisible: binding.value,
  };
};

export const loading: Directive = {
  mounted(el: El, binding: Binding) {
    console.log("mounted");
    const props = getProps(el, binding);
    const instance = createLoading(props, el);
    el.__loadingInstance = instance;
  },
  updated(el: El, binding: Binding) {
    console.log("updated");
    const props = getProps(el, binding);
    el.__loadingInstance.update(props);
  },
  unmounted(el: El) {
    console.log("unmounted");
    el.__loadingInstance.destroy();
  },
};
