<script setup>
import { onMounted, ref } from 'vue';
import { getCurrentUser, getUsersWithActiveSession} from '../firebase/db/users';
import { getSubjects,  } from '../firebase/db/subjects';
import { normalize } from '@/utils/HorarioUtils';
import { getMaes} from '@/firebase/db/users';

const userInfo = ref(null);
const activeMAEs = ref([]);
const subjects = ref([]);
const subjectInput = ref('');
const filteredSubjects = ref([]);
const maes = ref([]);

onMounted(async () => {
    activeMAEs.value = await getUsersWithActiveSession();
    userInfo.value = await getCurrentUser();
    subjects.value = await getSubjects();
    getMaes().then((data) => {
        maes.value = data;
    });
})

const filterSubjects = () => {
    const query = normalize(subjectInput.value);
    filteredSubjects.value = subjects.value.filter(subject =>
        normalize(subject.name).includes(query)
    );
};

const currentDay = ref(["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][new Date().getDay()]);

const isZoomLink = (location) => {
    const zoomRegex = /https.*zoom/;
    return zoomRegex.test(location);
}
</script>

<template>
    
    <div class="flex flex-column md:flex-row md:items-center justify-content-between mb-3"> 
        <h1 class="text-black text-4xl font-bold text-left md:text-center md:text-left  mt-3"> 
            MAEs Activos
        </h1>
        <AutoComplete 
            class="w-full md:w-5  p-0  md:p-3 border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 transition duration-300" 
            v-model="subjectInput" 
            :suggestions="filteredSubjects" 
            @complete="filterSubjects" 
            field="name" 
            dropdown 
            :forceSelection="false"
            placeholder="Buscar materia..." 
        />
    </div>
   
    
    <div class="grid" v-if="activeMAEs.length > 0">
        <span v-for="mae in activeMAEs" :key="mae.uid" class="col-12 md:col-6 lg:col-6 xl:col-4 ">
    <a :href="`#/mae/${mae.uid}`"  class="no-blue-link">
        <div class="p-0 w-full h-full border-round-xl bg-white shadow-1 hover:shadow-3 transition-duration-300 transition-ease-out ">
            <div class="flex flex-column">
                <div class="flex border-round-top-xl h-1rem w-full " v-if="mae.role === 'admin'" style="background-color: #8358CA; " ></div>
                <div class="flex border-round-top-xl h-1rem w-full " v-if="mae.role === 'coordi'" style="background-color: #58AFCA;"></div>
                <div class="flex border-round-top-xl bg-white h-1rem w-full " v-if="mae.role !== 'coordi' && mae.role !== 'admin' "></div>
                <div class="flex flex-row items-center mt-2 ml-2 p-2">
                    <img v-if="mae.profilePictureUrl" :src="mae.profilePictureUrl" alt="Foto de perfil"
                        class="border-circle h-5rem w-5rem">
                    <Skeleton v-else shape="circle" size="5rem"></Skeleton>
                    
                    <div class="flex flex-column justify-content-center pl-4 w-full">
                        <span class="font-bold text-lg text-black-alpha-90 truncate mb-2"
                            style="display: block; max-width: 75%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
                            {{ mae.name }}
                        </span>
                        <div class="font-bold flex align-items-center justify-content-center text-lg pr-3 flex-wrap border-round-3xl  align-content-center text-white" 
                            :style="{ backgroundColor: mae.role === 'admin' ? '#8358CA' : '#58AFCA' }" 
                            style=" max-width: 65%; max-height: 38%; overflow: hidden; ">
                            <span class="flex flex-row pt-3 pl-3"> 
                                <i class="pi pi-star-fill  text-lg pt-1 pr-2" v-if="mae.role === 'admin'" style="color: #FFE073;" ></i>
                                <p class="uppercase pr-2 " v-if="mae.role !== 'admin'" >{{ mae.career }}</p>
                                <p class="pr-2 ">•</p>
                                <p class="uppercase ">{{ mae.role }}</p>
                            </span>
                        </div>
                    </div>
                </div>
                
                <p v-if="mae.activeSession.location" class="truncate text-center text-lg" 
                    style="max-width: 80%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
                    <template v-if="isZoomLink(mae.activeSession.location)">
                        <a :href="mae.activeSession.location" target="_blank" rel="noopener noreferrer">
                            <span class="flex flex-row items justify-content-center">
                                <img src="/assets/link.svg" class="ml-4 mr-2" alt="link icon" style="width: 1.4rem; height: 1.4rem;" />
                                <p class=" underline">
                                    Liga de zoom
                                </p>
                            </span>
                        </a>
                    </template>
                    <template v-else> 
                        <span class="flex flex-row items justify-content-center">
                            <img src="/assets/ubicacion.svg" class="ml-4 mr-2" alt="ubicacion icon" style="width: 1.4rem; height: 1.4rem;" />
                            <p class="">
                                {{ mae.activeSession.location }}  
                            </p>
                        </span>                       
                    </template>
                </p>
                <p class=" text-lg  text-left ml-4 font-bold mb-2">Horario</p>
                <Tag v-if="mae.weekSchedule[currentDay]" class="text-lg w-5 ml-4 mb-3 p-2 border-round-3xl mt-0" style="background-color: #69ac51;" :value="`${mae.weekSchedule[currentDay][0]['start']} - ${mae.weekSchedule[currentDay][0]['end']}`" />
            </div>
        </div>
    </a>
</span>


    </div>



<div v-else class="flex align-content-center h-full" style="min-height: 300px">
    <h1 class="flex align-items-center justify-content-center w-full text-center">
        <span>No hay MAEs conectados por ahora 😔 <br> Consulta los <router-link to="horarios">horarios</router-link> para saber cuando podemos ayudarte ❤️</span>
    </h1>
</div>

</template>

<style>
.translate {
    transition: transform 0.3s ease-in-out;
    cursor: pointer;
}

.translate:hover {
    transform: translateY(-10px);
}

.no-blue-link {
    color: inherit; /* Hereda el color del texto del elemento padre */
    text-decoration: none; /* Elimina el subrayado */
}

.no-blue-link:visited {
    color: inherit; /* Color cuando el enlace ya ha sido visitado */
}

.no-blue-link:hover {
    color: inherit; /* Color al pasar el mouse por encima */
}

.no-blue-link:active {
    color: inherit; /* Color cuando el enlace está siendo presionado */
}

</style>