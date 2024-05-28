<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed } from 'vue';

const { layoutConfig } = useLayout();

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});
</script>

<template>
    <div class="layout-footer mt-4">
        <a href="/public/assets/AvisoPrivacidadMaesMx.pdf">
            <p class="text-center text-indigo-800 w-full underline cursor-pointer">Aviso de privacidad</p>
        </a>
    </div>
</template>
<style lang="scss" scoped></style>
