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

    // Initialize or reuse a mae
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

// Date management 
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);

// Format it MAEs firebase format year-month-day
const year = yesterday.getFullYear();
const month = String(yesterday.getMonth() + 1).padStart(2, '0');
const day = String(yesterday.getDate()).padStart(2, '0');

const formatYesterday = `${year}-${month}-${day}`;

// One day
const loading = ref(true);
const selectedDate = ref(formatYesterday); // Loads previous day

// Date range 
const rangeLoading = ref(true); // Separates loading state for range data

// Temp default for semester
const startDate = ref('2025-08-18'); 
const endDate = ref(formatDate(today)); // Current date of semester, use aux funct

// Arrays for reports
const reports = ref([]);
const reportRange = ref([]); 

// Just to format dates year-month-day
// Expects a unix date object, returns a string w formatted date
function formatDate(unixDate) {
  const year = unixDate.getFullYear();
  const month = String(unixDate.getMonth() + 1).padStart(2, '0');
  const day = String(unixDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

onMounted(async () => {
  loading.value = true;
  loading.value = true;
  try {
    reports.value = await loadDayReport(selectedDate.value);
  } catch (error) {
    console.error('Error loading day report:', error);
  } finally {
    loading.value = false; 
  }

  rangeLoading.value = true; // Now retrieving this 
  reports.value = await loadDayReport(selectedDate.value); // Fetches attendance from that date from firebase
  try {
    reportRange.value = await loadRangeReport(startDate.value, endDate.value);
    console.log("ReportRange loaded:", reportRange.value.length, "entries");
    console.log("Computed stats:", maeStats.value);
  } catch (error) {
    console.error('Error loading range report:', error);
  } finally {
    rangeLoading.value = false;
  }
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
    const result = await getReportByDateRange(start, end); 
    console.log("📊 Raw range data:", result);
    //reportRange.value = result; 
    return result; 

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
        {{ r.id }} - {{ r.report }}
      </li>
    </ol>
  </div>

  <!-- Load data within range -->
  <div>
    <h2>Rango de fechas</h2>
    <p>Desde: {{ startDate }}</p>
    <p>Hasta: {{ endDate }}</p>
 
      <!--
      <li v-for="rR in reportRange" :key="rR.id + rR.date">
        {{ rR.id }} - {{ rR.email }} - {{ rR.report || "No report" }} - Fecha: {{ rR.date }}
      </li>
    -->
    <div v-if="rangeLoading">Cargando datos del rango...</div>
    <div v-else-if="maeStats.length === 0">No hay datos en este rango de fechas</div>
    <div v-else>
      <ol>
        <li v-for="mae in maeStats" :key="mae.id">
          <strong>{{ mae.id }} </strong> - A:{{ mae.A }} R:{{ mae.R }} F:{{ mae.F }} J:{{ mae.J }} <strong>Ratio: ({{mae.A}} {{ mae.count }})</strong>
        </li>
      </ol>
    </div>
    
  </div>
</template>

