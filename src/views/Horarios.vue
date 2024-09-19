<script setup>
import { ref, computed, onMounted } from 'vue';
import { FilterMatchMode, FilterService } from 'primevue/api';
import { getMaes, getClosestDayAndStartTime} from '@/firebase/db/users';
import {
    normalize,
    translateDayToSpanish,
    translateDayToEnglish,
    getDayColor,
    getSubjectColor,
    formatScheduleHours,
    closestDay,
    weekCountDisplay,
    subjectCountDisplay,
} from '@/utils/HorarioUtils';
const maes = ref([]);
const ARRAY_CONTAINS = ref('ARRAY_CONTAINS');
const ARRAY_CONTAINS_ANY = ref('ARRAY_CONTAINS_ANY');
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    weekSchedule: { value: null, matchMode: FilterMatchMode.CONTAINS  },
    subjects: { value: null, matchMode: ARRAY_CONTAINS.value },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
});
const loading = ref(true);
const daysOfWeek = [
    { label: 'Todos los días', value: null },
    { label: 'Lunes', value: 'monday' },
    { label: 'Martes', value: 'tuesday' },
    { label: 'Miércoles', value: 'wednesday' },
    { label: 'Jueves', value: 'thursday' },
    { label: 'Viernes', value: 'friday' },

];

onMounted(() => {
    getMaes().then((data) => {
        maes.value = data;
        loading.value = false;
    });

    FilterService.register(ARRAY_CONTAINS.value, (value, filter) => {
        if (!filter || filter.trim() === '') return true;
        if (!value) return false;

        const filterNormalized = filter.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

        return value.some(item => {
            const idNormalized = item.id.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            const nameNormalized = item.name.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            return idNormalized.includes(filterNormalized) || nameNormalized.includes(filterNormalized);
        });
    });

    FilterService.register(ARRAY_CONTAINS_ANY.value, (value, filter) => {
        if (!filter || filter.length === 0) return true;
        if (!value || value.length === 0) return false;

        const normalizedFilter = filter.map(day => translateDayToEnglish(day));
        return Object.keys(value).some(dayArray => {
            return normalizedFilter.includes(normalize(dayArray));
        });
    });
});


const filteredMaes = computed(() => {
    const globalFilter = filters.value.global.value ? filters.value.global.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : null;
    const nameFilter = filters.value.name.value ? filters.value.name.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : null;
    const subjectsFilter = filters.value.subjects.value ? filters.value.subjects.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : null;
    const weekScheduleFilter = filters.value.weekSchedule.value ? filters.value.weekSchedule.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : null;
    const statusFilter = filters.value.status.value ? filters.value.status.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : null;

    return maes.value.filter(mae => {
        const hasSubject = subjectsFilter
            ? mae.subjects.some(subject => {
                const subjectNameNormalized = subject.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                return subjectNameNormalized.includes(subjectsFilter);
            })
            : true;

        const hasWeekSchedule = weekScheduleFilter
            ? mae.weekSchedule[weekScheduleFilter] && mae.weekSchedule[weekScheduleFilter].length > 0
            : true;

        return (
            (!globalFilter || mae.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(globalFilter)) &&
            (!nameFilter || mae.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(nameFilter)) &&
            hasWeekSchedule &&
            hasSubject &&
            (!statusFilter || mae.status.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(statusFilter))
        );
    });
});

function getDisplayedDay(weekSchedule) {
    const closestDayData = getClosestDayAndStartTime(weekSchedule);
    const displayedDay = filters.value.weekSchedule.value || closestDayData.day;
    
    if (displayedDay) {
        const scheduleForDay = weekSchedule[displayedDay] || [];
        const hours = formatScheduleHours(scheduleForDay);
        return `${translateDayToSpanish(displayedDay)} ${hours}`;
    } else {
        return 'Sin horario';
    }
}


