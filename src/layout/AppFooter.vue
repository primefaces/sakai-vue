<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed } from 'vue';

const { layoutConfig } = useLayout();
layoutConfig.darkTheme.value ? 'logo-white.svg' : 'logo-dark.svg';

const logoUrl = computed(() => {
    // return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
    return `layout/images/logo.png`;
});
</script>

<template>
    <div class="layout-footer">
        <img :src="logoUrl" alt="Logo" height="20" class="mr-2" />
        <span class="font-medium ml-2">
            <a href="http://region9.dost.gov.ph">Department of Science and Technology Regional Office No. IX</a>
        </span>
    </div>
</template>
<style lang="scss" scoped></style>
