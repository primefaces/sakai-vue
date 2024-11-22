<script setup>
import { getSubjectColor, pointsRules } from '@/utils/CoordiUtils';
import { ref, onMounted, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { getTodaysMae, getUser, incrementTotalTime, getCurrentUser } from '@/firebase/db/users';
import { addRegister, getTodaysReport, updateReport } from '../firebase/db/attendance';
import { getUsersWithActiveSession, updatePoints } from '@/firebase/db/users';
import { nextTick } from 'vue';

const toast = useToast();
const loading = ref(true);
const maes = ref(null);
const report = ref(null);
const selectedId = ref(null);
const userInfo = ref(null);
const ubicacion = ref(true);

const currentDay = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][new Date().getDay()];
const options = ref([
    { name: 'Asistencia', code: 'A' },
    { name: 'Falta', code: 'F' },
    { name: 'Retraso', code: 'R' },
    { name: 'Justificado', code: 'J' },
]);

// Calcula la distancia entre dos puntos geográficos usando la fórmula de Haversine
const toRadians = (degree) => degree * (Math.PI / 180);

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Radio de la Tierra en metros
    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

const checkLocationAndAttendance = () => {
  const fixedLat = 25.650472; 
  const fixedLon = -100.289667;

  return new Promise((resolve, reject) => {
    if (userInfo.value.role !== 'admin' || userInfo.value.role !== 'coordi' ) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;

          const distance = calculateDistance(userLat, userLon, fixedLat, fixedLon);
            
          if (distance <= 15) {
            console.log('El usuario está dentro del rango de 15 metros. Puede registrar asistencia.');
            console.log(distance)
            ubicacion.value = true;
            resolve(true);
          } else {
            console.log('El usuario está fuera del rango de 15 metros. No puede registrar asistencia.');
            console.log(distance)
            toast.add({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'No se puede poner asistencia estas fuera de rango ', 
                life: 5000 
            });
            ubicacion.value = false;
            resolve(false);
          }
        }, (error) => {
          console.error("Error al obtener la ubicación: ", error);
          reject(error);
        });
      } else {
        console.log("La geolocalización no está disponible en este navegador.");
        reject(new Error("La geolocalización no está disponible"));
      }
    } else {
      console.log('El usuario es admin y no requiere comprobación de ubicación.');
      ubicacion.value = true;
      console.log(ubicacion.value, "ubicacion")
      resolve(true);
    }
  });
};

const handlePointsUpdate = async (uid, newAttendance) => {
    const points = pointsRules[newAttendance] || 0;
    await updatePoints(uid, points); 
   
    if (newAttendance !== "C") {
        toast.add({ severity: 'success', summary: 'Se ha actualizado su asistencia ', detail: 'Se ha actualizo de forma correcta', life: 3000 });
    }
};

watch(report, async (newValue, oldValue) => {
    if (oldValue) {
        await checkLocationAndAttendance();
     
        if (!ubicacion.value) {
            console.error('No se pudo pasar asistencia');
            return;
        }

        if (!userInfo.value) {
            console.error('userInfo is undefined');
            return;
        }
        
        const maeInfo = maes.value.find(mae => mae.uid === selectedId.value);
        const uidUser = userInfo.value.uid;

        if (maeInfo && maeInfo.uid === uidUser && maeInfo.role === "coordi")  {
            toast.add({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'No te puedes poner autoasistencia', 
                life: 5000 
            });
            return;
        } else {
            const previousAttendance = initialReport.value[selectedId.value];
            const newAttendanceValue = newValue[selectedId.value];
            updateReport(maeInfo, newAttendanceValue);

            if (previousAttendance === undefined) {
                handlePointsUpdate(maeInfo.uid, newAttendanceValue);
                handlePointsUpdate(userInfo.value.uid, "C");
            }
        }
    }
}, { deep: true });

