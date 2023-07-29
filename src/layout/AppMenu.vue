<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Home', icon: 'pi pi-fw pi-home', to: '/' }],
    },
    {
        label: 'Systems',
        items: [
            { label: 'DMS', icon: 'pi pi-fw pi-folder-open', url: 'https://dms.dost9.ph', target: '_blank' },
            { label: 'EULIMS', icon: 'pi pi-fw pi-check-square', url: 'https://eulims.dost9.ph', target: '_blank' },
            { label: 'FAIMS', icon: 'pi pi-fw pi-book', url: 'https://faims2.dost9.ph', target: '_blank' },
            { label: 'File Server Online', icon: 'pi pi-fw pi-server', url: 'http://dost9.ph:81', target: '_blank' },
            { label: 'HRMIS', icon: 'pi pi-fw pi-user', url: 'https://hrmis.dost9.ph/', target: '_blank' },
            { label: 'IMPRESSION', icon: 'pi pi-fw pi-map', url: 'https://impression.dost9.ph', target: '_blank' },
            { label: 'SCHOLARSHIP', icon: 'pi pi-fw pi-star', url: 'https://scholarship.dost9.ph', target: '_blank' },
            { label: 'SCIMS', icon: 'pi pi-fw pi-shopping-cart', url: 'https://scims.dost9.ph', target: '_blank' },
            { label: 'TRACE', icon: 'pi pi-fw pi-file-export', url: 'https://trace.dost9.ph', target: '_blank' },
            { label: 'VRAMS', icon: 'pi pi-fw pi-car', url: 'https://vrams.dost9.ph', target: '_blank' },
        ],
    },
    {
        label: 'Forms',
        items: [
            { label: 'CCTV Access', icon: 'pi pi-fw pi-video', url: 'https://docs.google.com/forms/d/e/1FAIpQLSenbskEG1EY3F92D0RlwgytZp-r8VVIgFMABTnKcCwPeE7nag/viewform', target: '_blank' },
            { label: 'Maintenance   ', icon: 'pi pi-fw pi-desktop', url: 'https://docs.google.com/forms/d/e/1FAIpQLSdDiMSilOgFhI2_pgqkGKsATPOA8_FYSMDqxjv2krFVZ6SGhQ/viewform?pli=1', target: '_blank' },
        ],
    },
    {
        label: 'Users',
        items: [
            { label: 'Register', icon: 'pi pi-fw pi-user-plus', to: '/auth/register' },
            { label: 'Pinia Example', icon: 'pi pi-fw pi-check-square', to: '/pinia' },
            //{ label: 'Input', icon: 'pi pi-fw pi-check-square', to: '/uikit/input' },
        ]
    },
    /*{
        label: 'Pages',
        icon: 'pi pi-fw pi-briefcase',
        to: '/pages',
        items: [
            {
                label: 'Landing',
                icon: 'pi pi-fw pi-globe',
                to: '/landing'
            },
            {
                label: 'Auth',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Login',
                        icon: 'pi pi-fw pi-sign-in',
                        to: '/auth/login'
                    },
                    {
                        label: 'Error',
                        icon: 'pi pi-fw pi-times-circle',
                        to: '/auth/error'
                    },
                    {
                        label: 'Access Denied',
                        icon: 'pi pi-fw pi-lock',
                        to: '/auth/access'
                    }
                ]
            },
            {
                label: 'Crud',
                icon: 'pi pi-fw pi-pencil',
                to: '/pages/crud'
            },
            {
                label: 'Timeline',
                icon: 'pi pi-fw pi-calendar',
                to: '/pages/timeline'
            },
            {
                label: 'Not Found',
                icon: 'pi pi-fw pi-exclamation-circle',
                to: '/pages/notfound'
            },
            {
                label: 'Empty',
                icon: 'pi pi-fw pi-circle-off',
                to: '/pages/empty'
            }
        ]
    },*/
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
