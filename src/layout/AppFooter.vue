<template>
    <div class="layout-footer">
        <img :src="logoUrl()" alt="Logo" height="20" class="mr-2" />
        by
        <span class="font-medium ml-2">PrimeNG</span>
    </div>
</template>

<script setup>
import { useThemeService } from '@/composables/theme';

const { appConfig } = useThemeService();

const logoUrl = () => {
    return new URL(`/src/assets/layout/images/${appConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`, import.meta.url).href;
};
</script>
<style lang="scss" scoped></style>
