<script setup>
import { useLayout } from '@/layout/composables/layout';

const { layoutConfig } = useLayout();

const logoUrl = () => {
    return new URL(`/public/layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`, import.meta.url).href;
};
</script>

<template>
    <div class="layout-footer">
        <img :src="logoUrl()" alt="Logo" height="20" class="mr-2" />
        by
        <span class="font-medium ml-2">PrimeVue</span>
    </div>
</template>
<style lang="scss" scoped></style>
