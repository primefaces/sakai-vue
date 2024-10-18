<script setup>
import { onMounted, ref, computed } from 'vue';
import { getAnnouncementsGrupales } from '@/firebase/db/annoucement'; 
import { getSubjects } from '../firebase/db/subjects';
import { getSubjectColor } from '@/utils/HorarioUtils';
import { formatDate, formatTime } from '@/utils/AnunciosUtils';


const asesorias = ref([]);
const subjects = ref([]);
const subjectsFilter = ref(null); 
const selectedAsesoria = ref(null); // Para almacenar la asesoría seleccionada
const showDialog = ref(false); // Control del modal

onMounted(async () => {
    subjects.value = await getSubjects();
    asesorias.value = await getAnnouncementsGrupales();
});

const filteredAsesorias = computed(() => {
    const selectedSubject = subjectsFilter.value;
    if (selectedSubject === null) {
        return asesorias.value;
    }
    return asesorias.value.filter(asesoria =>
        asesoria.subject.id === selectedSubject.id
    );
});

const clearFilters = () => {
    subjectsFilter.value = null;
};

const handlePreRegistro = (asesoria) => {
    selectedAsesoria.value = asesoria;
    showDialog.value = true;
};

const closeDialog = () => {
    showDialog.value = false;
};
</script>

<template>
    <div class="flex flex-column md:flex-row md:items-center justify-content-between mb-3">
        <div>
            <h1 class="text-black text-6xl font-bold mb-5 text-center sm:text-left">Asesorías Grupales</h1>
        </div>
        <span class="w-full md:w-5 mt-2 justify-content-end">
            <Dropdown v-model="subjectsFilter" 
                      :options="subjects" 
                      editable 
                      optionLabel="name" 
                      placeholder="Materia" 
                      checkmark 
                      :highlightOnSelect="false"
                      class="w-full p-0 border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 transition duration-300" />
        </span>
    </div>

    <div v-if="subjectsFilter && filteredAsesorias.length === 0" class="flex align-content-center h-full" style="min-height: 400px">
        <h1 class="flex align-items-center justify-content-center w-full text-center mt-8">
            <span>Buscando MAEs por materia... 🔎</span>
        </h1>
    </div>

    <div v-if="asesorias.length === 0 && !subjectsFilter" class="flex align-content-center h-full" style="min-height: 300px">
        <h1 class="flex align-items-center justify-content-center w-full text-center">
            <span>No hay asesorías grupales de momento 😔 <br> Consulta los <router-link to="horarios">horarios</router-link> para saber más ❤️</span>
        </h1>
    </div>

    <div class="flex flex-wrap gap-4">
        <div v-for="asesoria in filteredAsesorias" :key="asesoria.id" 
             class="flex flex-col md:flex-row bg-white border-round-3xl w-full md:w-5 boder-gray card-container"
             style="height: 190px;">
            <div class="color-bar" :class="getSubjectColor(asesoria.subject.area)"></div>
            <div class="px-5 mt-4 w-full">
                <div style="height: 50px">
                    <p class="font-bold text-lg text-center">{{ asesoria.subject.name }}</p>
                </div>
                <div class="flex align-items-center">
                    <img src="/assets/ubicacion.svg" class="mr-2" alt="ubicacion icon" style="width: 1.4rem; height: 1.4rem;" />
                    <p>{{ asesoria.location }}</p>
                </div>
                <div class="flex align-items-center mt-2">
                    <img src="/assets/calendar.svg" class="mr-2" alt="calendar icon" style="width: 1.5rem; height: 1.5rem;" />
                    <p class="text-md">
                        {{ formatDate(asesoria.dateTime) }}, 
                        {{ formatTime(asesoria.startTime, false) }} - 
                        {{ formatTime(asesoria.endTime, true) }}
                    </p>
                </div>
                <div class="flex justify-content-end mt-2">
                    <Button label="Pre-registro" 
                            class="custom-button font-bold text-black mt-2 text-md btn border-round-xl flex align-items-center" 
                            @click="handlePreRegistro(asesoria)">
                        <span>Pre-registro</span>
                        <i class="pi pi-arrow-right text-md ml-2 font-bold text-white"></i>
                    </Button>
                </div>
            </div>
        </div>
    </div>

    <Dialog 
        v-model:visible="showDialog" 
        :modal="true" 
        :closable="false" 
        :header="'¿Quieres hacer el pre-registro?'" 
        class="custom-dialog w-4"
        
    >
        <template #header>
            <h2 class="text-center">¿Deseas realizar el pre-registro para esta asesoría grupal?</h2>
        </template>

        <div class="dialog-content  border-round-3xl  boder-gray  bg-white">
            <!-- Barra de color -->
            <div class="color-bar" :class="getSubjectColor(selectedAsesoria?.subject.area)"></div>

            <div class="px-5 mt-4 w-full ">
                <div style="height: 50px">
                    <p class="font-bold text-lg text-center">{{ selectedAsesoria?.subject.name }}</p>
                </div>
                <div class="flex align-items-center">
                    <img src="/assets/ubicacion.svg" class="mr-2" alt="ubicacion icon" 
                        style="width: 1.4rem; height: 1.4rem;" />
                    <p>{{ selectedAsesoria?.location }}</p>
                </div>
                <div class="flex align-items-center mt-2 mb-4">
                    <img src="/assets/calendar.svg" class="mr-2" alt="calendar icon" 
                        style="width: 1.5rem; height: 1.5rem;" />
                    <p class="text-md">
                        {{ formatDate(selectedAsesoria?.dateTime) }}, 
                        {{ formatTime(selectedAsesoria?.startTime, false) }} - 
                        {{ formatTime(selectedAsesoria?.endTime, true) }}
                    </p>
                </div>
            </div>
        </div>

        <template #footer>
            <div class="flex justify-content-between mt-4">
                <Button label="Confirmar" class="btn" @click="closeDialog" />
                <Button label="Cancelar" class="p-button-text" @click="closeDialog" />
            </div>
        </template>
    </Dialog>


</template>

<style>
.card-container {
    position: relative;
    overflow: hidden;
}

.color-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 10px;
    border-radius: 1.5rem 1.5rem 0 0;
}

.boder-gray {
    border: 2px solid #e0e0e0;
}

.btn {
    color: white;
    background: linear-gradient(to right, #4466A7, #51A3AC);
}

.custom-dialog .p-dialog-mask {
    background: rgba(0, 0, 0, 0.5); /* Fondo semi-transparente */
}

.custom-dialog .p-dialog {
    background-color: #EFF2F7; /* Fondo blanco translúcido */
    box-shadow: none;
    border-radius: 1rem;
    overflow: hidden;
}

.dialog-content .color-bar {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 10px;
    border-radius: 1.5rem 1.5rem 0 0;
}
</style>
