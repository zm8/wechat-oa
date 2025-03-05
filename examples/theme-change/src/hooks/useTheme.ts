import { ref, computed } from "vue";
import { ThemeEnum } from "../enums/ThemeEnum";

// 当前主题（默认浅色）
const theme = ref<ThemeEnum>(ThemeEnum.LIGHT);

// 导出一个开关方法
export const useTheme = () => {
  // 点击按钮时切换主题
  const toggleTheme = () => {
    const newTheme =
      theme.value === ThemeEnum.LIGHT ? ThemeEnum.DARK : ThemeEnum.LIGHT;
    document.documentElement.setAttribute("data-theme", newTheme); // 修改 HTML 标签的属性
    theme.value = newTheme; // 记住当前主题
  };

  // 判断是不是浅色模式
  const isLightTheme = computed(() => theme.value === ThemeEnum.LIGHT);

  return { toggleTheme, isLightTheme };
};
