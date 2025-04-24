import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { setupDirective } from "./directive";

// 创建 Vue 实例
const app = createApp(App);

// 注册自定义指令
setupDirective(app);

// 挂载应用
app.mount("#app");
