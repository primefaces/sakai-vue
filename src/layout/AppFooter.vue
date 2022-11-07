<script setup>
import { useLayoutService } from '@/layout/composables/layoutService';

const { layoutConfig } = useLayoutService();

const logoUrl = () => {
    return new URL(`/src/assets/layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`, import.meta.url).href;
};
</script>

<template>
    <div class="layout-footer">
        <img :src="logoUrl()" alt="Logo" height="20" class="mr-2" />
        by
        <span class="font-medium ml-2">PrimeNG</span>
    </div>
</template>
<style lang="scss" scoped></style>
