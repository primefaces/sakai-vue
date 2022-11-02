<template>
    <div class="layout-topbar">
        <a class="layout-topbar-logo">
            <img :src="logoUrl()" alt="logo" />
            <span>SAKAI</span>
        </a>

        <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
            <i class="pi pi-bars"></i>
        </button>

        <button class="p-link layout-topbar-menu-button layout-topbar-button">
            <i class="pi pi-ellipsis-v"></i>
        </button>

        <div class="layout-topbar-menu">
            <button class="p-link layout-topbar-button">
                <i class="pi pi-calendar"></i>
                <span>Calendar</span>
            </button>
            <button class="p-link layout-topbar-button">
                <i class="pi pi-user"></i>
                <span>Profile</span>
            </button>
            <button class="p-link layout-topbar-button">
                <i class="pi pi-cog"></i>
                <span>Settings</span>
            </button>
        </div>
    </div>
</template>

<script setup>
import { useLayoutService } from '@/composables/layoutService';

const { layoutConfig, onMenuToggle } = useLayoutService();

const logoUrl = () => {
    return new URL(`/src/assets/layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`, import.meta.url).href;
};
</script>

<style lang="scss" scoped></style>
