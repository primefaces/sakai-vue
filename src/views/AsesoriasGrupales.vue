<script setup>
import { onMounted, ref, computed } from 'vue';
import { getAnnouncementsGrupales, addUserToPreregsiter, updateUserAsistence  } from '@/firebase/db/annoucement'; 
import { getSubjects } from '../firebase/db/subjects';
import { getSubjectColor } from '@/utils/HorarioUtils';
import { formatDate, formatTime } from '@/utils/AnunciosUtils';
import { getCurrentUser } from '../firebase/db/users';
import { useToast } from 'primevue/usetoast';
import { useRoute,useRouter } from 'vue-router'; 

const router = useRouter();
const asesorias = ref([]);
const subjects = ref([]);
const userInfo = ref(null);
const subjectsFilter = ref(null); 
const selectedAsesoria = ref(null); 
const showDialog = ref(false); 
const toast = useToast();
const showDialogAsistence = ref(false); 

onMounted(async () => {
    const route = useRoute(); 
    subjects.value = await getSubjects();
    asesorias.value = await getAnnouncementsGrupales();
    userInfo.value = await getCurrentUser();

    const asesoríaId = route.query.asesoriaId;
    if (asesoríaId) {
        const selectedAsesoria = asesorias.value.find(asesoria => asesoria.id === asesoríaId);
        if(hasAttended(selectedAsesoria)){
            toast.add({  
                severity: 'error', 
                summary: 'Error', 
                detail: `Ya confirmaste esta asesoría de ${selectedAsesoria.subject.name}.`, 
                life: 3000 
            });
        }
        else if(shouldShowConfirmButton(selectedAsesoria)){
            handleAsistence(selectedAsesoria); 
        }
        else if (selectedAsesoria ) {
            handlePreRegistro(selectedAsesoria); 
        }
    }
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

const handlePreRegistro = (asesoria) => {
    selectedAsesoria.value = asesoria;
    showDialog.value = true;
    router.push({
        path: 'asesoriasGrupales',
        query: { asesoriaId: asesoria.id },
    });
};

const handleAsistence = (asesoria) => {
    selectedAsesoria.value = asesoria;
    showDialogAsistence.value = true;
    router.push({
        path: 'asesoriasGrupales',
        query: { asesoriaId: asesoria.id },
    });
};

const closeDialog = () => {
    showDialog.value = false;
};

const closeDialogAsistence  = () => {
    showDialogAsistence.value = false;
};
const confirmPreRegistro = async () => {
    try {
        const announcementId = selectedAsesoria.value.id;
        await addUserToPreregsiter(announcementId, userInfo.value);

        toast.add({ 
            severity: 'success', 
            summary: 'Éxito', 
            detail: 'Se te ha pre-registrado exitosamente.', 
            life: 3000 
        });
        asesorias.value = await getAnnouncementsGrupales();
        closeDialog();
    } catch (error) {
        if (error.message === 'Usuario ya registrado') {
            toast.add({  
                severity: 'error', 
                summary: 'Error', 
                detail: 'Ya te encuentras pre-registrado.', 
                life: 3000 
            });
        } else {
            toast.add({  
                severity: 'error', 
                summary: 'Error', 
                detail: 'Ocurrió un problema al pre-registrarte.', 
                life: 3000 
            });
        }
    }
};

const confirmAsistence = async () => {
    try {
        const announcementId = selectedAsesoria.value.id;
        await  updateUserAsistence(announcementId, userInfo.value.uid);

        toast.add({ 
            severity: 'success', 
            summary: 'Éxito', 
            detail: 'Se te ha confirmado tu asistencia exitosamente.', 
            life: 3000 
        });
        asesorias.value = await getAnnouncementsGrupales();
        closeDialogAsistence();
    } catch (error) {
        if (error.message === 'Usuario ya registrado') {
            toast.add({  
                severity: 'error', 
                summary: 'Error', 
                detail: 'Ya te has confirmado tu', 
                life: 3000 
            });
        } else {
            toast.add({  
                severity: 'error', 
                summary: 'Error', 
                detail: 'Ocurrió un problema al confirmar la asistencia.', 
                life: 3000 
            });
        }
    }
};

const shouldShowConfirmButton = (asesoria) => {
    if (typeof asesoria.asistence !== 'object' || asesoria.asistence === null || !userInfo.value) {
        return false;
    }

    return asesoria.asistence[userInfo.value.uid] === false;
};

const hasAttended = (asesoria) => {
    if (typeof asesoria.asistence !== 'object' || asesoria.asistence === null || !userInfo.value) {
        return false;
    }

    return asesoria.asistence[userInfo.value.uid] === true;
};
</script>

<template>
    <div class="flex flex-column md:flex-row md:items-center justify-content-between mb-3">
        <div>
            <h1 class="text-black text-6xl font-bold mb-5 text-center sm:text-left">Asesorías grupales</h1>
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
                    <Button  
                        v-if="shouldShowConfirmButton(asesoria)" 
                        label="Asistencia confirmada" 
                        class="font-bold text-black mt-2 text-md btn border-round-xl flex align-items-center" 
                        @click="handleAsistence(asesoria)"
                        :style="{
                            background: 'linear-gradient(to right, #7044a7, #a551ac',
                        }"
                    >
                        <span>Asistencia confirmada</span>
                        <i class="pi pi-arrow-right text-md ml-2 font-bold text-white"></i>
                    </Button>
                    <Button  
                    v-else-if="hasAttended(asesoria)"
                        label="Asistío" 
                        class="custom-button font-bold text-black mt-2 text-md btn border-round-xl flex align-items-center" 
                        :style="{
                            background: 'linear-gradient(to right, #00ad11, #51ac91)',
                        }"
                    >
                        <span>Asistió</span>
                        <img src="/assets/ok.svg" class="ml-2" alt="store icon" style="width: 1.2rem; height: 1.2rem;" />
                    </Button>
      
                    <Button  
                        v-else 
                        label="Pre-registro" 
                        class="custom-button font-bold text-black mt-2 text-md btn border-round-xl flex align-items-center" 
                        @click="handlePreRegistro(asesoria)"
                    >
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
        class="custom-dialog w-10 md:w-6 lg:w-4"
    >
        <template #header>
            <h2 class="text-center text-2xl ">¿Deseas realizar el pre-registro para esta asesoría grupal?</h2>
        </template>

        <div class="dialog-content border-round-3xl boder-gray bg-white">
            <div class="color-bar" :class="getSubjectColor(selectedAsesoria?.subject.area)"></div>

            <div class="px-5 mt-4 w-full">
                <p class="font-bold text-lg text-center">{{ selectedAsesoria?.subject.name }}</p>
                <div class="flex align-items-center">
                    <img src="/assets/ubicacion.svg" class="mr-2" alt="ubicacion icon" style="width: 1.4rem; height: 1.4rem;" />
                    <p>{{ selectedAsesoria?.location }}</p>
                </div>
                <div class="flex align-items-center mt-2 mb-4">
                    <img src="/assets/calendar.svg" class="mr-2" alt="calendar icon" style="width: 1.5rem; height: 1.5rem;" />
                    <p class="text-md">
                        {{ formatDate(selectedAsesoria?.dateTime) }}, 
                        {{ formatTime(selectedAsesoria?.startTime, false) }} - 
                        {{ formatTime(selectedAsesoria?.endTime, true) }}
                    </p>
                </div>
            </div>
        </div>

        <template #footer>
            <div class="flex justify-content-around mb-3">
                <Button label="Confirmar" class="btn " @click="confirmPreRegistro" />
                <Button label="Cancelar" class="p-button-text " @click="closeDialog" />
            </div>
        </template>
    </Dialog>


    <Dialog 
        v-model:visible="showDialogAsistence" 
        :modal="true" 
        :closable="false" 
        class="custom-dialog w-10 md:w-6 lg:w-4"
    >
        <template #header>
            <h2 class="text-center text-2xl ">¿Deseas confirmar tu asistencia a la siguiente asesoría grupal?</h2>
        </template>

        <div class="dialog-content border-round-3xl boder-gray bg-white">
            <div class="color-bar" :class="getSubjectColor(selectedAsesoria?.subject.area)"></div>

            <div class="px-5 mt-4 w-full">
                <p class="font-bold text-lg text-center">{{ selectedAsesoria?.subject.name }}</p>
                <div class="flex align-items-center">
                    <img src="/assets/ubicacion.svg" class="mr-2" alt="ubicacion icon" style="width: 1.4rem; height: 1.4rem;" />
                    <p>{{ selectedAsesoria?.location }}</p>
                </div>
                <div class="flex align-items-center mt-2 mb-4">
                    <img src="/assets/calendar.svg" class="mr-2" alt="calendar icon" style="width: 1.5rem; height: 1.5rem;" />
                    <p class="text-md">
                        {{ formatDate(selectedAsesoria?.dateTime) }}, 
                        {{ formatTime(selectedAsesoria?.startTime, false) }} - 
                        {{ formatTime(selectedAsesoria?.endTime, true) }}
                    </p>
                </div>
            </div>
        </div>

        <template #footer>
            <div class="flex justify-content-around mb-3">
                <Button label="Confirmar" class="btn " @click="confirmAsistence" />
                <Button label="Cancelar" class="p-button-text " @click="closeDialogAsistence" />
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
    background: rgba(0, 0, 0, 0.5); 
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
</style>
