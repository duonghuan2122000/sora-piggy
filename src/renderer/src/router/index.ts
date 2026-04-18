import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import { ROUTE_NAMES } from '@renderer/constants';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: { name: ROUTE_NAMES.DASHBOARD }
  },
  {
    path: '/dashboard',
    name: ROUTE_NAMES.DASHBOARD,
    component: () => import('@renderer/views/SoraDashboardView.vue')
  },

  {
    path: '/budget',
    name: ROUTE_NAMES.BUDGET,
    component: () => import('@renderer/views/BudgetView.vue')
  },
  {
    path: '/goals',
    name: ROUTE_NAMES.GOALS,
    component: () => import('@renderer/views/GoalsView.vue')
  },
  {
    path: '/reports',
    name: ROUTE_NAMES.REPORTS,
    component: () => import('@renderer/views/ReportsView.vue')
  },
  {
    path: '/settings',
    name: ROUTE_NAMES.SETTINGS,
    component: () => import('@renderer/views/SettingsView.vue')
  },
  {
    path: '/transactions',
    name: ROUTE_NAMES.TRANSACTIONS,
    component: () => import('@renderer/views/transactions/SoraTransactionView.vue')
  },
  {
    path: '/transactions/add',
    name: ROUTE_NAMES.TRANSACTIONS_ADD,
    component: () => import('@renderer/views/transactions/SoraAddTransactionView.vue')
  },
  {
    path: '/about',
    name: ROUTE_NAMES.ABOUT,
    component: () => import('@renderer/views/AboutView.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
