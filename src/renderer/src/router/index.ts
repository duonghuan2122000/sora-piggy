import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@renderer/views/HomeView.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@renderer/views/AboutView.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
