<script setup>
import { ref, onMounted } from 'vue';
import { getCurrentUser} from '../firebase/db/users';
import { getAsesoriasByUid } from '../firebase/db/asesorias'
import { getSubjectColor } from '@/utils/HorarioUtils';

const userInfo = ref(null);
const asesorias = ref([]);
const isLoading = ref(true); 

onMounted(async () => {
    userInfo.value = await getCurrentUser();
    asesorias.value = await getAsesoriasByUid(userInfo.value.uid);
    isLoading.value = false;  
});

const formatDate = (timestamp) => {
    if (!timestamp?.seconds) return 'Fecha no disponible';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
};
</script>

<template>
    <div>
        <h1 class="text-black text-6xl font-bold mb-5 text-center sm:text-left">Mis asesorías</h1>
    </div>

    <div v-if="isLoading" class="text-center">
        <p class="text-lg">Cargando asesorías...</p>
    </div>

    <div v-else-if="!asesorias.length" class="text-center">
        <p class="text-lg">Sin asesorías</p>
    </div>

    <div v-else class="flex flex-wrap gap-6">
        <div 
            v-for="asesoria in asesorias" 
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
