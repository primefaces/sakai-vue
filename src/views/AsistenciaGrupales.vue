<script setup>
import { onMounted, ref, computed } from 'vue';
import { getAnnouncementsAllGrupales,updateUserAsistence,processAsistence
 } from '@/firebase/db/annoucement'; 
import { getSubjects } from '../firebase/db/subjects';
import { getSubjectColor } from '@/utils/HorarioUtils';
import { formatDate, formatTime } from '@/utils/AnunciosUtils';
import { getCurrentUser } from '../firebase/db/users';

const asesorias = ref([]);
const subjects = ref([]);
const userInfo = ref(null);
const subjectsFilter = ref(null); 
const selectedAsesoria = ref(null); 
const showDialog = ref(false); 
const showDialogAsistence = ref(false); 
const processedAsistence = ref(null); 


const loadAsistance = async () => {
  processedAsistence.value = await processAsistence(selectedAsesoria.value.id);
};

onMounted(async () => {
    subjects.value = await getSubjects();
    asesorias.value = await getAnnouncementsAllGrupales();
    userInfo.value = await getCurrentUser(); 
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


const handleVer = (asesoria) => {
    selectedAsesoria.value = asesoria;
    showDialog.value = true;
};

const handleAsistence= async (asesoria) => {
    selectedAsesoria.value = asesoria;
    await loadAsistance();
    showDialogAsistence.value = true;
};

const closeDialog = () => {
    showDialog.value = false;
};

const closeDialogAsistence  = () => {
    showDialogAsistence.value = false;
};

const isMaeAssign = (asesoria) => {
    // Verifica si asesoria.asistence es un objeto y no es nulo, además de verificar que userInfo esté definido
    if (typeof asesoria.asistence !== 'object' || asesoria.asistence === null || !userInfo.value) {
        return false;
    }

    // Busca si el uid de userInfo está en maesAsignados y si está asignado (es decir, si no es false)
    const isAssigned = asesoria.maesAsignados.some(maes => maes.uid === userInfo.value.uid && maes.assigned !== false);

    return isAssigned;
};


</script>

<template>
    <div class="flex flex-column md:flex-row md:items-center justify-content-between mb-3">
        <div>
            <h1 class="text-black text-6xl font-bold mb-5 text-center sm:text-left">Asistencias grupales</h1>
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
                <div class="flex align-items-center mt-2 ">
                    <img src="/assets/calendar.svg" class="mr-2" alt="calendar icon" style="width: 1.5rem; height: 1.5rem;" />
                    <p class="text-md">
                        {{ formatDate(asesoria.dateTime) }}, 
                        {{ formatTime(asesoria.startTime, false) }} - 
                        {{ formatTime(asesoria.endTime, true) }}
                    </p>
                </div>
                <div v-if="asesoria && asesoria.maesAsignados" :class="{
                    'flex justify-content-end': !isMaeAssign(asesoria) && userInfo.role !== 'admin',
                    'flex flex-row justify-content-between': isMaeAssign(asesoria) || userInfo.role === 'admin',
                }">
                    <div class="mt-2">
                        <Button  
                            label="Ver" 
                            class="font-bold text-black text-md btn border-round-xl flex align-items-center" 
                            @click="handleVer(asesoria)"
                        >
                            <span>Ver MAEs</span>
                            <i class="pi pi-arrow-right text-md ml-2 font-bold text-white"></i>
                        </Button> 
                    </div>
                    <div class="flex justify-content-end mt-2">
                        <Button  
                            v-if="isMaeAssign(asesoria) || userInfo.role === 'admin'" 
                            label="Pasar asistencia" 
                            class="font-bold text-black text-md btn border-round-xl flex align-items-center" 
                            @click="handleAsistence(asesoria)"
                            :style="{
                                background: 'linear-gradient(to right, #00ad11, #51ac91)',
                            }"
                        >
                            <span>Pasar asistencia</span>
                            <img src="/assets/ok.svg" class="ml-2" alt="store icon" style="width: 1.2rem; height: 1.2rem;" />
                        </Button> 
                    </div>
                </div>


            </div>
        </div>
    </div>

    <Dialog 
        v-model:visible="showDialog" 
        :modal="true" 
        :closable="false" 
        class="custom-dialog w-10 md:w-6 lg:w-4"
    >
        <template #header>
            <h2 class="text-center text-2xl">MAEs asignados en la asesoría grupal</h2>
        </template>

        <div class="dialog-content border-round-3xl boder-gray bg-white">
            <div class="color-bar" :class="getSubjectColor(selectedAsesoria?.subject.area)"></div>
            <div class="px-5 mt-4 w-full">
                <p class="font-bold text-lg text-center">{{ selectedAsesoria?.subject.name }}</p>
            </div>
            <div class="px-5 mt-4 w-full">
                <template v-if="selectedAsesoria?.maesAsignados && selectedAsesoria.maesAsignados.length > 0">
                    <ol class="list-none">
                        <li 
                            v-for="mae in selectedAsesoria.maesAsignados" 
                            :key="mae.uid" 
                            class="text-left ml-2"
                        >
                            <p class="font-medium text-lg text-bold">{{ mae.name }}</p>
                        </li>
                    </ol>
                </template>
                <p 
                    v-else 
                    class="text-center text-gray-500 mt-2 mb-4"
                >
                    No hay MAEs asignados aún.
                </p>
            </div>
        </div>

        <template #footer>
            <div class="flex justify-content-center mb-3">
                <Button label="Cerrar" class="p-button-text" @click="closeDialog" />
            </div>
        </template>
    </Dialog>

    <Dialog 
        v-model:visible="showDialogAsistence" 
        :modal="true" 
        :closable="false" 
        class="custom-dialog w-6"
    >
        <template #header>
            <h2 class="text-center text-2xl ">Pasar asistencia</h2>
        </template>

        <DataTable 
            :value="processedAsistence" 
            paginator 
            :rows="4" 
            dataKey="id" 
            :loading="loading" 
            responsiveLayout="scroll" 
            class="custom-table"
        >
            <template #empty>No se encontraron alumnos pregistrados.</template>
            <template #loading>Cargando información. Por favor espera.</template>

            <Column header="Fecha" field="date">
                <template #body="{ data }">
                    <p class="text-sm">{{ formatDate(data.dateTime) }}</p>
                </template>
            </Column>

            <Column header="Estudiante" field="student">
                <template #body="{ data }">
                    <span class="flex flex-column ml-4">
                        <p class="text-sm font-bold">{{ data.name }}</p>
                        <p class="text-sm">{{ data.uid }}</p>
                    </span>
                </template>
            </Column>

            <Column header="Carrera" field="career">
                <template #body="{ data }">
                    <span class="flex flex-column ml-4">
                        <p class="text-sm font-bold">{{ data.career }}</p>
                        <p class="text-sm">{{ data.area }}</p>
                    </span>
                </template>
            </Column>

            <!-- Columna con el Dropdown personalizado -->
            <Column header="Asistencia" field="asistence">
                <template #body="{ data }">
                    <Dropdown 
                        v-model="data.asistence" 
                        :options="[
                            { label: 'Presente', value: true, icon: '/assets/check.svg' },
                            { label: 'Ausente', value: false, icon: '/assets/cancel.svg' }
                        ]"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Selecciona asistencia"
                        class="w-full"
                        :class="{
                            'dropdown-green': data.asistence === true,
                            'dropdown-red': data.asistence === false
                        }"
                        @click="updateUserAsistence(selectedAsesoria?.id,data.uid)"
                    >
                        <template #value="{ value }">
                            <div class="flex items-center gap-2">
                                <img 
                                    :src="value ? '/assets/check.svg' : '/assets/cancel.svg'" 
                                    alt="icon" 
                                    style="width: 1.5rem; height: 1.5rem;" 
                                />
                                <span>{{ value ? 'Presente' : 'Ausente' }}</span>
                            </div>
                        </template>
                        <template #option="{ option }">
                            <div class="flex items-center gap-2">
                                <img 
                                    :src="option.icon" 
                                    alt="icon" 
                                    style="width: 1.5rem; height: 1.5rem;" 
                                />
                                <span>{{ option.label }}</span>
                            </div>
                        </template>
                    </Dropdown>
                </template>
            </Column>
        </DataTable>

        <template #footer>
            <div class="flex justify-content-center mb-3">
                <Button 
                    label="Cancelar" 
                    class="p-button-text" 
                    @click="closeDialogAsistence" 
                />
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


.dialog-content .color-bar {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 10px;
}

.p-dialog .p-dialog-footer {
    background:  #EFF2F7 ;
    border-bottom-right-radius: 20px;
    border-bottom-left-radius: 20px;
}

.p-dialog .p-dialog-content {
    background:  #EFF2F7 ;
}

.p-dialog .p-dialog-header {
    background:  #EFF2F7 ;
    border-top-right-radius: 20px;
    border-top-left-radius: 20px;
}

.dropdown-green {
    background-color: #d4edda !important; /* Verde claro */
    border-color: #c3e6cb !important;
}

.dropdown-red {
    background-color: #f8d7da !important; /* Rojo claro */
    border-color: #f5c6cb !important;
}
</style>