function getDisplayedSubject(subjects) {
    if (!filters.value.subjects.value) {
        return subjects.length > 0 ? subjects[0] : { name: 'Sin materia', area: '' };
    }

    const normalizedFilter = filters.value.subjects.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const filteredSubject = subjects.find(subject => 
        subject.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalizedFilter)
    );

    return filteredSubject || (subjects.length > 0 ? subjects[0] : { name: 'Sin materia', area: '' });
}
</script>

<template>
    <h1 class="text-black text-6xl font-bold mb-5 text-center sm:text-left">Horarios</h1>
    <h2 class="text-black text-3xl font-semibold mb-5 text-center sm:text-left">Filtros</h2>
    <!-- Filtros -->
    <div class="flex md:flex-row flex-column mb-4">
            <InputText v-model="filters.name.value" placeholder="Nombre..." class="mb-2 md:mr-3 md:w-6 w-full" />
            <InputText v-model="filters.subjects.value" placeholder="Materias..." class="mb-2 md:mx-3 md:w-6 w-full" />

            <Dropdown 
                v-model="filters.weekSchedule.value"
                :options="daysOfWeek" 
                option-label="label" 
                option-value="value"
                placeholder="Cualquiera..." 
                class="mb-2 md:mx-3 md:w-4 w-full" 

            />
        </div>
    <div class="grid">
        <div v-if="loading" class="text-center col-12">Cargando información...</div>
        

        <!-- Cada tarjeta ocupa 1/3 del ancho y se asegura de tener la misma altura -->
        <div v-for="mae in filteredMaes" :key="mae.uid" class="col-12 md:col-6 lg:col-4 p-2">
            <a :href="`#/mae/${mae.uid}`" class="block transition-transform duration-300 transform hover:scale-105">
                <div class="card h-full p-4 border-round-3xl shadow-md cursor-pointer flex flex-column justify-between">
                    <div class="flex flex-column">
                        <span class="flex flex-row items-center">
                            <img v-if="mae.profilePictureUrl" :src="mae.profilePictureUrl" alt="Foto de perfil"
                            class="border-circle h-5rem w-5rem">
                            <Skeleton v-else shape="circle" size="5rem"></Skeleton>
                            <div class="relative w-full pl-4 pt-3">
                                <span class="font-bold text-lg text-black-alpha-90 truncate"
                                style="display: block; max-width: 65%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
                                    {{ mae.name }}
                                </span>
                                <div class="flex flex-row text-lg text-black-alpha-90 truncate"
                                style="display: block; max-width: 80%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
                                    <p class="pr-2">{{ mae.career }} </p>
                                    <p class="pr-2">|</p>  
                                    <p>{{ mae.uid }}</p>
                                </div>
                            </div>
                        </span>

                        <p class="font-bold text-lg mt-2 text-black-alpha-90">Horarios</p>
                        <div class="flex flex-wrap">
                            <Tag :class="getDayColor(filters.weekSchedule.value || closestDay(mae.weekSchedule))" 
                            :value="getDisplayedDay(mae.weekSchedule)" 
                            class="mr-2 mb-2 p-2 px-3 border-round-2xl"/>
                            
                            <div v-if="Object.keys(mae.weekSchedule).length > 1">
                                <button class="p-2 text-gray-500">
                                    {{ weekCountDisplay(mae.weekSchedule) }}
                                </button>
                            </div>
                        </div>

                        <p class="font-bold text-lg mt-1 text-black-alpha-90">Materias</p>
                        <div class="flex items-center text-md">
                            <Tag :class="getSubjectColor(getDisplayedSubject(mae.subjects).area)"  style="display: block; max-width: 80%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;" :value="getDisplayedSubject(mae.subjects).name" class="mr-2 mb-2 p-2 px-3 border-round-2xl"/>
                            <div v-if="mae.subjects.length > 1">
                                <button class="p-2 text-gray-500" >
                                    {{ subjectCountDisplay(mae.subjects) }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    </div>
</template>

<style scoped>
.card {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;
}

.custom-skeleton {
    background-color: #3498db;
    border-color: #2980b9;
}

button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
}

a {
    display: block;
    text-decoration: none;
}

a:hover .card {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>