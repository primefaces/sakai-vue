<script setup>
import { ref, onMounted } from 'vue';
import { getReportByDate } from '@/firebase/db/attendance';
import { getReportByDateRange } from '@/firebase/db/attendance';
import { computed } from 'vue'; // To get number of mae attendances 
import * as XLSX from 'xlsx'; // To export to excel 
import Dialog from 'primevue/dialog'; // To use dialog modal
import { FilterMatchMode } from 'primevue/api'; // Add filtering abilities

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

// To work w Excel exporting
const isFiltered = ref(false);
const showDialog = ref(false);

// To work w filters
const filters = ref({
  id: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

// Function to calculate the mae attendances in given range
const maeStats = computed(() => {
  const summaryMap = new Map();

  reportRange.value.forEach((entry) => {
    const uid = entry.id;
    const reportCode = entry.report;

    // Initialize or reuse a mae
    if (!summaryMap.has(uid)) {
      summaryMap.set(uid, {
        id: uid,
        //name: entry.name || '',
        //email: entry.email || '',
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

  // Use attendance vals to calc attendance percentage; but if their attendance is 0, then just set it == 0
  return Array.from(summaryMap.values()).map(mae => ({
    ...mae, 
    percentage: mae.count > 0 ? Math.round((mae.A / mae.count) * 100) : 0 
  }));
});

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
  rangeLoading.value = true; 

  try {
    // reports.value = await loadRangeReport(selectedDate.value); // Single date
    reportRange.value = await loadRangeReport(startDate.value, endDate.value);
    isFiltered.value = true; // Did filter og info using dates
  } catch (error) {
    console.error('Error loading day report:', error);
    isFiltered.value = false; 
  } finally {
    loading.value = false; 
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
    // Fetches attendance from that date from firebase
    const result = await getReportByDateRange(start, end); 
    //console.log("Raw range data:", result);
    //reportRange.value = result; 
    return result; 

  } catch (error) {
    console.error('Error loading report:', error);
    return [];
  }
};

// Function to load reports within range when Filtrar button is pressed 
// Add this function to handle filtering
const filterByDate = async () => {
  try {
    // For debug
    console.log('📅 Raw dates from calendar:', { 
      startDate: startDate.value, 
      endDate: endDate.value 
    });

    loading.value = true;
    rangeLoading.value = true;
    
    // Convert Date objects to strings if they're Date objects to load proper info 
    const start = startDate.value instanceof Date ? formatDate(startDate.value) : startDate.value;
    const end = endDate.value instanceof Date ? formatDate(endDate.value) : endDate.value;
    
    //console.log('Filtering from:', start, 'to:', end);
    
    // Update the reportRange w new data 
    reportRange.value = await loadRangeReport(start, end);
    isFiltered.value = true; // Added for excel to indicate when done filtering
    
  } catch (error) {
    console.error('Error filtering reports:', error);
    reportRange.value = [];
    isFiltered.value = false; // Didn't filter it correctly
  } finally {
    loading.value = false;
    rangeLoading.value = false;
  }
};

// Function to export excel 
const exportToExcel = () => {
  if (!isFiltered.value) {
    showDialog.value = true;
    return;
  }
  exportData();
};

// The info that gets exported from maeStats
const exportData = () => {
  const formattedData = maeStats.value.map(mae => ({
    'Matrícula': mae.id,
    'Asistencias esperadas': mae.count,
    'Proporción': `${mae.A} de ${mae.count}`,
    'Porcentaje': mae.count > 0 ? Math.round((mae.A / mae.count) * 100) : 0, //If have at least one attendance, calcs the %; if no attendance at all, leaves at 0
    'Asistencias': mae.A,
    'Justificados': mae.J,
    'Retrasos': mae.R,
    'Faltas': mae.F,
    
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Asistencias");
  XLSX.writeFile(workbook, "historial_asistencias.xlsx");
};

const confirmExportAction = () => {
  showDialog.value = false;
  exportData();
};
</script>

<template>
  <div class="sm:flex sm:justify-content-between mb-2 sm:mb-5">
    <h1 class="text-black text-6xl font-bold text-center m-0 sm:text-left">Historial de asistencia</h1>
  </div>

  <!-- Dates to view attendance -->
  <div class="flex md:flex-row flex-column mb-4">
          <Calendar v-model="startDate" placeholder="Fecha de Inicio" dateFormat="yy-mm-dd" showIcon class="mb-2 mr-3 w-3" />
          <span class="mx-3 text-4xl text-black font-bold">-</span>
          <Calendar v-model="endDate" placeholder="Fecha de Fin" dateFormat="yy-mm-dd" showIcon class="mb-2 mx-3 w-3" />
          <Button label="Filtrar" @click="filterByDate" class="mb-2 mx-3 w-2"></Button> <!-- Uses new funct to load vals -->
          <Button label="Exportar a Excel" @click="exportToExcel" class="mb-2 mx-3 w-3" :disabled="!isFiltered"></Button>
      </div>

  <!-- Table w data from attendance, default view for prev day -->
  <!-- note that the value typed in is what it will use-->
  <div class="card mb-0">
    <DataTable :value="maeStats" paginator :rows="50" dataKey="id"  :loading="rangeLoading" class="border-round-xl text-center"
    v-model:filters="filters" filterDisplay="row" removableSort
    responsiveLayout="stack" breakpoint="640px">
      <!-- Default while loading info -->
      <template #loading>Cargando información</template>

      <!-- MAE info -->
      <Column header="Matrícula" field="id">
        <template #body="{ data }">
          <a :href="`#/mae/${data.id}`" class="text-lg uppercase cursor-pointer font-semibold underline text-primary">{{ data.id }}</a>
        </template>
        <!-- Adding To filter by matrícula -->
        <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Matrícula" />
        </template>
      </Column>

      <Column header="Asistencias" field="A" class="attendance-green" sortable>
        <template #body="{ data }">
          <p class="text-lg">{{ data.A }}</p>
        </template>
      </Column>

      <Column header="Justificados" field="J" class="attendance-blue" sortable>
        <template #body="{ data }">
          <p class="text-lg">{{ data.J }}</p>
        </template>
      </Column>

      <Column header="Retrasos" field="R" class="attendance-yellow" sortable>
        <template #body="{ data }">
          <p class="text-lg">{{ data.R }}</p>
        </template>
      </Column>

      <Column header="Faltas" field="F" class="attendance-red" sortable>
        <template #body="{ data }">
          <p class="text-lg">{{ data.F }}</p>
        </template>
      </Column>

      <!-- Desglose de asistencia -->
      <Column header="Proporción asistencia" field="count" class="col-blue">
        <template #body="{ data }">
          <p class="text-lg font-semibold">{{ data.A }} de {{ data.count }}</p>
        </template>
      </Column>

      <Column header="Porcentaje cumplimiento" field="percentage" class="col-blue" sortable>
        <template #body="{ data }">
          <p class="text-lg font-semibold">{{ data.percentage }}%</p>
        </template>
      </Column>
    </DataTable>
  </div>

  <!-- Modal to confirm exporting info, it's in AdminAsesorias so might as well lol -->
  <Dialog v-model:visible="showDialog" header="Confirmar Exportación" modal>
    <p>¿Estás seguro de que deseas exportar todas las asistencias sin aplicar filtros?</p>
    <div class="flex justify-content-end mt-3">
      <Button label="Cancelar" icon="pi pi-times" @click="showDialog = false" class="p-button-text"></Button>
      <Button label="Aceptar" icon="pi pi-check" @click="confirmExportAction" auto-focus></Button>
    </div>
  </Dialog>

</template>

<style>
.col-blue {
  background-color: #bed2ff;
}

/* Attendance color mapping */
.attendance-green {
    background-color: #d4edda;
    /*border-left: 0.5rem solid #d4edda !important;*/
}

.attendance-red {
    background-color: #f8d7da;
}

.attendance-yellow {
    background-color: #fff3cd;
}

.attendance-blue {
    background-color: #cce5ff;
}

.text-center {
  text-align: center !important;
}

/* Center all DataTable headers and content */
.p-datatable .p-datatable-thead > tr > th,
.p-datatable .p-datatable-tbody > tr > td {
  text-align: center !important;
}

/* Center the content in cells */
.p-datatable .p-datatable-tbody > tr > td p,
.p-datatable .p-datatable-tbody > tr > td a {
  text-align: center !important;
  margin: 0 auto;
  display: block;
}

/* Make middle columns (2nd, 3rd, 4th, 5th) equal width with remaining space */
.p-datatable .p-datatable-thead > tr > th:nth-child(2),
.p-datatable .p-datatable-thead > tr > th:nth-child(3),
.p-datatable .p-datatable-thead > tr > th:nth-child(4),
.p-datatable .p-datatable-thead > tr > th:nth-child(5),
.p-datatable .p-datatable-tbody > tr > td:nth-child(2),
.p-datatable .p-datatable-tbody > tr > td:nth-child(3),
.p-datatable .p-datatable-tbody > tr > td:nth-child(4),
.p-datatable .p-datatable-tbody > tr > td:nth-child(5) {
  width: calc((100% - 14rem - 12rem - 10rem) / 4); /* Remaining space divided by 4 columns */
}

/* Set fixed width for Matrícula column */
.p-datatable .p-datatable-thead > tr > th:first-child,
.p-datatable .p-datatable-tbody > tr > td:first-child {
  width: 14rem;
  min-width: 14rem;
}

/* Set fixed width for last two columns */
.p-datatable .p-datatable-thead > tr > th:nth-child(6),
.p-datatable .p-datatable-tbody > tr > td:nth-child(6) {
  width: 12rem;
  min-width: 12rem;
}

.p-datatable .p-datatable-thead > tr > th:nth-child(7),
.p-datatable .p-datatable-tbody > tr > td:nth-child(7) {
  width: 10rem;
  min-width: 10rem;
}

/* Makes sure table uses full container width */
.p-datatable .p-datatable-table {
  table-layout: fixed;
  width: 100%;
}
</style>
