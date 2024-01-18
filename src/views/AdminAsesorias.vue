<script setup>
    const fecha = "Martes 14 de Noviembre de 2023"
</script>


<template>
  <div class="overflow-hidden font-lato px-4">
    
    <div class="flex relative mt-5">
      <div class="flex-1">
        <div class="text-0D294C text-6xl mb-5 ml-2.4%">Administrador</div> 
      </div>

      <div class="justify-end">
        <i class="pi pi-bell text-6xl"></i>
        <Button label="Generar Reporte" icon="pi pi-file-export" severity="info" size="large" class="ml-5 bg-0D294C" />
      </div>
    </div>
    <hr class="width-5 border-t-2 border-D6D6D6 mb-2 ml-2.4%" />
    <div class="border-b-2 border-d6d6d6 w-full mb-5 ml-2.4%"></div>
    <p class="text-4xl">{{fecha}} </p>
    <div class="border-b-2 border-d6d6d6 w-full mb-5 ml-2.4%"></div>

    <div class="flex flex-col">
        <div class="w-full p-0 border-round-xl bg-white shadow-1">
            <div class="text-black text-4xl">Aserias</div>
            <div class="text-0D294C text-4xl">22,000 totales</div>
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
.width-5 {
  width: 41.6667%;
}

@media (max-width: 768px) {
  .width-5 {
    width: 55%; /* Puedes ajustar este valor según tu preferencia */
  }
}

/* Contenedor blanco con borde gris */
.w-full.border-round-xl.bg-white.shadow-1 {
  border: 1px solid #D6D6D6;
}

/* Estilo de los textos internos centrados */
.text-black, .text-0D294C {
  text-align: center;
}
</style>
