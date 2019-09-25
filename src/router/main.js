import Vue from 'vue';
import Router from 'vue-router';
import Index from '../pages/link/Index';
import Login from '../components/login';

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
        component: Test,
    }, {
        path: '/alarm',
        name: 'alarm',
        component: Login,
    }, {
        path: '/class',
        name: 'class',
        component: Login,
    }],
});
