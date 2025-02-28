import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import "uno.css";

const setRemUnit = () => {
  const docEl = document.documentElement;
  const pageWidth = docEl.clientWidth;
  docEl.style.fontSize = pageWidth / 10 + "px";
};

setRemUnit();

window.addEventListener("resize", setRemUnit);

createApp(App).mount("#app");
