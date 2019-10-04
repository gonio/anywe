import Vue from 'vue';
import Router from 'vue-router';
import Index from '../pages/link/index';

Vue.use(Router);

export default new Router({
    routes: [{
        path: '/',
        name: 'index',
        component: Index
    }]
});
