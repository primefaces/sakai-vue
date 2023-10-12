import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layouts/AppLayout.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '/',
          name: 'home',
          component: () => import('@/views/clients/Clients.vue')
        },
        {
          path: '/about',
          name: 'about',
          component: () => import('@/views/AboutView.vue')
        },
        {
          path: '/clients-without-account',
          name: 'clients-without-account',
          component: () => import('@/views/clients/ClientsWithoutAccount.vue')
        },
        {
          path: '/clients',
          name: 'clients',
          component: () => import('@/views/clients/Clients.vue')
        },
        {
          path: 'clientDetail/:clientId',
          name: 'clientDetail',
          component: () => import('@/views/clients/ClientDetail.vue')
        },
        {
          path: '/business-allies',
          name: 'business-allies',
          component: () => import('@/views/business-allie/BusinessAllie.vue')
        },
        {
          path: '/general-balance',
          name: 'general-balance',
          component: () => import('@/views/general-balance/GeneralBalance.vue')
        },
        {
          path: '/logout',
          name: 'logout',
          component: () => import('@/views/general-balance/GeneralBalance.vue')
        }
      ]
    },

    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue')
    }
  ]
});

export default router;
