<script setup>
    import InfoCard from "../components/InformacionMae.vue"
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

    
    <div class="grid-cols-4 gap-5">
        <InfoCard :tema="'Asesorías Totales'" :datos="'22,000 totales'" />
        <InfoCard :tema="'Asesorías de hoy'" :datos="'129 Asesorías'" />
        <InfoCard :tema="'Usuarios'" :datos="'15,000 usuarios'" />
    </div>
    
  </div>
</template>

<style scoped>
/* Estilo de colores */
.text-0D294C {
  color: #0D294C;
  font-weight: bold;
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

.grid-cols-4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-column-gap: 2rem;
    grid-row-gap: 2rem;
}

@media (max-width: 1600px) {
    .grid-cols-4 {
        grid-template-columns: repeat(3, 1fr); /* Set it to three columns for screens between 769px and 1200px */
    }
}

@media (max-width: 976px) {
    .grid-cols-4 {
        grid-template-columns: 2fr; /* Set it to one column for screens 768px and below */
    }
}

@media (max-width: 768px) {
    .grid-cols-4 {
        grid-template-columns: 1fr; /* Set it to one column for screens 768px and below */
    }
}
 

</style>
