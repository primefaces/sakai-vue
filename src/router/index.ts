import AppLayout from '~/layout/AppLayout.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('~/views/Dashboard.vue')
                },

                {
                    path: '/pages/empty',
                    name: 'empty',
                    component: () => import('~/views/pages/Empty.vue')
                },
                {
                    path: '/documentation',
                    name: 'documentation',
                    component: () => import('~/views/pages/Documentation.vue')
                }
            ]
        },
        {
            path: '/my',
            component: AppLayout,
            children: [
              {
                path: 'certs',
                name: 'my-certs',
                component: () => import('~/views/my/Certs.vue')
              },
              {
                path: 'lessons',
                name: 'my-lessons',
                component: () => import('~/views/my/Lessons.vue')
              },
              {
                path: 'calendar',
                name: 'my-calendar',
                component: () => import('~/views/my/Calendar.vue')
              },
              {
                path: 'chat',
                name: 'my-chat',
                component: () => import('~/views/my/Chat.vue')
              },


            ]
        },		
        {
            path: '/landing',
            name: 'landing',
            component: () => import('~/views/pages/Landing.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('~/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('~/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('~/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('~/views/pages/auth/Error.vue')
        }
    ]
})

export default router
