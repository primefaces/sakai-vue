<template>
    <div class="layout-wrapper" :class="containerClass">
        <app-topbar></app-topbar>
        <div class="layout-sidebar">
            <app-sidebar></app-sidebar>
        </div>
        <div class="layout-main-container">
            <div class="layout-main">
                <router-view></router-view>
            </div>
            <app-footer></app-footer>
        </div>
        <app-config></app-config>
        <div class="layout-mask"></div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import AppTopbar from './AppTopbar.vue';
import AppFooter from './AppFooter.vue';
import AppSidebar from './AppSidebar.vue';
import AppConfig from './AppConfig.vue';

import { useThemeService } from '@/composables/theme';

const { appConfig, layoutState } = useThemeService();

const containerClass = computed(() => {
    return {
        'layout-theme-light': appConfig.darkTheme.value === 'light',
        'layout-theme-dark': appConfig.darkTheme.value === 'dark',
        'layout-overlay': appConfig.menuMode.value === 'overlay',
        'layout-static': appConfig.menuMode.value === 'static',
        'layout-static-inactive': layoutState.staticMenuDesktopInactive.value && appConfig.menuMode.value === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive.value,
        'layout-mobile-active': layoutState.staticMenuMobileActive.value,
        'p-input-filled': appConfig.inputStyle.value === 'filled',
        'p-ripple-disabled': !appConfig.ripple.value
    };
});
</script>

<style lang="scss" scoped></style>
