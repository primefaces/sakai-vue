
<script setup>
import { ref, onMounted, watch } from 'vue';
import { getTodaysMae } from '@/firebase/db/users';
import { getTodaysReport, updateReport } from '../firebase/db/attendance';


const loading = ref(true);
const maes = ref(null);
const report = ref(null);
const selectedId = ref(null);

const currentDay = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][new Date().getDay()];
const options = ref([
    { name: 'Asistencia', code: 'A' },
    { name: 'Falta', code: 'F' },
    { name: 'Retraso', code: 'R' },
    { name: 'Justificado', code: 'J' },
]);

onMounted(() => {

    getTodaysMae()
        .then((data) => {
            //console.log(data[0])
            maes.value = data;
            
        })
        .finally(() => {
            getTodaysReport()
                .then((data) => {
                    report.value = data;
                    console.log(report.value)
                    loading.value = false;
                })
        })
});

watch(report, (newValue, oldValue) => {
    if (oldValue) {
        const maeInfo = maes.value.find(mae => mae['uid'] === selectedId.value);
        console.log(maeInfo)
        updateReport(maeInfo, newValue[selectedId.value])
    }
  },
  { deep: true }
)

</script>


<template>
    <h1 class="text-black text-6xl font-bold mb-5 text-center sm:text-left">Coordinador</h1>
    <div class="card mb-0">

    <!-- TODO: Adjust row sizing -->
    <!-- TODO: implement responsive resizing -->
        <DataTable :value="maes" paginator :rows="50" dataKey="id" 
            :loading="loading" class="border-round-xl"
            responsiveLayout="stack" breakpoint="640px"
            >
            <!-- @rowSelect="onRowSelect" selectionMode="single" -->
            <template #empty>No se encontraron Maes. </template>
            <template #loading>Cargando información. Por favor espera.</template>
            <Column header="Matricula" field="uid" style="min-width: 15rem">
                <template #body="{ data }">
                    <a :href="`#/mae/${data.uid}`" class="text-lg uppercase cursor-pointer font-semibold underline text-primary">{{ data.uid }}</a>
                </template>
            </Column>

            <Column header="Nombre" field="name" style="min-width: 15rem">
                <template #body="{ data }">
                    <p class="text-lg font-semibold">{{ data.name }}</p>
                </template>
            </Column>

            <Column header="Horario"
                style="min-width: 6rem">
                <template #body="{ data }">
                    <!-- TODO: ask for hour display implementation -->
                    <div class="flex flex-wrap justify-content-evenly column-gap-2 row-gap-2">
                        <Tag v-for="(value, key) in data.weekSchedule[currentDay]" class="text-md mx-auto"
                         :value="`${value.start} - ${value.end} `"
                           rounded style="min-width: 3rem"/>
                    </div>
                </template>
            </Column>

            <Column header="Asistencia" style="min-width:8rem">
                <template #body="{ data }">
                    <Dropdown @click="selectedId = data.uid" v-if="report" v-model="report[data.uid]" :options="options" optionLabel="name" optionValue="code" placeholder="Selecciona asistencia" class="md:w-full max-w-1" />
                </template>
            </Column>
            <!-- <Column field="modalidad" header="Modalidad" :showFilterMenu="false" :filterMenuStyle="{ width: '6rem' }"
                style="min-width: 6rem">
                <template #body="{ data }">
                    <div class="flex justify-content-center">
                        <Tag :value="data.modalidad ?? 'Híbrida'" class="text-lg text-center" :severity="getSeverity(data.modalidad)" />
                    </div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <Dropdown v-model="filterModel.value" @change="filterCallback()" :options="statuses"
                        placeholder="Cualquiera" class="p-column-filter" style="min-width: 6rem" :showClear="true">
                        <template #option="slotProps">
                            <Tag :value="slotProps.option" :severity="getSeverity(slotProps.option)" />
                        </template>
                    </Dropdown>
                </template>
            </Column> -->
        </DataTable>
    </div>
</template>
