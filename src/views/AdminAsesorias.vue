<script setup></script>

<template>
  <div class="bg-white overflow-hidden font-lato px-4">
    <div class="flex relative mt-5">
      <div class="flex-1">
        <div class="text-0D294C text-6xl mb-5 ml-2.4%">Administrador</div>
      
        <!-- Línea horizontal con tamaño fijo -->
        <hr class="w-5 border-t-2 border-D6D6D6 mb-2 ml-2.4%" />
        <div class="border-b-2 border-d6d6d6 w-full mb-5 ml-2.4%"></div>
      </div>

      <div class="justify-end">
        <Button label="Generar Reporte" severity="info" size="large" class="ml-5 bg-0D294C" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilo de colores */
.text-0D294C {
  color: #0D294C;
}

/* Estilo del botón */
.bg-0D294C {
  background-color: #0D294C;
  color: #fff;
  border: 1px solid #0D294C;
  border-radius: 20px;
}

/* Línea gris */
.border-D6D6D6 {
  border-color: #D6D6D6;
}

/* Establece el tamaño fijo de la línea horizontal */


/* Ajusta el tamaño de la línea en diferentes tamaños de pantalla */
@media (max-width: 1600px) {
  .w-5 {
    width: 1rem; /* Puedes ajustar este valor según tu preferencia */
  }
}

@media (max-width: 976px) {
  .w-5 {
    width: 0.75rem; /* Puedes ajustar este valor según tu preferencia */
  }
}

@media (max-width: 768px) {
  .w-5 {
    width: 1rem; /* Puedes ajustar este valor según tu preferencia */
  }
}
</style>
