<script setup>
import { ref } from 'vue';

import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import TituloAdmin from '../components/TituloAdmin.vue';

const asesorias = ref([
  { id: 1, fecha: '2024-09-03', nombre: 'Asesoría 1', detalles: 'Detalles de la asesoría 1' },
  { id: 2, fecha: '2024-09-05', nombre: 'Asesoría 2', detalles: 'Detalles de la asesoría 2' },
  // Agrega más datos aquí
]);

const startDate = ref(null);
const endDate = ref(null);

const filteredAsesorias = ref([...asesorias.value]);

const filterByDate = () => {
  if (startDate.value && endDate.value) {
    filteredAsesorias.value = asesorias.value.filter((asesoria) => {
      const asesorDate = new Date(asesoria.fecha);
      return asesorDate >= startDate.value && asesorDate <= endDate.value;
    });
  } else {
    filteredAsesorias.value = [...asesorias.value];
  }
};

const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(filteredAsesorias.value);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Asesorias');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), 'Asesorias.xlsx');
};
</script>

<template>
  <div class="px-4">
    <div class="sm:flex sm:justify-content-between mb-2 sm:mb-5">
        <h1 class="text-black text-6xl font-bold text-center m-0 sm:text-left">Administrador Asesorías</h1>
       
    </div>


    <div class="mt-5">
      <h2>Filtrar por Fecha</h2>
      <div class="flex gap-2">
        <Calendar v-model="startDate" placeholder="Fecha de Inicio" dateFormat="yy-mm-dd" />
        <Calendar v-model="endDate" placeholder="Fecha de Fin" dateFormat="yy-mm-dd" />
        <Button label="Filtrar" icon="pi pi-filter" @click="filterByDate" />
        <Button label="Exportar a Excel" icon="pi pi-file-excel" class="p-button-success" @click="exportToExcel" />
      </div>
    </div>

    <DataTable :value="filteredAsesorias" class="mt-5">
      <Column field="id" header="ID" />
      <Column field="fecha" header="Fecha" />
      <Column field="nombre" header="Nombre" />
      <Column field="detalles" header="Detalles" />
    </DataTable>
  </div>
</template>

<style scoped>
.grid-cols-4 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

@media (max-width: 768px) {
  .grid-cols-4 {
    grid-template-columns: 1fr;
  }
}
</style>
