<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { getMaes } from '../firebase/db/attendance';

// Para poder acceder los datos
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase/db/attendance'; 

const toast = useToast();

const loading = ref(true);
const maes = ref(null);

const filters = ref({
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    uid: { value: null, matchMode: FilterMatchMode.CONTAINS },
    role: { value: null, matchMode: FilterMatchMode.IN },
});

const roles = ref(["mae", "coordi", "subjectCoordi", "admin","publi","tec"])

onMounted(() => {
  getMaes()
    .then((data) => {
      maes.value = data;
      loading.value =false;
    })
    .catch(() => {
      maes.value = [];
    })
});


// Look for student attendance 
async function countAttendanceForAllStudents() {
    const studentMap = new Map();

    // Get all attendance dates
    const attendanceCol = collection(db, "attendance");
    const attendanceSnap = await getDocs(attendanceCol);

    for (const dateDoc of attendanceSnap.docs) {
        const date = dateDoc.id;

        // Get the report collection for each date
        const reportCol = collection(db, "attendance", date, "report");
        const reportSnap = await getDocs(reportCol);

        reportSnap.forEach((studentDoc) => {
            const uid = studentDoc.id;
            const data = studentDoc.data();
            const status = data.report;

            // Sets up map w student id, attendance points starting at 0, and total of supposed attendance 
            if (!studentMap.has(uid)) {
                studentMap.set(uid, { uid, points: 0, totalReports: 0 });
            }

            // Checks student attended  
            const studentData = studentMap.get(uid);
            if (status === "A") {
                studentData.points += 1;
            }
            else {
                studentData.totalReports += 1;
            }
        });
    }

    // Convert Map to Array to display it easier
    return Array.from(studentMap.values());
}
</script>

<template>
    <div class="sm:flex sm:justify-content-between mb-2 sm:mb-5">
        <h1 class="text-black text-6xl font-bold text-center m-0 sm:text-left">Historial de asistencia</h1>

        <!-- Intento de hacer tabla 
        <DataTable :value="maes" paginator :rows="50" dataKey="id" 
            :loading="loading" class="border-round-xl"
            v-model:filters="filters" filterDisplay="row" removableSort
            responsiveLayout="stack" breakpoint="640px"
            >
            <!-- Case empty 
            <template #empty>No se encontraron Maes. </template>
             Case loading 
            <template #loading>Cargando información. Por favor espera.</template>


            <Column header="Matricula" field="uid">
                <template #body="{ data }">
                    <a :href="`#/mae/${data.uid}`" class="text-lg uppercase cursor-pointer font-semibold underline text-primary">{{ data.uid }}</a>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Matricula" />
                </template>
            </Column>

            <Column header="Nombre" field="name">
                <template #body="{ data }">
                    <p class="text-lg font-semibold">{{ data.name }}</p>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Nombre" />
                </template>
            </Column>

            <Column header="Rol" field="role">
                <template #body="{ data }">
                    <p class="text-lg font-semibold uppercase">{{ data.role }}</p>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <MultiSelect v-model="filterModel.value" @change="filterCallback()" :options="roles" placeholder="Cualquiera" class="p-column-filter" style="min-width: 14rem" :maxSelectedLabels="1">
                        <template #option="slotProps">
                            <div class="flex align-items-center gap-2">
                                <span class="uppercase"> {{ slotProps.option }}</span>
                            </div>
                        </template>
                    </MultiSelect>
                </template>
            </Column>

            <Column header="Asesorías" field="asesorias" sortable>
                <template #body="{ data }">
                    <p class="text-lg font-semibold">{{ Math.floor(Math.random() * 21) + 10 }}</p>
                </template>
            </Column>
            <Column header="Horas" field="totalTime" sortable>
                <template #body="{ data }">
                    <p class="text-lg font-semibold">{{ Math.round(((data.totalTime ?? 0) / 60) * 100) / 100 }}</p>
                </template>
            </Column>
            <Column header="Horario" field="totalTime">
              <template #body="{ data }">
                <i v-if="data.weekSchedule && typeof data.weekSchedule === 'object' && Object.keys(data.weekSchedule).length > 0" class="pi pi-check-circle text-green-500"></i>
                <i v-else class="pi pi-times-circle text-red-500"></i>
              </template>
            </Column>
            <Column header="Materias" field="totalTime">
                <template #body="{ data }">
                    <p class="text-lg font-semibold">{{ data.subjects ? data.subjects.length : 0 }}</p>
                </template>
            </Column>
        </DataTable> -->
    </div>
</template>