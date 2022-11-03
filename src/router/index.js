import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/formlayout',
                    name: 'formlayout',
                    component: () => import('@/views/demo/FormLayout.vue')
                },
                {
                    path: '/input',
                    name: 'input',
                    component: () => import('@/views/demo/Input.vue')
                },
                {
                    path: '/floatlabel',
                    name: 'floatlabel',
                    component: () => import('@/views/demo/FloatLabel.vue')
                },
                {
                    path: '/invalidstate',
                    name: 'invalidstate',
                    component: () => import('@/views/demo/InvalidState.vue')
                },
                {
                    path: '/button',
                    name: 'button',
                    component: () => import('@/views/demo/Button.vue')
                },
                {
                    path: '/table',
                    name: 'table',
                    component: () => import('@/views/demo/Table.vue')
                },
                {
                    path: '/list',
                    name: 'list',
                    component: () => import('@/views/demo/List.vue')
                },
                {
                    path: '/tree',
                    name: 'tree',
                    component: () => import('@/views/demo/Tree.vue')
                },
                {
                    path: '/panel',
                    name: 'panel',
                    component: () => import('@/views/demo/Panels.vue')
                },

                {
                    path: '/overlay',
                    name: 'overlay',
                    component: () => import('@/views/demo/Overlay.vue')
                },
                {
                    path: '/media',
                    name: 'media',
                    component: () => import('@/views/demo/Media.vue')
                }
                /*
               
               
           
               
                {
                    path: '/overlay',
                    name: 'overlay',
                    component: () => import('./components/OverlayDemo.vue')
                },
                {
                    path: '/media',
                    name: 'media',
                    component: () => import('./components/MediaDemo.vue')
                } */
            ]
        }
    ]
});

export default router;
