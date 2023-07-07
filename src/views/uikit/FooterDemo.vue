<script setup>
import { inject } from "vue";

const dialogRef = inject('dialogRef');
const modal = dialogRef.modal
const closeDialog = () => {
  dialogRef.value.close();
}

</script>

<template>
  <Button label="cancelar" text severity="secondary" @click="closeDialog" ></Button>

</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>
