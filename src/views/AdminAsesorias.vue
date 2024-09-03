<script setup>
    import InfoCard from "../components/InformacionMae.vue"
    import TituloAdmin from "../components/TituloAdmin.vue"
</script>


<template>
  <!-- <div class="overflow-hidden font-lato px-4">
    <TituloAdmin></TituloAdmin>
    <div class="grid-cols-4 gap-5">
        <InfoCard :tema="'Asesorías Totales'" :datos="'22,000 totales'" />
        <InfoCard :tema="'Asesorías de hoy'" :datos="'129 Asesorías'" />
        <InfoCard :tema="'Usuarios'" :datos="'15,000 usuarios'" />
    </div>
  </div> -->
    <div class="flex align-content-center h-full" style="min-height: 300px">
        <h1 class="flex align-items-center justify-content-center w-full">Admin Asesorías: ¡En construcción! ✌</h1>
    </div>
</template>

<style scoped>

.grid-cols-4 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
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
