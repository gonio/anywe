import Vue from 'vue';
import Vuex from 'vuex';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '../style/common.less';
import App from './app';
import router from '../router/main';
import ajax from '../util/ajax';
import store from '../store';

Vue.use(Vuex);
Vue.use(ElementUI);
Vue.use(ajax);

// eslint-disable-next-line no-new
new Vue({
    el: '#app',
    router,
    store,
    render: (h) => h(App)
});
