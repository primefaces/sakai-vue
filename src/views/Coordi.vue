<script setup>
import { ref, onMounted, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { getTodaysMae, getUser, incrementTotalTime } from '@/firebase/db/users';
import { addRegister, getTodaysReport, updateReport } from '../firebase/db/attendance';
import { getUsersWithActiveSession } from '@/firebase/db/users';

const toast = useToast();

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

watch(report, (newValue, oldValue) => {
    if (oldValue) {
        const maeInfo = maes.value.find(mae => mae['uid'] === selectedId.value);
        updateReport(maeInfo, newValue[selectedId.value]);
    }
}, { deep: true });

const showDialogRegister = ref(false);

const maeId = ref('');
const hours = ref(0);
const date = ref(new Date());
const maeInfo = ref(null);
const activeMAEs = ref([]);

watch(maeId, async (newValue) => {
    if (newValue.length === 9) {
        maeInfo.value = await getUser(maeId.value.toLowerCase().trim());
    }
});

const addTime = async () => {
    try {
        await incrementTotalTime(maeId.value.toLowerCase().trim(), hours.value);
        toast.add({ severity: 'success', summary: 'Guardado exitoso', detail: 'Se agregó el tiempo al MAE seleccionado', life: 3000 });
        maeInfo.value = null;
        maeId.value = '';
        hours.value = 0;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al tratar de guardar los cambios', life: 5000 });
    }

    showDialogRegister.value = false;
};

const addReport = async () => {
    try {
        await addRegister(maeInfo.value, date.value);
        toast.add({ severity: 'success', summary: 'Guardado exitoso', detail: 'Se generó el registro del MAE seleccionado', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al tratar de guardar los cambios', life: 5000 });
    }
    showDialogRegister.value = false;
};

onMounted(async () => {
    try {
        activeMAEs.value = await getUsersWithActiveSession(); // Obteniendo los MAEs activos
        maes.value = await getTodaysMae(); // Obteniendo los MAEs del día de hoy
        report.value = await getTodaysReport(); // Obteniendo el reporte del día de hoy
    } catch (error) {
        console.error('Error al cargar datos:', error);
    } finally {
        loading.value = false;
    }
});

const getSubjectColor = (area) => {
    console.log(area)
    switch (area) {
        case 'Ingeniería y Ciencias':
            return 'bg-cyan-600';
        case 'Negocios':
            return 'bg-blue-600';
        case 'Salud':
            return 'bg-teal-600';
        case 'Derecho, Economía y Relaciones Internacionales':
            return 'bg-red-600';
        case 'Ambiente Construido':
            return 'bg-green-600';
        case 'Estudios Creativos':
            return 'bg-purple-600';
        default:
            return 'bg-yellow-600';
    }
}

</script>

<template>
    <div class="sm:flex sm:justify-content-between mb-2 sm:mb-5">
        <h1 class="text-black text-6xl font-bold text-center m-0 sm:text-left">Coordinador</h1>
        <Button @click="showDialogRegister = true" label="Agregar horas" icon="pi pi-pencil" size="large" class="max-h-full w-full sm:w-fit" />
    </div>
    <div class="card mb-0">

        <DataTable :value="maes" paginator :rows="50" dataKey="id" 
            :loading="loading" class="border-round-xl"
            responsiveLayout="stack" breakpoint="640px"
            >
            <template #empty>No se encontraron Maes.</template>
            <template #loading>Cargando información. Por favor espera.</template>

            <Column header="Matricula" field="uid" style="min-width: 8rem">
                <template #body="{ data }">
                    <a :href="`#/mae/${data.uid}`" class="text-lg uppercase cursor-pointer font-semibold underline text-primary">{{ data.uid }}</a>
                </template>
            </Column>

            <Column header="Nombre" field="name" style="min-width: 10rem">
                <template #body="{ data }">
                    <p class="text-lg font-semibold">{{ data.name }}</p>
                </template>
            </Column>

            <Column header="Carrera" field="name" style="min-width: 5rem">
                <template #body="{ data }">
                    <div :class="`flex rounded-full  ${getSubjectColor(data.area)}`">
                        <p class="text-lg p-1 mx-auto text-white md:text-md text-xs text-center w-full md:w-fi rounded-full">
                            {{ data.career }}
                        </p>
                    </div>
                </template>
            </Column>

            <Column header="Horario" style="min-width: 6rem">
                <template #body="{ data }">
                    <div class="flex flex-wrap justify-content-evenly column-gap-2 row-gap-2">
                        <Tag v-for="(value, key) in data.weekSchedule[currentDay]" class="text-md mx-auto"
                            :value="`${value.start} - ${value.end} `"
                            rounded style="min-width: 6rem"/>
                    </div>
                </template>
            </Column>

            <Column header="Estado" style="min-width: 6rem; text-align: center;">
                <template #body="{ data }">            
                    <span :class="{'status-dot': true, 
                    'active': activeMAEs.some(mae => mae.uid === data.uid),
                     'inactive': !activeMAEs.some(mae => mae.uid === data.uid) }"></span>                   
                </template>
            </Column>

            <Column header="Asistencia" style="min-width:8rem">
                <template #body="{ data }">
                    <Dropdown 
                        @click="selectedId = data.uid" 
                        v-if="report" 
                        v-model="report[data.uid]" 
                        :options="options" 
                        optionLabel="name" 
                        optionValue="code" 
                        placeholder="Selecciona asistencia" 
                        class="md:w-full max-w-1"
                        :class="{
                            'attendance-green': report[data.uid] === 'A',
                            'attendance-red': report[data.uid] === 'F',
                            'attendance-yellow': report[data.uid] === 'R',
                            'attendance-blue': report[data.uid] === 'J'
                        }"
                    />
                </template>
            </Column>
        </DataTable>
    </div>
    <!-- FIX: the coordi can put himself hours  -->
    <Dialog v-model:visible="showDialogRegister" modal header="Crear registro" class="md:w-4">
        
        <p class="font-bold text-lg">Matricula del MAE</p>
        <InputText class="w-full" placeholder="A01234567" v-model="maeId"/>
        <Message  v-if="maeInfo">MAE: {{ maeInfo.name }} - {{ maeInfo.email }}</Message>

        <p class="font-bold text-lg mt-4">Agregar horas</p>
        <p>Selecciona un MAE para agregar horas a su registro si se le olvidó cerrar su sesión</p>
        <InputNumber class="w-full mb-2" v-model="hours" inputId="integeronly" suffix=" hrs" />
        <div class="flex justify-content-end">
            <Button @click="addTime" type="button" label="Agregar horas" :disabled="maeInfo == null || !hours"></Button>
        </div>

        <p class="font-bold">Registrar sesión</p>
        <p>Agrega un registro adicional a la asistencia si hay un MAE reponiendo horas</p>
        <Calendar class="w-full mb-2" v-model="date" />
        <div class="flex justify-content-end mb-2">
            <Button @click="addReport" type="button" label="Registrar sesión" :disabled="maeInfo == null || !date"></Button>
        </div>

        <div class="flex justify-content-end">
            <Button type="button" label="Cerrar" severity="secondary" @click="showDialogRegister = false"></Button>
        </div>
    </Dialog>
</template>

<style>
.attendance-green {
    background-color: #d4edda;
    color: #155724;
}

.attendance-red {
    background-color: #f8d7da;
    color: #721c24;
}

.attendance-yellow {
    background-color: #fff3cd;
    color: #856404;
}

.attendance-blue {
    background-color: #cce5ff;
    color: #004085;
}

.status-dot {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
}

.active {
    background-color: #28a745; /* Verde */
}

.inactive {
    background-color: #6c757d; /* Gris */
}
</style>
