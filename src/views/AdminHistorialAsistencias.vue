<script setup>
import { ref, onMounted } from 'vue';
import { getReportByDate } from '@/firebase/db/attendance';
import { getReportByDateRange } from '@/firebase/db/attendance';

// To get number of mae attendances 
import { computed } from 'vue';
const maeStats = computed(() => {
  const summaryMap = new Map();

  reportRange.value.forEach((entry) => {
    const uid = entry.id;
    const reportCode = entry.report;

    // Initialize or reuse
    if (!summaryMap.has(uid)) {
      summaryMap.set(uid, {
        id: uid,
        name: entry.name || '',
        email: entry.email || '',
        A: 0,
        R: 0,
        F: 0,
        J: 0,
        count: 0, // optional total
      });
    }

    const userSummary = summaryMap.get(uid);

    // Only count if it's a recognized status
    if (['A', 'R', 'F', 'J'].includes(reportCode)) {
      userSummary[reportCode]++;
      userSummary.count++;
    }
  });

  return Array.from(summaryMap.values());
});


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

  console.log("✅ reportRange loaded:", reportRange.value.length, "entries");
  console.log("🧮 computed stats:", maeStats.value);
  

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
    //const reportObjectRange = await getReportByDateRange(start, end); // Fetches attendance from that date from firebase

    /*
    return Object.entries(reportObjectRange).map(([id, data]) => ({
      id,
      ...data
    })); // Converts obj to array to facilitate iteration
    

    return reportObjectRange;
    */
    const result = await getReportByDateRange(start, end); // ✅ this was missing
    reportRange.value = result; 

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
    <ol v-else>
      <!-- Carga datos para un día -->
      <li v-for="r in reports" :key="r.id">
        {{ r.id }} - {{ r.email }} - {{ r.report }}
      </li>
    </ol>
  </div>

  <!-- Load data within range -->
  <div>
    <h2>Rango de fechas</h2>
    <p>Desde: {{ startDate }}</p>
    <p>Hasta: {{ endDate }}</p>

    <pre>{{ reportRange }}</pre>

    <div v-if="loading">Cargando...</div>
    
 
      <!--
      <li v-for="rR in reportRange" :key="rR.id + rR.date">
        {{ rR.id }} - {{ rR.email }} - {{ rR.report || "No report" }} - Fecha: {{ rR.date }}
      </li>
    -->
    <ol v-if="maeStats.length">
      <li v-for="mae in maeStats" :key="mae.id">
        {{ mae.name || mae.id }} ({{ mae.email }}) — A: {{ mae.A }}, R: {{ mae.R }}, F: {{ mae.F }}, J: {{ mae.J }}
      </li>
    </ol>

  </div>
</template>

