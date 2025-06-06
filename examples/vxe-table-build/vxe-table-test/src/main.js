import Vue from "vue";
import App from "./App.vue";
import "./assets/main.css";
import VxeUITable from "vxe-table";
import "vxe-table/lib/style.css";

Vue.use(VxeUITable);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
