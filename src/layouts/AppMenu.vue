<script setup lang="ts">
import { ref } from 'vue';
import { LoginService } from '../views/auth/services/Login';

import AppMenuItem from './AppMenuItem.vue';

// import AppMenuItem from '@/layouts/AppMenuItem.vue'

export interface MenuItemDashboard {
  label: string;
  separator?: boolean;
  items: {
    label: string;
    icon: string;
    to: string;
    click?: () => void;
  }[];
}

const handleLogout = async () => {
  const loginService = LoginService.instance();
  await loginService.logout();
};

const menuOptions = ref<MenuItemDashboard[]>([
  {
    label: '',
    items: [
      { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' },
      {
        label: 'Usuarios sin cuenta',
        icon: 'pi pi-fw pi-user-minus',
        to: '/clients-without-account'
      },
      { label: 'Clientes', icon: 'pi pi-fw pi-users', to: '/clients' },
      { label: 'Aliados de Negocios', icon: 'pi pi-fw pi-sitemap', to: '/business-allies' },
      { label: 'Consolidado', icon: 'pi pi-fw pi-chart-bar', to: '/general-balance' },
      { label: 'Salir ', icon: 'pi pi-fw pi-sign-out', to: '/login', click: handleLogout }
    ]
  }
]);
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in menuOptions" :key="item">
      <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>