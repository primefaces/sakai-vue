<script setup>
import Button from 'primevue/button';
import MaeCard from '../components/MaeCard.vue';
import { computed } from 'vue';

const maesData = [
    { nombre: 'Juan Perez', carrera: 'ITC', matricula: 'A01733822', horaInicio: '11:00', horaFin: '12:00', activo: true },
    { nombre: 'María Rodriguez', carrera: 'ELE', matricula: 'A01733823', horaInicio: '10:00', horaFin: '11:30', activo: true },
    { nombre: 'Genoveva Flores', carrera: 'ELE', matricula: 'A01733823', horaInicio: '10:00', horaFin: '11:30', activo: true },
    { nombre: 'Maria Garza', carrera: 'ELE', matricula: 'A01733823', horaInicio: '10:00', horaFin: '11:30', activo: true },
    { nombre: 'Carlos Gonzalez', carrera: 'MAT', matricula: 'A01733824', horaInicio: '09:30', horaFin: '10:45', activo: false },
    { nombre: 'Angela Gonzalez', carrera: 'IRS', matricula: 'A01733824', horaInicio: '12:30', horaFin: '13:30', activo: false },
    { nombre: 'Fernando Lopez', carrera: 'IRS', matricula: 'A01733824', horaInicio: '12:30', horaFin: '13:30', activo: false },
    { nombre: 'Nepomuceno Vargas', carrera: 'IRS', matricula: 'A01733824', horaInicio: '12:30', horaFin: '13:30', activo: false }
    // Agrega más objetos según sea necesario
];
// Propiedad computada para filtrar maesData
const maesActivos = computed(() => maesData.filter((mae) => mae.activo));
const maesPendientes = computed(() => maesData.filter((mae) => !mae.activo));
</script>

<template>
    <div class="bg-white overflow-hidden font-lato px-4">
        <div class="flex relative mt-5">
            <div class="flex-1">
                <div class="text-black text-6xl mb-5 ml-2.4%">Coordinación</div>
                <div class="border-b-2 border-d6d6d6 w-full mb-5 ml-2.4%"></div>
            </div>

            <div class="justify-end">
                <Button label="Generar Reporte" severity="info" size="large" class="ml-5" />
            </div>
        </div>
        <div class="mt-5">
            <div class="text-5xl"><b>Maes Activos</b></div>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                <MaeCard v-for="mae in maesActivos" :key="mae.matricula" :nombre="mae.nombre" :carrera="mae.carrera" :matricula="mae.matricula" :horaInicio="mae.horaInicio" :horaFin="mae.horaFin" />
            </div>
            <div class="text-5xl"><b>Maes Pendientes</b></div>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5">
                <MaeCard v-for="mae in maesPendientes" :key="mae.matricula" :nombre="mae.nombre" :carrera="mae.carrera" :matricula="mae.matricula" :horaInicio="mae.horaInicio" :horaFin="mae.horaFin" />
            </div>
        </div>
    </div>
</template>
