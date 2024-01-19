<script setup>
  // Props para recibir del padre
  const props = defineProps(['tema', 'datos']);
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="w-full p-0 border-round-2xl bg-white shadow-1 contenedor" style="width: 80%; height: 100%;">
      <div class="text-black text-5xl mt-7">
        {{tema}}
      </div>
      <div class="text-0D294C text-5xl mb-7">
        {{datos}}
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* Estilo de colores */
  .text-0D294C {
    color: #0D294C;
    font-weight: bold;
  }

  /* Contenedor blanco con borde gris */
  .contenedor {
    border: 1px solid #D6D6D6;
  }

  /* Estilo de los textos internos centrados */
  .text-black,
  .text-0D294C {
    text-align: center;
  }
</style>
