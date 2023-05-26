<!-- eslint-disable prettier/prettier -->
<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Inicio',
        items: [
            { label: 'Mi día', icon: 'pi pi-fw pi-home', to: '/' },
            { label: 'Capturar', icon: 'pi pi-fw pi-id-card', to: '/uikit/floatlabel' },
        ]
    },
    {
        label: 'Catálogos',
        icon: 'pi pi-fw pi-briefcase',
        to: '/pages',
        items: [{
                label: 'Familias',
                icon: 'pi pi-fw pi-tag',
                to: '/pages/crud/familias'
            },
            {
                label: 'Grupos',
                icon: 'pi pi-fw pi-tags',
                to: '/pages/crud/grupos'
            },
            {
                label: 'Unidades de medida',
                icon: 'pi pi-fw pi-pound',
                to: '/pages/crud/unidades_de_medida'
            },
            {
                label: 'Factores de conversión',
                icon: 'pi pi-fw pi-sliders-v',
                to: '/pages/crud/factores_de_conversión'
            },
            {
                label: 'Productos',
                icon: 'pi pi-fw pi-box',
                to: '/pages/crud/Productos'
            },
            {
                label: 'Repartidores',
                icon: 'pi pi-fw pi-truck',
                to: '/pages/crud/Repartidores'
            },
            {
                label: 'Rutas',
                icon: 'pi pi-fw pi-map',
                to: '/pages/crud/Rutas'
            },
        ]
    },
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
        <!-- <li>
                <a href="https://www.primefaces.org/primeblocks-vue/#/" target="_blank">
                    <img src="/layout/images/banner-primeblocks.png" alt="Prime Blocks" class="w-full mt-3" />
                </a>
            </li> -->
    </ul>
</template>

<style lang="scss" scoped></style>
