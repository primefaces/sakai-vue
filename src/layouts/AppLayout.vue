<script setup lang="ts">
import AppTopbar from './AppTopbar.vue';
import AppSidebar from '@/layouts/AppSidebar.vue';

import { computed, ref, watch } from 'vue';
import { useLayout } from '@/layouts/composables/layout';

const { layoutConfig, layoutState, isSidebarActive } = useLayout();

const outsideClickListener = ref((event: MouseEvent) => {});

watch(isSidebarActive, (newVal) => {
    if (newVal) {
        bindOutsideClickListener();
    } else {
        unbindOutsideClickListener();
    }
});

const containerClass = computed(() => {
    return {
        'layout-theme-light': layoutConfig.darkTheme.value === false,
        'layout-theme-dark': layoutConfig.darkTheme.value === true,
        'layout-overlay': layoutConfig.menuMode.value === 'overlay',
        'layout-static': layoutConfig.menuMode.value === 'static',
        'layout-static-inactive': layoutState.staticMenuDesktopInactive.value && layoutConfig.menuMode.value === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive.value,
        'layout-mobile-active': layoutState.staticMenuMobileActive.value,
        'p-input-filled': layoutConfig.inputStyle.value === 'filled',
        'p-ripple-disabled': !layoutConfig.ripple.value
    };
});
const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event: any) => {
            if (isOutsideClicked(event)) {
                layoutState.overlayMenuActive.value = false;
                layoutState.staticMenuMobileActive.value = false;
                layoutState.menuHoverActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};
const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener.value);
        outsideClickListener.value = (event: MouseEvent) => {};
    }
};

const isOutsideClicked = (event: MouseEvent) => {
    const sidebarEl = document.querySelector('.layout-sidebar') as Element | null;
    const topbarEl = document.querySelector('.layout-menu-button') as Element | null;

    return !(!sidebarEl || sidebarEl.isSameNode(event.target as Node) || !sidebarEl || sidebarEl.contains(event.target as Node) || !topbarEl || topbarEl.isSameNode(event.target as Node) || !topbarEl || topbarEl.contains(event.target as Node));
};
</script>

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
            <!-- <app-footer></app-footer> -->
        </div>
        <!-- <app-config></app-config> -->
        <div class="layout-mask"></div>
    </div>
</template>

<style lang="scss" scoped></style>
