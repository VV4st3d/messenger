import { defineNuxtPlugin } from '#app';
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

export default defineNuxtPlugin((app) => {
  app.vueApp.component('DynamicScroller', DynamicScroller);
  app.vueApp.component('DynamicScrollerItem', DynamicScrollerItem);
});