const showDialogRegister = ref(false);
const maeId = ref('');
const hours = ref(0);
const date = ref(new Date());
const maeInfo = ref(null);
const activeMAEs = ref([]);
const initialReport = ref(null);

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
        userInfo.value = await getCurrentUser();
        activeMAEs.value = await getUsersWithActiveSession(); 
        maes.value = await getTodaysMae(); 
        report.value = await getTodaysReport(); 
        initialReport.value = JSON.parse(JSON.stringify(report.value)); 
        await checkLocationAndAttendance();
        maes.value.forEach(mae => {
            const scheduleToday = mae.weekSchedule[currentDay];
            if (scheduleToday) {        
                scheduleToday.forEach(({ start, end }) => {
                    handleAutoMarkAbsence(start, end, mae.uid);
                });
            }
        });
    } catch (error) {
        console.error('Error al cargar datos:', error);
    } finally {
        loading.value = false;
    }
});

const handleAutoMarkAbsence = async (startTime, endTime, uid) => {
    const now = new Date();
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const startDateTime = new Date();
    const endDateTime = new Date();
    startDateTime.setHours(startHour, startMinute, 0, 0);
    endDateTime.setHours(endHour, endMinute, 0, 0);
    const diffInMinutes = (now - startDateTime) / 60000;
    const activo = activeMAEs.value.some(mae => mae.uid === uid);

    if (activo && diffInMinutes > 45 && now < endDateTime && report.value[uid] === 'F') {
        const maeInfo = maes.value.find(mae => mae.uid === uid);
        report.value[uid] = 'R';
        report.value = { ...report.value };
        updateReport(maeInfo, 'R');
        await updatePoints('jackpot', 10);
        await updatePoints(uid, 8);
        await nextTick();
    }
    if (activo && diffInMinutes > 20 && diffInMinutes < 40 && report.value[uid] !== 'A' &&
        report.value[uid] !== 'J' &&
        report.value[uid] !== 'R' &&
        report.value[uid] !== 'F') {
        const maeInfo = maes.value.find(mae => mae.uid === uid);
        report.value[uid] = 'A';
        report.value = { ...report.value };
        updateReport(maeInfo, 'A');
        await updatePoints('jackpot', 10);
        await updatePoints(uid, 8);
        await nextTick();
    }
    if (
        diffInMinutes > 40 &&
        report.value[uid] !== 'A' &&
        report.value[uid] !== 'J' &&
        report.value[uid] !== 'R' &&
        report.value[uid] !== 'F'
        &&
        report.value[uid] !== 'C'
      ) {
        const maeInfo = maes.value.find(mae => mae.uid === uid);
        report.value[uid] = 'F';
        report.value = { ...report.value };
        updateReport(maeInfo, 'F');
        await updatePoints('jackpot', 10);
        await updatePoints(uid, -5);
        await nextTick();
      } 
  
};
</script>

<template>
    <div class="sm:flex sm:justify-content-between mb-2 sm:mb-5">
        <h1 class="text-black text-6xl font-bold text-center m-0 sm:text-left">Asistencia</h1>
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
                    <div :class="`flex border-round-3xl px-2 ${getSubjectColor(data.area)}`">
                        <p class="text-lg p-1 mx-auto text-white md:text-md text-xs text-center w-full md:w-fi ">
                            {{ data.career }}
                        </p>
                    </div>
                </template>
            </Column>

            <Column header="Horario" style="min-width: 6rem">
                <template #body="{ data }">
                    <div class="flex flex-wrap justify-content-evenly column-gap-2 row-gap-2">
                        <Tag v-for="(value, key) in data.weekSchedule[currentDay]" class="text-md mx-auto py-2 "
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
                    @click="selectedId = data.uid " 
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
                        :disabled="!ubicacion " 
                        
                    />

                </template>
            </Column>
        </DataTable>
    </div>
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
    background-color: #28a745;
}

.inactive {
    background-color: #6c757d; 
}
</style>
