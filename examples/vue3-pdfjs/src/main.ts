import './assets/main.css'
import 'vue-virtual-scroller/index.css';

import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App);

app.component('DynamicScroller', DynamicScroller);
app.component('DynamicScrollerItem', DynamicScrollerItem);

app.mount('#app')
