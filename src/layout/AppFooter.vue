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
        <a href="https://firebasestorage.googleapis.com/v0/b/peer-teaching.appspot.com/o/documents%2FAvisoPrivacidadMaesMx.pdf?alt=media&token=425380a0-f154-4723-b73a-4505a8a4fae2">
            <p class="text-center text-indigo-800 w-full underline cursor-pointer">Aviso de privacidad</p>
        </a>
    </div>
</template>
<style lang="scss" scoped></style>
