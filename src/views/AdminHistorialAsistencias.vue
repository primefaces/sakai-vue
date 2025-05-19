<script setup>
import { ref, onMounted } from 'vue';
import { getReportByDate } from '@/firebase/db/attendance';

const loading = ref(true);
const selectedDate = ref('2025-02-17'); // Change to dynamic later

const startDate = ref('2025-02-17'); // First date in database
const endDate = ref('2025-05-16'); // End date, update later to fetch current date

// Arrays for reports
const reports = ref([]);
const reportRange = ref([]); 

onMounted(async () => {
  loading.value = true;
  reports.value = await loadDayReport(selectedDate.value); // Fetches attendance from that date from firebase
  reportRange.value = await loadRangeReport(startDate.value, endDate.value); // Calls funct to fetch reports within date range

  loading.value = false;
  console.log('Reports:', reports.value); // To see values just in case
});

// Function to load reports for a specific date
const loadDayReport = async (singleDate) => {
  try {
    const reportObject = await getReportByDate(singleDate); // Fetches attendance from that date from firebase 

    return Object.entries(reportObject).map(([id, data]) => ({
      id,
      ...data
    })); // Converts obj to array to facilitate iteration
  } catch (error) {
    console.error('Error loading report:', error);
    return {};
  }
};

// Function to load reports for a date range
const loadRangeReport = async (start, end) => {
  try {
    const reportObjectRange = await getReportByDateRange(start, end); // Fetches attendance from that date from firebase

    return Object.entries(reportObjectRange).map(([id, data]) => ({
      id,
      ...data
    })); // Converts obj to array to facilitate iteration
  } catch (error) {
    console.error('Error loading report:', error);
    return [];
  }
};

</script>

<template>
  <div class="sm:flex sm:justify-content-between mb-2 sm:mb-5">
        <h1 class="text-black text-6xl font-bold text-center m-0 sm:text-left">Historial de asistencia</h1>
  </div>

  <div>
    <!-- Ver fecha temp-->
    <h2>{{ selectedDate }}</h2>

    <div v-if="loading">Cargando...</div>
    <ul v-else>
      <!-- Carga datos para un día -->
      <li v-for="r in reports" :key="r.id">
        {{ r.id }} - {{ r.email }} - {{ r.report }}
      </li>
    </ul>
  </div>

  <!-- Load data within range -->
  <div>
    <h2>Rango de fechas</h2>
    <p>Desde: {{ startDate }}</p>
    <p>Hasta: {{ endDate }}</p>

    <div v-if="loading">Cargando...</div>
    <ul v-else>
      <li v-for="rR in reportRange" :key="rR.id">
        {{ rR.id }} - {{ rR.email }} - {{ rR.report }} - Fecha: {{ rR.date }}
      </li>
    </ul>
  </div>
     

        
</template>