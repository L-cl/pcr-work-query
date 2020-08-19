import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

export function createRouter() {
  return new VueRouter({
    mode: 'history',
    fallback: false,
    routes: [
      {
        path: '/',
        redirect: '/home',
      },
      {
        name: 'Home',
        path: '/home',
        component: () => import('../views/home/index.vue'),
      },
      {
        name: 'ViewWork',
        path: '/view-work/:id',
        component: () => import('../views/view-work/index.vue'),
      },
      {
        name: 'Login',
        path: '/login',
        component: () => import('../views/login/index.vue'),
      },
    ],
  });
}
