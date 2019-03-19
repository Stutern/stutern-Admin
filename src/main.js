
/* eslint-disable */
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios'

// Bootstrap vue
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import 'vue-awesome/icons/flag'
import Icon from 'vue-awesome/components/Icon'

// globally (in your main .js file)
Vue.component('v-icon', Icon)

import vueResource from 'vue-resource'
Vue.use(vueResource)

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
axios.defaults.headers.common['x-access-token'] = window.sessionStorage.accessToken;


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');