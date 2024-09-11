<script setup>
import { ref, computed, onMounted } from 'vue';

import { FilterMatchMode, FilterService } from 'primevue/api';
import { getMaes } from '@/firebase/db/users';


const maes = ref([]);
const ARRAY_CONTAINS = ref('ARRAY_CONTAINS');
const ARRAY_CONTAINS_ANY = ref('ARRAY_CONTAINS_ANY');
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    weekSchedule: { value: null, matchMode: ARRAY_CONTAINS_ANY.value },
    subjects: { value: null, matchMode: ARRAY_CONTAINS.value },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
});
const loading = ref(true);

onMounted(() => {
    getMaes().then((data) => {
        maes.value = data;
        loading.value = false;
    });

    FilterService.register(ARRAY_CONTAINS.value, (value, filter) => {
        if (!filter || filter.trim() === '') return true;
        if (!value) return false;

        const filterNormalized = filter.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        return value.some(item => {
            const idNormalized = item.id.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const nameNormalized = item.name.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return idNormalized.toLowerCase().includes(filterNormalized.toLowerCase()) ||
                   nameNormalized.toLowerCase().includes(filterNormalized.toLowerCase());
        });
    });

    FilterService.register(ARRAY_CONTAINS_ANY.value, (value, filter) => {
        if (!filter || filter.length === 0) return true;
        if (!value || value.length === 0) return false;

        const normalizedFilter = filter.map(day => translateDayToEnglish(day));
        return Object.keys(value).some(dayArray => {
            return normalizedFilter.includes(normalizeDay(dayArray));
        });
    });
});

