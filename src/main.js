import Vue from "vue";
import { RecycleScroller } from "vue-virtual-scroller";
import App from "./App.vue";
import Buefy from "buefy";
import VueRouter from "vue-router";
import "buefy/dist/buefy.css";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import router from "./router";
import Vuex from "vuex";
import "./utils/filters";
import VueLogger from "vuejs-logger";
import "./styles/styleguide.sass";

Vue.config.productionTip = false;

Vue.use(Buefy);
Vue.use(VueRouter);
Vue.component("RecycleScroller", RecycleScroller);
Vue.use(Vuex);

const options = {
  isEnabled: true,
  logLevel: process.env.VUE_APP_LOG_LEVEL,
  stringifyArguments: false,
  showLogLevel: true,
  showMethodName: true,
  separator: "|",
  showConsoleColors: true,
};

Vue.use(VueLogger, options);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
