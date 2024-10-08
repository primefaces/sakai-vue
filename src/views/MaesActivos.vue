<script setup>
import { onMounted, ref, computed } from 'vue';
import { getCurrentUser, getUsersWithActiveSession, getMaes, getClosestDayAndStartTime } from '../firebase/db/users';
import { getSubjects } from '../firebase/db/subjects';
import {
    translateDayToSpanish, 
    formatScheduleHours,
} from '@/utils/HorarioUtils';

const userInfo = ref(null);
const activeMAEs = ref([]);
const subjects = ref([]);
const maes = ref([]);
const subjectsFilter = ref(null) 

onMounted(async () => {
    activeMAEs.value = await getUsersWithActiveSession();
    userInfo.value = await getCurrentUser();
    subjects.value = await getSubjects();
    maes.value = await getMaes();
});

const filteredMAEs = computed(() => {
    const selectedSubject = subjectsFilter.value;
    const activeMAEsList = maes.value.filter(mae => isMAEActive(mae));
    if(selectedSubject === null){
        return activeMAEsList
    }
    
    return maes.value.filter(mae => {
        return mae.subjects.some(subject => subject.id === selectedSubject.id);
    });
    
});


const currentDay = ref(["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][new Date().getDay()]);

const isZoomLink = (location) => {
    const zoomRegex = /https.*zoom/;
    return zoomRegex.test(location);
}

const isMAEActive = (mae) => {
    return activeMAEs.value.some(active => active.uid === mae.uid);
}

function getDisplayedDay(weekSchedule) {
    const closestDayData = getClosestDayAndStartTime(weekSchedule);
    const displayedDay =  closestDayData.day;
    
    if (displayedDay) {
        const scheduleForDay = weekSchedule[displayedDay] || [];
        const hours = formatScheduleHours(scheduleForDay);
        return `${translateDayToSpanish(displayedDay)} ${hours}`;
    } else {
        return 'Sin horario';
    }
}

const clearFilters = () => {
    subjectsFilter.value = null;
};

</script>

<template>
    <div class="flex flex-column md:flex-row md:items-center justify-content-between mb-3"> 
        <span  class="flex flex-row " v-if="subjectsFilter && filteredMAEs.length > 0">
            <button @click="clearFilters" class="mr-2 bg-transparent border-none">
                <i class="pi pi-arrow-left text-black" style="font-size: 1.5rem; margin-right: 0.5rem;"></i>
            </button>
            <h1 class="text-black text-4xl font-bold text-left md:text-center md:text-left mt-3"> 
                Búsqueda de Maes
            </h1>
        </span>
        
        <h1 class="text-black text-4xl font-bold text-left md:text-center md:text-left mt-3" v-else> 
             MAEs Activos
        </h1>
        <span class="w-full md:w-5 mt-3"> 
            <Dropdown v-model="subjectsFilter" :options="subjects" editable optionLabel="name" placeholder="Materia" checkmark :highlightOnSelect="false"  
            class="w-full p-0 border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 transition duration-300 "  />
        </span>
    </div>

    <!-- Mensaje de búsqueda -->
    <div v-if="subjectsFilter && filteredMAEs.length === 0" class="flex align-content-center h-full" style="min-height: 400px">
        <h1 class="flex align-items-center justify-content-center w-full text-center mt-8">
            <span>Buscando MAEs por materia... 🔎</span>
        </h1>
    </div>

    
    <div v-if="activeMAEs.length === 0 && !subjectsFilter" class="flex align-content-center h-full" style="min-height: 300px">
        <h1 class="flex align-items-center justify-content-center w-full text-center">
            <span>No hay MAEs conectados por ahora 😔 <br> Consulta los <router-link to="horarios">horarios</router-link> para saber cuando podemos ayudarte ❤️</span>
        </h1>
    </div>

    <div class="grid" v-if="filteredMAEs.length > 0">
        <span v-for="mae in filteredMAEs" :key="mae.uid" class="col-12 md:col-6 lg:col-6 xl:col-4">
            <a :href="`#/mae/${mae.uid}`" v-if="isMAEActive(mae)" class="no-blue-link">
                <div class="p-0 w-full h-full border-round-xl bg-white shadow-1 hover:shadow-3 transition-duration-300 transition-ease-out">
                    <!-- Mostrar carta para MAEs activos -->
                    <div class="flex flex-column">
                        <div class="flex border-round-top-xl h-1rem w-full" v-if="mae.role === 'admin'" style="background-color: #8358CA;"></div>
                        <div class="flex border-round-top-xl h-1rem w-full" v-if="mae.role === 'coordi'" style="background-color: #58AFCA;"></div>
                        <div class="flex border-round-top-xl bg-white h-1rem w-full" v-if="mae.role !== 'coordi' && mae.role !== 'admin'"></div>
                        <div class="flex flex-row items-center mt-2 ml-2 p-2">
                            <img v-if="mae.profilePictureUrl" :src="mae.profilePictureUrl" alt="Foto de perfil" class="border-circle h-5rem w-5rem">
                            <Skeleton v-else shape="circle" size="5rem"></Skeleton>
                            <div class="flex flex-column justify-content-center pl-4 w-full">
                                <span class="font-bold text-lg text-black-alpha-90 truncate mb-2" style="max-width: 65%; max-height: 38%;  overflow: hidden; white-space: nowrap; text-overflow: ellipsis">{{ mae.name }}</span>
                                <div class="font-bold flex align-items-center justify-content-center text-lg pr-3 flex-wrap border-round-3xl align-content-center text-white" 
                                     :style="{ backgroundColor: mae.role === 'admin' ? '#8358CA' : '#58AFCA' }" 
                                     style="max-width: 65%; max-height: 38%; overflow: hidden;">
                                    <span class="flex flex-row pt-3 pl-3">
                                        <i class="pi pi-star-fill text-lg pt-1 pr-2" v-if="mae.role === 'admin'" style="color: #FFE073;"></i>
                                        <p class="uppercase pr-2" v-else >{{ mae.career }}</p>
                                        <p class="pr-2"  >•</p>
                                        <p class="uppercase">{{ mae.role }}</p>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <p v-if="mae.activeSession.location" class="truncate text-center text-lg" style="max-width: 80%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
                            <template v-if="isZoomLink(mae.activeSession.location)">
                                <a :href="mae.activeSession.location" target="_blank" rel="noopener noreferrer">
                                    <span class="flex flex-row items justify-content-center">
                                        <img src="/assets/link.svg" class="ml-4 mr-2" alt="link icon" style="width: 1.4rem; height: 1.4rem;" />
                                        <p class="underline">Liga de zoom</p>
                                    </span>
                                </a>
                            </template>
                            <template v-else>
                                <span class="flex flex-row items justify-content-center">
                                    <img src="/assets/ubicacion.svg" class="ml-4 mr-2" alt="ubicacion icon" style="width: 1.4rem; height: 1.4rem;" />
                                    <p>{{ mae.activeSession.location }}</p>
                                </span>
                            </template>
                        </p>
                        <p class="text-lg text-left ml-4 font-bold mb-2">Horario</p>
                        <Tag v-if="mae.weekSchedule[currentDay]" class="text-lg w-6 ml-4 mb-3 p-2 border-round-3xl mt-0" style="background-color: #69ac51;" 
                             :value="`${mae.weekSchedule[currentDay][0]['start']} - ${mae.weekSchedule[currentDay][0]['end']} `" />
                             <p v-else class="text-lg font-bold w-5 ml-4 mb-3 p-2 border-round-3xl mt-0 text-white justify-content-center flex align-items-center" style="background-color: #969696;">
                                Sin horario
                            </p>
                    </div>
                </div>
            </a>

            <!-- Carta para MAEs inactivos (gris) -->
            <a :href="`#/mae/${mae.uid}`" v-else class="no-blue-link">
                <div class="p-0 w-full h-full border-round-xl bg-white shadow-1 transition-duration-300 transition-ease-out">
                    <div class="flex flex-column">
                        <div class="flex border-round-top-xl h-1rem w-full" v-if="mae.role === 'admin'" style="background-color: #8358CA;"></div>
                        <div class="flex border-round-top-xl h-1rem w-full" v-if="mae.role === 'coordi'" style="background-color: #58AFCA;"></div>
                        <div class="flex border-round-top-xl bg-white h-1rem w-full" v-if="mae.role !== 'coordi' && mae.role !== 'admin'"></div>
                        <div class="flex flex-row items-center mt-2 ml-2 p-2">
                            <img v-if="mae.profilePictureUrl" :src="mae.profilePictureUrl" alt="Foto de perfil" class="border-circle h-5rem w-5rem opacity-50">
                            <Skeleton v-else shape="circle" size="5rem"></Skeleton>
                            <div class="flex flex-column justify-content-center pl-4 w-full">
                                <span class="font-bold text-lg text-black-alpha-90 truncate mb-2" style="max-width: 65%; max-height: 38%;  overflow: hidden; white-space: nowrap; text-overflow: ellipsis">{{ mae.name }}</span>
                                <div class="font-bold flex align-items-center justify-content-center text-lg pr-3 flex-wrap border-round-3xl align-content-center text-white " 
                                    :style="{ backgroundColor: mae.role === 'admin' ? '#8358CA' : '#58AFCA' }" 
                                     style="max-width: 65%; max-height: 38%; overflow: hidden;"
                                     >
                                    <span class="flex flex-row pt-3 pl-3">
                                        <i class="pi pi-star-fill text-lg pt-1 pr-2" v-if="mae.role === 'admin'" style="color: #FFE073;"></i>
                                        <p class="uppercase pr-2" v-else >{{ mae.career }}</p>
                                        <p class="pr-2">•</p>
                                        <p class="uppercase">{{ mae.role }}</p>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div  class="text-center text-lg flex flex-row items justify-content-center mb-3 mr-4">          
                                <img src="/assets/desconectado.svg" class="ml-4 mr-2" alt="disconnect icon" style="width: 1.6rem; height: 1.6rem;" />
                                <p>Desconectado</p>    
                        </div>
                        <p class="text-lg text-left ml-4 font-bold mb-2">Próximo horario disponible </p>
                        <Tag class="text-lg w-8 ml-4 mb-3 p-2 px-3 border-round-3xl mt-0" style="background-color: #969696;" 
                            :value="getDisplayedDay(mae.weekSchedule)" 
                            />
                        
                    </div>
                </div>
            </a>
        </span>
    </div>
</template>


<style>
.no-blue-link {
    color: inherit;
    text-decoration: none;
}

.no-blue-link:visited {
    color: inherit;
}

.no-blue-link:hover {
    color: inherit;
}

.no-blue-link:active {
    color: inherit;
}
</style>