function normalizeDay(day) {
    return day.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function translateDayToSpanish(day) {
    const daysMapping = {
        'monday': 'Lunes',
        'tuesday': 'Martes',
        'wednesday': 'Miércoles',
        'thursday': 'Jueves',
        'friday': 'Viernes',
        'saturday': 'Sábado',
        'sunday': 'Domingo'
    };
    return daysMapping[day] || 'Invalid day';
}

function translateDayToEnglish(day) {
    const daysMapping = {
        'Lunes': 'monday',
        'Martes': 'tuesday',
        'Miércoles': 'wednesday',
        'Jueves': 'thursday',
        'Viernes': 'friday',
        'Sábado': 'saturday',
        'Domingo': 'sunday'
    };
    return daysMapping[day] || 'Invalid day';
}

function getDayColor(day) {
    if (!day) return '';  // Retorna una cadena vacía si el día es indefinido

    const dayLC = day.toLowerCase();
    switch (dayLC) {
        case 'monday': return 'bg-blue-600';
        case 'tuesday': return 'bg-green-600';
        case 'wednesday': return 'bg-yellow-600';
        case 'thursday': return 'bg-red-600';
        case 'friday': return 'bg-purple-600';
        default: return '';  // Retorna una cadena vacía si no hay un caso que coincida
    }
}

function getSubjectColor(area) {
    switch (area) {
        case 'ING': return 'bg-cyan-600';
        case 'NEG': return 'bg-blue-600';
        case 'SLD': return 'bg-teal-600';
        case 'CIS': return 'bg-red-600';
        case 'AMC': return 'bg-green-600';
        case 'ART': return 'bg-purple-600';
        default: return 'bg-yellow-600';
    }
}


const filteredMaes = computed(() => {
    return maes.value.filter(mae => {
        return (
            (!filters.value.global.value || mae.name.toLowerCase().includes(filters.value.global.value.toLowerCase())) &&
            (!filters.value.name.value || mae.name.toLowerCase().includes(filters.value.name.value.toLowerCase())) &&
            (!filters.value.weekSchedule.value || filters.value.weekSchedule.value.some(day => mae.weekSchedule[day])) &&
            (!filters.value.subjects.value || mae.subjects.some(subject => filters.value.subjects.value.includes(subject.name))) &&
            (!filters.value.status.value || mae.status === filters.value.status.value)
        );
    });
});


const toggleSubjects = (mae) => {
    mae.showMoreSubjects = !mae.showMoreSubjects;
}


const closestDay = (schedule) => {
    const today = new Date().getDay();
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    // Filtra los días que están definidos en el horario
    const daysInSchedule = Object.keys(schedule)
        .filter(day => Array.isArray(schedule[day]) && schedule[day].length > 0) // Verifica si el día tiene valores
        .map(day => daysOfWeek.indexOf(day));

    if (daysInSchedule.length === 0) return null;  // Si no hay días, retorna null

    const upcomingDays = daysInSchedule.filter(day => day >= today);

    const closestDay = upcomingDays.length ? upcomingDays[0] : daysInSchedule[0];

    return daysOfWeek[closestDay];
};

const translateClosestDay = (schedule) => {
    const day = closestDay(schedule);
    if (!day) return 'Sin horario';  // Si no hay día más cercano, retorna un mensaje
    const hours = formatScheduleHours(schedule[day]);

    return `${translateDayToSpanish(day)} ${hours}`;
};


// Estilización de materias y cálculo de cuántas quedan
const subjectCountDisplay = (subjects) => {
    if (subjects.length <= 1) return null;
    return `+${subjects.length - 1}`;
}

function formatScheduleHours(hours) {
    console.log("Estas son las horas", hours);

    if (!Array.isArray(hours) || hours.length === 0) return '';

    // Convertir horas a objetos de tipo Date
    const timeEntries = hours.map(hour => {
        const start = new Date(`1970-01-01T${hour.start}:00Z`);
        const end = new Date(`1970-01-01T${hour.end}:00Z`);
        return { start, end };
    });

    // Ordenar los horarios por hora de inicio
    const sortedEntries = timeEntries.sort((a, b) => a.start - b.start);

    let result = '';
    for (let i = 0; i < sortedEntries.length; i++) {
        const { start, end } = sortedEntries[i];

        const startHour = start.toISOString().substr(11, 5);
        const endHour = end.toISOString().substr(11, 5);

        // Si la siguiente entrada empieza en la misma hora que esta termina
        if (i < sortedEntries.length - 1 && sortedEntries[i + 1].start.getTime() === end.getTime()) {
            result += `${startHour} - `;
        } else {
            result += `${startHour} - ${endHour}`;
            if (i < sortedEntries.length - 1) result += ', ';
        }
    }
    result = ' • ' + result 
    return result;
}



</script>

<template>
    <h1 class="text-black text-6xl font-bold mb-5 text-center sm:text-left">Horarios</h1>
    <div class="p-grid">
        <div v-if="loading" class="text-center col-12">Cargando información...</div>
        <div v-for="mae in filteredMaes" :key="mae.uid" class="p-col-12 p-md-4">
            <div class="card p-4 border rounded-lg shadow-md cursor-pointer">
                <div class="flex flex-column">
                    <span class="flex flex-row">
                        <img v-if="true" :src="mae.profilePictureUrl" alt="Foto de perfil"
                    class="border-circle h-5rem w-5rem">
                        <Skeleton v-else shape="circle" size="5rem"></Skeleton>
                        <div class="relative w-full  pl-4 pt-3">
                            <span class="font-bold pb-2 text-lg">

                                {{ mae.name }}
                            </span>
                            <div class="flex flex-row  text-lg">
                                <p class="pr-2">{{ mae.career }} </p>
                                <p class="pr-2">|</p>  
                                <p>{{ mae.uid }}</p>
                            </div>
                        </div>
                    </span>
                    <!-- Mostrar el día más cercano -->
                    <!-- Mostrar el día más cercano y las horas -->
                    <p class="font-bold text-lg mt-2">Horarios</p>
                    <div class="flex flex-wrap">
                        <Tag :class="getDayColor(closestDay(mae.weekSchedule))" :value="translateClosestDay(mae.weekSchedule)" class="mr-2 mb-2 p-2 px-3 border-round-2xl"/>
                    </div>

                     <!-- Materias: Mostrar solo una y cuántas quedan -->
                    <p class="font-bold text-lg mt-1">Materias</p>
                    <div class="flex items-center text-md">
                        <Tag v-if="mae.subjects.length > 0" :class="getSubjectColor(mae.subjects[0].area)" :value="mae.subjects[0].name" class="mr-2 mb-2 p-2 px-3 border-round-2xl	"/>
                        <div v-if="mae.subjects.length > 1" >
                            <button @click="toggleSubjects(mae)" class="p-2  text-gray-500 " >
                                {{ subjectCountDisplay(mae.subjects ) }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>



<style scoped>
.custom-skeleton {
  background-color: #3498db;
  border-color: #2980b9;
}
.card {
  background-color: #fff;
  border: 1px solid #ddd;
}
button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}
</style>


