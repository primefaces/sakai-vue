<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { FilterMatchMode, FilterService } from 'primevue/api';
import { getMaes } from '@/firebase/db/users';

const router = useRouter();

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
    const dayLC = day.toLowerCase();
    switch (dayLC) {
        case 'monday': return 'bg-blue-600';
        case 'tuesday': return 'bg-green-600';
        case 'wednesday': return 'bg-yellow-600';
        case 'thursday': return 'bg-red-600';
        case 'friday': return 'bg-purple-600';
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

const onCardClick = (uid) => {
    router.push(`/mae/${uid}`);
}

const toggleSubjects = (mae) => {
    mae.showMoreSubjects = !mae.showMoreSubjects;
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
                    class="border-circle h-6rem w-6rem">
                        <Skeleton v-else shape="circle" size="5rem"></Skeleton>
                        <div class="relative w-full">
                            <a :href="`/#/mae/${mae.uid}`" class="pl-2 font-semibold text-xl text-black-alpha-90 hover:underline hover:text-primary truncate">
                                {{ mae.name }}
                            </a>
                            <div class="flex flex-row font-semibold pl-2">
                                <p>{{ mae.career }} |</p>
                                <p>{{ mae.uid }}</p>
                            </div>
                        </div>
                    </span>
                    <p class="font-bold text-2xl">Horarios</p>
                    <div class="flex flex-wrap">
                        <Tag v-for="(value, key) in mae.weekSchedule" :key="key" :class="getDayColor(key)" :value="translateDayToSpanish(key)" class="mr-2 mb-2"/>
                    </div>
                    <p class="font-bold text-2xl">Materias</p>
                    <div class="flex flex-wrap">
                        <Tag v-if="mae.subjects.length > 0" :class="getSubjectColor(mae.subjects[0].area)" :value="mae.subjects[0].name" class="mr-2 mb-2"/>
                        <div v-if="mae.subjects.length > 1">
                            <button @click="toggleSubjects(mae)" class="text-blue-500 mt-2">
                                {{ mae.showMoreSubjects ? '-' : '+' }} 
                            </button>
                            <div v-if="mae.showMoreSubjects">
                                <Tag v-for="subject in mae.subjects.slice(1)" :key="subject.id" :class="getSubjectColor(subject.area)" :value="subject.name" class="mr-2 mb-2"/>
                            </div>
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
