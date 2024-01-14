import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Table.vue')
                },
                {
                    path: '/upload',
                    name: 'upload',
                    component: () => import('@/views/File.vue')
                },
            ]
        },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/Login.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/Error.vue')
        }
    ]
});

export default router;
