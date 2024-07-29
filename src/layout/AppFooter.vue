<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed } from 'vue';

const { isDarkTheme } = useLayout();

const logoUrl = computed(() => {
    return `/layout/images/${isDarkTheme ? 'logo-white' : 'logo-dark'}.svg`;
});
</script>

<template>
    <div class="layout-footer">
        <img :src="logoUrl" alt="Logo" height="20" class="mr-2" />
        by
        <span class="font-medium ml-2">PrimeVue</span>
    </div>
</template>
<style lang="scss" scoped></style>
