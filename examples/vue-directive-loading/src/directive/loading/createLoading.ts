/**
 * 创建、更新和销毁 v-loading 的实例
 * @file directive/loading/createLoading.ts
 */

import { defineComponent, h, reactive, render } from "vue";
import type { LoadingProps } from "./types";
import Loading from "./Loading.vue";

export function createLoading(
  props: Partial<LoadingProps>,
  target: HTMLElement
) {
  const data = reactive({
    ...props,
  });

  const Comp = defineComponent({
    render: () => h(Loading, data),
  });

  // 创建虚拟节点
  const vNode = h(Comp);
  // 将虚拟节点挂载到容器上
  render(vNode, target);

  return {
    update: (newProps: Partial<LoadingProps>) => Object.assign(data, newProps),
    destroy: () => render(null, target),
  };
}
