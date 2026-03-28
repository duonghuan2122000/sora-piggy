import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@renderer/views/HomeView.vue')
  },
  {
    path: '/budget',
    name: 'Budget',
    component: () => import('@renderer/views/BudgetView.vue')
  },
  {
    path: '/goals',
    name: 'Goals',
    component: () => import('@renderer/views/GoalsView.vue')
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('@renderer/views/ReportsView.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@renderer/views/SettingsView.vue')
  },
  {
    path: '/transactions',
    name: 'Transaction',
    component: () => import('@renderer/views/SoraTransactionView.vue')
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
