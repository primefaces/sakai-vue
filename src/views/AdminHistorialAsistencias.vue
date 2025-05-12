<script setup>
import { ref, onMounted } from 'vue';
import { getReportByDate } from '@/firebase/db/attendance';

const loading = ref(true);
const selectedDate = ref('2025-02-17'); // Change to dynamic later
const reports = ref([]);

onMounted(async () => {
  loading.value = true;
  const reportObject = await getReportByDate(selectedDate.value);

  // Convert object to array for iteration
  reports.value = Object.entries(reportObject).map(([id, data]) => ({
    id,
    ...data
  }));

  loading.value = false;
});
</script>

<template>
    <div class="sm:flex sm:justify-content-between mb-2 sm:mb-5">
        <h1 class="text-black text-6xl font-bold text-center m-0 sm:text-left">Historial de asistencia</h1>

        <!-- Ver fecha temp-->
        <h2>{{ selectedDate }}</h2>

        <div v-if="loading">Cargando...</div>
    <ul v-else>
      <li v-for="r in reports" :key="r.id">
        {{ r.id }} - {{ r.email || 'Sin correo' }} - {{ r.report }}
      </li>
    </ul>
    </div>
</template>