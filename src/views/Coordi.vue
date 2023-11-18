<script setup>
import Button from 'primevue/button';
import MaeCard from '../components/MaeCard.vue';
import { computed } from 'vue';

const maesData = [
    { nombre: 'Juan Perez', carrera: 'ITC', matricula: 'A01733822', horaInicio: '11:00', horaFin: '12:00', activo: true, checked: true },
    { nombre: 'Luis Guzmán', carrera: 'ITC', matricula: 'A01733822', horaInicio: '11:00', horaFin: '12:00', activo: true, checked: false },
    { nombre: 'María Rodriguez', carrera: 'ELE', matricula: 'A01733823', horaInicio: '10:00', horaFin: '11:30', activo: true, checked: true },
    { nombre: 'Genoveva Flores', carrera: 'ELE', matricula: 'A01733823', horaInicio: '10:00', horaFin: '11:30', activo: true, checked: false },
    { nombre: 'Maria Garza', carrera: 'ELE', matricula: 'A01733823', horaInicio: '10:00', horaFin: '11:30', activo: true, checked: true },
    { nombre: 'Carlos Gonzalez', carrera: 'MAT', matricula: 'A01733824', horaInicio: '09:30', horaFin: '10:45', activo: false, checked: false },
    { nombre: 'Angela Gonzalez', carrera: 'IRS', matricula: 'A01733824', horaInicio: '12:30', horaFin: '13:30', activo: false, checked: true },
    { nombre: 'Fernando Lopez', carrera: 'IRS', matricula: 'A01733824', horaInicio: '12:30', horaFin: '13:30', activo: false, checked: false },
    { nombre: 'Nepomuceno Vargas', carrera: 'IRS', matricula: 'A01733824', horaInicio: '12:30', horaFin: '13:30', activo: false, checked: true },
];
// Propiedad computada para filtrar maesData
const maesActivos = computed(() => maesData.filter((mae) => mae.activo));
const maesPendientes = computed(() => maesData.filter((mae) => !mae.activo));
</script>

<template>
    <div class="flex relative mt-5">
        <div class="flex-1">
            <h1 class="text-black text-6xl font-bold mb-5">Coordinación</h1>
        </div>
        <div class="justify-end hidden md:block">
            <Button label="Generar Reporte" icon="pi pi-file-export" size="large"/>
        </div>
    </div>
    <div class="mt-5">
        <h2 class="text-3xl font-bold">Maes Activos</h2>
        <div class="grid-cols-4">
            <MaeCard v-for="mae in maesActivos" :key="mae.matricula" :nombre="mae.nombre" :carrera="mae.carrera" :matricula="mae.matricula" :horaInicio="mae.horaInicio" :horaFin="mae.horaFin" />
        </div>
        <h2 class="text-3xl font-bold">Maes Pendientes</h2>
        <div class="grid-cols-4 gap-5">
            <MaeCard v-for="mae in maesPendientes" :key="mae.matricula" :nombre="mae.nombre" :carrera="mae.carrera" :matricula="mae.matricula" :horaInicio="mae.horaInicio" :horaFin="mae.horaFin" />
        </div>
    </div>
</template>

<style scoped>
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