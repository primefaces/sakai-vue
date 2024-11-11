<script setup>
import { ref, onMounted, computed } from 'vue';
import { getCurrentUser} from '../firebase/db/users';
import { getSubjects } from '../firebase/db/subjects';
import { getAsesoriasByUid } from '../firebase/db/asesorias'
import { getSubjectColor, normalize } from '@/utils/HorarioUtils';

const userInfo = ref(null);
const asesorias = ref([]);
const isLoading = ref(true); 
const subjects = ref([]);
const date = ref(null);
const evalInput = ref(null);

const subjectInput = ref('');
const filteredSubjects = ref([]);

const evaluacion = [
    { label: 'Cualquiera', value: null },
    { label: 'Evaluada', value: true},
    { label: 'Sin Evaluación', value: false }
];

onMounted(async () => {
    userInfo.value = await getCurrentUser();
    asesorias.value = await getAsesoriasByUid(userInfo.value.uid);
    subjects.value = await getSubjects();
    isLoading.value = false;  
    
});

const formatDate = (timestamp) => {
    if (!timestamp?.seconds) return 'Fecha no disponible';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
};

const filterAsesorias = computed(() => {
    const selectedSubject = subjectInput.value;
    const selectedDate = date.value;
    const selectedEval = evalInput.value;

    if (selectedSubject === '' && !selectedDate && selectedEval === null) {
        return asesorias.value;
    }

    return asesorias.value.filter(asesoria => {
        const subjectMatches = asesoria.subject.id === selectedSubject.id;

        const asesoriaDate = new Date(asesoria.date.seconds * 1000);
        const selectedDateObj = new Date(selectedDate);
        const dateMatches = asesoriaDate.toDateString() === selectedDateObj.toDateString();

        const evalMatches = (asesoria.rating && selectedEval) || (!asesoria.rating && !selectedEval);

        if ((subjectMatches || selectedSubject === '') && (dateMatches || !selectedDate) && (evalMatches || selectedEval === null)) {
            return true;
        }
    });
});



const clearFilters = () => {
    subjectInput.value = '';
    date.value = null;
    evalInput.value = null;
};

const filterSubjects = () => {
    const query = normalize(subjectInput.value);

    //Conseguir las materias de las asesorías dadas
    const asesoriasSubjects = asesorias.value.map(asesoria => asesoria.subject);
    //Eliminar materias duplicadas y ordenarlas alfabéticamente
    const uniqueSubjectsMap = new Map(asesoriasSubjects.map(subject => [subject.id, subject]));
    const uniqueSubjects = Array.from(uniqueSubjectsMap.values());  
    uniqueSubjects.sort((a, b) => a.name.localeCompare(b.name));

    //Filtrar las materias por el query del input
    filteredSubjects.value = uniqueSubjects.filter(subject =>
        normalize(subject.name).includes(query)
    );
};

</script>

<template>
    <div v-if="subjectInput || date || evalInput != null" class="flex">
        <button @click="clearFilters" class="mr-2 bg-transparent border-none">
            <i class="pi pi-arrow-left text-black" style="font-size: 1.5rem; margin-right: 0.5rem;"></i>
        </button>
        <h1 class="text-black text-6xl font-bold mb-5 text-center sm:text-left">Mis asesorías filtradas</h1>
    </div>

    <div v-else>
        <h1 class="text-black text-6xl font-bold mb-5 text-center sm:text-left">Mis asesorías </h1>
    </div>

    <div class="w-full mb-5 ">
        <div class="flex lg:flex-row  flex-column"> 
            <AutoComplete 
                class="md:w-5 w-full mr-3 mb-2"
                v-model="subjectInput" 
                :suggestions="filteredSubjects" 
                @complete="filterSubjects" 
                field="name" 
                dropdown 
                :forceSelection="false"
                placeholder="Buscar materia..." 
            />
            <Calendar v-model="date" placeholder="Fecha" dateFormat="yy-mm-dd" showIcon class="mb-2 mr-3 w-full lg:w-3  mt-2 lg:mt-0"/>
            <Dropdown 
                v-model="evalInput"
                :options="evaluacion" 
                option-label="label" 
                option-value="value"
                placeholder="Evaluación..." 
                class="mb-2 w-full md:w-3 mt-2 lg:mt-0" 
                />
            </div>
    </div>

    <div v-if="isLoading" class="text-center">
        <ProgressSpinner style="width: 60px; height: 60px; animation: spin-fast 0.5s linear infinite;" strokeWidth="6" fill="var(--surface-ground)" />
    </div>

    <div v-else-if="!filterAsesorias.length" class="text-center">
        <p class="text-lg">Sin asesorías</p>
    </div>

    <div v-else class="flex flex-wrap gap-6">
        <div 
            v-for="asesoria in filterAsesorias" 
            :key="asesoria.id" 
            class="flex flex-col md:flex-row bg-white border-round-3xl w-full md:w-5 boder-gray"
            style="height: 185px;"
        >
            <div class="flex border-round-left-3xl "  :class="getSubjectColor(asesoria.subject.area)"  style="width: 1rem; height: 100%;"></div>
            
            <div class="flex flex-column p-3 w-full ml-1 ">
                <div style="height: 50px">
                    <p class="font-bold text-lg ">
                        {{ asesoria.subject.name }}
                    </p>
                </div>
               

                <span class="flex flex-row ml-2">
                    <img src="/assets/grad.svg" class="mr-2" alt="graduation icon" style="width: 1.5rem; height: 1.5rem;" />
                    <p class="text-md">
                        {{ asesoria.userInfo.name  }}
                    </p>
                </span>

                <span class="flex flex-row mt-1 ml-2">
                    <img src="/assets/calendar.svg" class="mr-2" alt="calendar icon" style="width: 1.5rem; height: 1.5rem;" />
                    <p class="text-md">
                        {{ formatDate(asesoria.date) }}
                    </p>
                </span>

                <span class="flex flex-row mt-1 ml-2">
                    <img src="/assets/star.svg" class="mr-2" alt="star icon" style="width: 1.5rem; height: 1.5rem;" />
                    <p class="text-md">
                        {{ asesoria.rating ?  'Evaluada' : 'Sin evaluación' }}
                    </p>
                </span>
            </div>
        </div>
    </div>
</template>

<style>
.boder-gray{
    border: 2px solid #e0e0e0;
}
</style>
