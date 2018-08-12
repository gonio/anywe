import Vue from 'vue';
import Router from 'vue-router';
import VModal from 'vue-js-modal';
import Index from '../components/Index';
import Login from '../components/Login';
import Main from '../components/Main';

Vue.use(VModal, { dialog: true });
Vue.use(Router);

export default new Router({
    routes: [{
        path: '/',
        name: 'index',
        component: Index,
    }, {
        path: '/login',
        name: 'login',
        component: Login,
    }, {
        path: '/main',
        name: 'main',
        component: Main,
    }, {
        path: '/qa',
        name: 'qa',
        component: Login,
    }, {
        path: '/alarm',
        name: 'alarm',
        component: Login,
    }, {
        path: '/class',
        name: 'class',
        component: Login,
    }]
});
