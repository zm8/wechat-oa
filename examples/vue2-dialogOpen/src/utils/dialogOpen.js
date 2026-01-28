import Vue from 'vue';

// 定义缓存 Map
const instanceCache = new Map();

const splitPropsAndListeners = (input = {}) => {
  const props = {};
  const on = {};
  Object.keys(input).forEach(key => {
    if (/^on[A-Z]/.test(key) && typeof input[key] === 'function') {
      const event = key.slice(2).replace(/^[A-Z]/, s => s.toLowerCase());
      on[event] = input[key];
    } else {
      props[key] = input[key];
    }
  });
  return { props, on };
};

const removeElement = el => {
  el?.parentNode?.removeChild(el);
};

/**
 * @param {Object} Component 组件文件
 * @param {Object} props 传递的参数
 * @param {Object} options 配置 { context, destroyOnClose, key }
 * { context } 页面组件的实例
 * { destroyOnClose } 关闭时是否销毁弹层, 默认为 true(销毁)
 * { key } 弹层缓存标识
 */
export default function dialogOpen(Component, props = {}, options = {}) {
  const { context, destroyOnClose = true } = options;

  if (!Component || !context) {
    throw new Error('Component 和 context 必传');
  }

  if (!Component.name) {
    throw new Error('Component 必须设置名字 name');
  }

  const key = options.key || `${Component.name || 'Anoymous'}-${context._uid || 'global'}`;

  const initialProps = {
    visible: true,
    ...props
  };

  // 如果有缓存
  if (!destroyOnClose && instanceCache.has(key)) {
    const cacheWrapperVm = instanceCache.get(key);
    cacheWrapperVm.updateProps(initialProps); // 更新 props
    return cacheWrapperVm.triggerClose;
  }

  let isDestroyed = false;

  const destroy = () => {
    if (isDestroyed) return;
    isDestroyed = true;
    context.$off('hook:beforeDestroy', destroy);
    instanceCache.delete(key);
    if (wrapperVm) {
      wrapperVm.$destroy();
      removeElement(wrapperVm.$el);
      wrapperVm = null;
    }
    if (container) {
      removeElement(container);
      container = null;
    }
  };

  // 关闭函数
  const closeHandler = () => {
    if (destroyOnClose) {
      destroy();
    } else {
      wrapperVm.updateProps({
        visible: false
      });
    }
  };

  let wrapperVm = new Vue({
    parent: context, // 继承 $store, $router
    computed: {
      vnodeData() {
        const { props, on } = splitPropsAndListeners(this.rawProps);
        return { props, on };
      }
    },
    data() {
      return {
        rawProps: initialProps
      };
    },
    methods: {
      // 更新属性
      updateProps(nextProps) {
        this.rawProps = {
          ...this.rawProps,
          ...nextProps
        };
      },
      triggerClose() {
        closeHandler();
      }
    },
    render(h) {
      return h(Component, {
        props: this.vnodeData.props,
        on: {
          ...this.vnodeData.on,
          close: (...args) => {
            this.vnodeData.on.close?.(...args);
            closeHandler(...args);
          }
        }
      });
    }
  });

  // 挂载
  let container = document.createElement('div');
  document.body.appendChild(container);
  wrapperVm.$mount(container);

  if (!destroyOnClose) {
    instanceCache.set(key, wrapperVm);
  }

  context.$once('hook:beforeDestroy', destroy);

  return wrapperVm.triggerClose;
}
