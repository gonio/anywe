import Vue from 'vue';
import Vuex from 'vuex';
import VueLoading from 'vue-loading-overlay';
import VueEasyToast from 'vue-easy-toast';
import 'vue-loading-overlay/dist/vue-loading.min.css';
import '../style/common.css';
import App from './App';
import router from '../router/main';
import ajax from '../util/ajax';
import store from '../store';

Vue.config.productionTip = false;
Vue.use(Vuex);
Vue.use(ajax);
Vue.use(VueLoading);
Vue.use(VueEasyToast);

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});
