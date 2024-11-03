<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getUser, updateUserSubjects, updateUserSchedule, getCurrentUser, startActiveSession, 
  stopActiveSession,updateUserProfilePicture} from '../firebase/db/users';
import { getSubjects } from '../firebase/db/subjects';
import { addAsesoria, getAsesoriasCountForUserInCurrentSemester } from '../firebase/db/asesorias';
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { uploadFile } from '../firebase/img/users';
import {
    getSubjectColor,
} from '@/utils/HorarioUtils';
import {
  topOptions,
  areaOptions,
  daysArray,
  timeSlots,
  timeToDecimal 
} from '@/utils/PerfilUtils';

const toast = useToast();
const route = useRoute();
const userId = ref(route.path.split('/').pop());
const maeInfo = ref(null);
const userInfo = ref(null);
const asesoriasCount = ref(0);
const selectedSubjects = ref([]);
const subjects = ref([]);
const newSchedule = ref({});
const showDialogUpload = ref(false); 
const selectedFile = ref(null); 

onMounted(async () => {
  userInfo.value = await getCurrentUser();
  maeInfo.value = await getUser(route.params.id);
  asesoriasCount.value = await getAsesoriasCountForUserInCurrentSemester(maeInfo.value.uid);
  selectedSubjects.value = maeInfo.value.subjects;
  subjects.value = await getSubjects();
  newSchedule.value = JSON.parse(JSON.stringify(maeInfo.value.weekSchedule));
})

const getHorasHorario = () => {
    let hours = 0;
    for (const day of daysArray) {
      const scheduleForDay = newSchedule.value[day.en];
      if (scheduleForDay) {
        for (const timeSlot of scheduleForDay) {
          const start = timeToDecimal(timeSlot.start);
          const end = timeToDecimal(timeSlot.end);
          hours = hours + end - start;
        }
      }
    }
    return hours;
  }


const getHorasRequeridas = () => {
  if (maeInfo.value.status === "becario" && 
    ((maeInfo.value.role === "mae" || maeInfo.value.role === "coordi") &&
    (maeInfo.value.career.toUpperCase() === "MC" || maeInfo.value.career.toUpperCase() === "LBC" || maeInfo.value.career.toUpperCase() === "LPS"))) {
    return 3;
  } else if (maeInfo.value.status === "becario" && 
           ((maeInfo.value.role === "mae" || maeInfo.value.role === "coordi") && 
           !(maeInfo.value.career.toUpperCase() === "MC" || maeInfo.value.career.toUpperCase() === "LBC" || maeInfo.value.career.toUpperCase() === "LPS"))) {
    return 5;
  } else if (maeInfo.value.status === "becario" && maeInfo.value.role === "publi") {
    return 2;
  } else if (maeInfo.value.status === "voluntario") {
    return 1;
  } else{
    return 5;
  }
}

watch(route, async (newroute, oldroute) => {
  maeInfo.value = await getUser(route.params.id);
  selectedSubjects.value = maeInfo.value.subjects;
  newSchedule.value = JSON.parse(JSON.stringify(maeInfo.value.weekSchedule));
})

const uploadProfilePicture = async () => {
  if (!selectedFile.value) return;

  try {
    const url = await uploadFile(selectedFile.value, userInfo.value.email);
    await updateUserProfilePicture(userInfo.value.uid, url); 
    maeInfo.value = await getUser(route.params.id); 
    toast.add({ severity: 'success', summary: 'Foto actualizada', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la foto de perfil' });
  } finally {
    showDialogUpload.value = false; 
    selectedFile.value = null; 
    previewUrl.value = null; 
  }
};

const showMoreTags = ref(false);

const filteredSubjects = computed(() => {
  if (maeInfo.value) {
    const searchQueryNormalized = searchQuery.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return maeInfo.value.subjects.filter(
      subject => {
        const nameNormalized = subject.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const idNormalized = subject.id.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        return nameNormalized.includes(searchQueryNormalized) || idNormalized.includes(searchQueryNormalized);
      }
    );
  }
  return [];
});

const searchQuery = ref('');
const showDialogMaterias = ref(false);

const subjectTableFilter = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  semester: { value: null, matchMode: FilterMatchMode.EQUALS },
  area: { value: null, matchMode: FilterMatchMode.EQUALS },
  top: { value: null, matchMode: FilterMatchMode.EQUALS }
});

const saveSubjectChanges = async () => {
  toast.add({ severity: 'info', summary: 'Guardando cambios', detail: 'Se están guardando los cambios en tus materias', life: 3000 });
  try {
   await updateUserSubjects(maeInfo.value.uid, selectedSubjects.value); 
   maeInfo.value = await getUser(route.params.id);
   toast.add({ severity: 'success', summary: 'Guardado exitoso', detail: 'Los cambios en tus materias se guardaron con éxito', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al tratar de guardar los cambios' });
  }
  showDialogMaterias.value = false;    
}

const showDialogHorarios = ref(false);

const addTimeSlot = (day, start, end) => {
  if (!newSchedule.value[day]) {
    newSchedule.value[day] = [{ start, end }]
  } else {
    newSchedule.value[day].push({ start, end })
  }
}

const saveScheduleChanges = async () => {
  let hours = 0;

  for (const day of daysArray) {
    const scheduleForDay = newSchedule.value[day.en];
    const intervals = [];

    if (scheduleForDay) {
      for (const timeSlot of scheduleForDay) {
        const startTime = timeSlot.start;
        const endTime = timeSlot.end;

        if (startTime === endTime) {
          toast.add({ severity: 'error', summary: 'Error de horario', detail: `La hora de inicio y la hora de fin no pueden ser iguales para el día ${day.es}`, life: 3000 });
          return;
        }

        if (startTime > endTime) {
          toast.add({ severity: 'error', summary: 'Error de horario', detail: `La hora de inicio no puede ser mayor que la hora de fin para el día ${day.es}`, life: 3000 });
          return;
        }

        for (const existingSlot of intervals) {
          const existingStart = existingSlot.start;
          const existingEnd = existingSlot.end;
          if ((startTime < existingEnd && endTime > existingStart)) {
            toast.add({ severity: 'error', summary: 'Error de horario', detail: `El intervalo de tiempo de ${startTime} a ${endTime} ya existe o se sobrepone con otro intervalo para el día ${day.es}`, life: 3000 });
            return;
          }
        }
        intervals.push({ start: startTime, end: endTime });
        const start = timeToDecimal(timeSlot.start);
        const end = timeToDecimal(timeSlot.end);
        hours = hours + end - start;
      }
    }
  }
  if (maeInfo.value.status === "becario" && 
    ((maeInfo.value.role === "mae" || maeInfo.value.role === "coordi") &&
    (maeInfo.value.career.toUpperCase() === "MC" || maeInfo.value.career.toUpperCase() === "LBC" || maeInfo.value.career.toUpperCase() === "LPS") && 
    hours < 3)) {
    toast.add({ severity: 'error', summary: 'Error de horas', detail: 'No puedes tener menos de 3 horas asignadas en total', life: 3000 });
    return;
  } else if (maeInfo.value.status === "becario" && 
           ((maeInfo.value.role === "mae" || maeInfo.value.role === "coordi") && 
           !(maeInfo.value.career.toUpperCase() === "MC" || maeInfo.value.career.toUpperCase() === "LBC" || maeInfo.value.career.toUpperCase() === "LPS")) && 
           hours < 5) {
    toast.add({ severity: 'error', summary: 'Error de horas', detail: 'No puedes tener menos de 5 horas asignadas en total', life: 3000 });
    return;
  } else if (maeInfo.value.status === "becario" && 
           maeInfo.value.role === "publi" && 
           hours < 2) {
    toast.add({ severity: 'error', summary: 'Error de horas', detail: 'No puedes tener menos de 2 horas asignadas en total', life: 3000 });
    return;
  } else if (maeInfo.value.status === "voluntario" && 
           hours < 1) {
    toast.add({ severity: 'error', summary: 'Error de horas', detail: 'No puedes tener menos de una hora asignada en total', life: 3000 });
    return;
  }

  toast.add({ severity: 'info', summary: 'Guardando cambios', detail: 'Se están guardando los cambios en tu horario', life: 3000 });
  try {
    await updateUserSchedule(maeInfo.value.uid, newSchedule.value); 
    maeInfo.value = await getUser(route.params.id);
    toast.add({ severity: 'success', summary: 'Guardado exitoso', detail: 'Los cambios en tu horario se guardaron con éxito', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al tratar de guardar los cambios' });
  }
  showDialogHorarios.value = false;  
};

const showDialogAsesoria = ref(false);
const ratingAsesoria = ref(null);
const comentarioAsesoria = ref('');
const materiaAsesoria = ref(null);
const isSavingAsesoria = ref(false);

const saveAsesoria = async () => {
  if (isSavingAsesoria.value) return; 
  isSavingAsesoria.value = true; 
  toast.add({ severity: 'info', summary: 'Guardando cambios', detail: 'Se está registrando la asesoría', life: 3000 });
  try {
    await addAsesoria(maeInfo.value, userInfo.value, materiaAsesoria.value, comentarioAsesoria.value, ratingAsesoria.value); 
    maeInfo.value = await getUser(route.params.id);
    toast.add({ severity: 'success', summary: 'Guardado exitoso', detail: 'La asesoría se registró con éxito', life: 3000 });
    ratingAsesoria.value = null;
    comentarioAsesoria.value = '';
    materiaAsesoria.value = null;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al tratar de registrar la asesoría' });
  } finally{
    isSavingAsesoria.value = false; 
    showDialogAsesoria.value = false;  
    asesoriasCount.value = await getAsesoriasCountForUserInCurrentSemester(maeInfo.value.uid);
  }
}

const showDialogSession = ref(false);
const location = ref('Biblioteca Piso 3')

const startSession = async () => {
  try {
    const res = await startActiveSession(userInfo.value.uid, userInfo.value, location.value);
    toast.add({ severity: 'success', summary: 'Inicio de turno exitoso', life: 3000 });
    userInfo.value = await getCurrentUser();
    maeInfo.value = await getUser(route.params.id);
    showDialogSession.value = false;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Ocurrió un error al tratar de iniciar turno', detail: 'Consulta con un administrador de la página', life: 3000 });
  }
}

const stopSession = async () => {
  try {
    const res = await stopActiveSession(userInfo.value.uid);
    if (!res.activeSessionDeleted) {
      if (res.timeLimitExceded) {
        toast.add({ severity: 'error', summary: `Excediste el limite de tiempo de tu turno (${ Math.round((res.differenceInMinutes / 60) * 100) / 100 } horas)`, detail: 'Consulta a un coordi para reponer las horas' });
      }
      else {
        throw new Error("Active session was not deleted");
      }
    } else {
      toast.add({ severity: 'success', summary: 'Se ha cerrado el turno con éxito', detail: `${res.differenceInMinutes} minutos registrados`, life: 3000 });
    }
    userInfo.value = await getCurrentUser();
    maeInfo.value = await getUser(route.params.id);
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Ocurrió un error al tratar de cerrar turno', detail: 'Consulta con un administrador de la página', life: 3000 });
  }
}

const previewUrl = ref(null);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file && validateFile(file)) {
    selectedFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
  } else {
    showError();
  }
};

const handleDrop = (event) => {
  const file = event.dataTransfer.files[0];
  if (file && validateFile(file)) {
    selectedFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
  } else {
    showError();
  }
};

const showError = () => {
  toast.add({ severity: 'error', summary: 'Error', detail: 'Solo puedes subir archivos JPG o PNG', life: 3000 });
};

const triggerFileInput = () => {
  document.querySelector('input[type="file"]').click();
};

const validateFile = (file) => {
  const validTypes = ['image/jpeg', 'image/png'];
  return validTypes.includes(file.type);
}

</script>

<template>
  <div class="flex border-round-top-xl h-7rem w-full" style="background-color: #58AFCA; align-items: center; justify-content: center;">
    <div class="sm:flex sm:flex-1 justify-center w-full  px-6">
        <div class="relative flex align-items-center justify-content-center mr-4 ">
          <img v-if="maeInfo" :src="maeInfo.profilePictureUrl" alt="Foto de perfil" class="border-circle h-10rem w-10rem border-3 border-white mt-8">
            <!-- <div v-if="userInfo.uid == userId" class="absolute bottom-0 right-0 p-3">            
                <Button icon="pi pi-pencil"  class="border-3 border-white" rounded @click="showDialogUpload = true" />
            </div> -->
        </div>  
      </div>
  </div>

  <div v-if="maeInfo && userInfo" class="bg-white px-6 mb-0 w-full">
    <div class="sm:flex justify-content-end">
      <div class="mt-2 w-4">
        <div v-if="userInfo.uid == maeInfo.uid" class="mb-2">
          <Button 
                v-if=" userInfo['activeSession']"
                class="p-button-help p-button-lg w-full  text-white  border-round-3xl text-xl font-bold flex justify-content-center align-items-center border-none	"
                :style="{ background: 'linear-gradient(to right, #4466A7, #A073BB)' }"
                @click="stopSession"
            >
                Finalizar turno
                <img src="/assets/end.svg" class="ml-4" alt="mentoring icon" style="width: 2.0rem; height: 2.0rem;" />
            </Button>
            <Button 
                v-else
                class="p-button-help p-button-lg w-full  text-white  border-round-3xl text-xl font-bold flex justify-content-center align-items-center border-none	 "
                :style="{ background: 'linear-gradient(to right, #A74497, #D8899C)',  }"
                @click="showDialogSession = true"
            >
                Iniciar turno
                <img src="/assets/start.svg" class="ml-4" alt="mentoring icon" style="width: 2.0rem; height: 2.0rem;" />
            </Button>
        </div>
          <Button
          v-if="userInfo.uid != maeInfo.uid" 
           class="p-button-help p-button-lg w-full  text-white  border-round-3xl text-xl font-bold flex justify-content-center align-items-center border-none	"
          :style="{ background: 'linear-gradient(to right, #4466A7, #51A3AC)' }"
          @click="showDialogAsesoria = true"
          :disabled=" isSavingAsesoria" 
        >
            Registrar asesoría
            <img src="/assets/mentoring.svg" class="ml-4" alt="mentoring icon" style="width: 2.0rem; height: 2.0rem;" />
        </Button>
      </div>
    </div>
    <div class="flex flex-row">
      <div class="w-8 justify-content-center">
        <div class="">
          <p class="text-xl font-bold text-center sm:text-left "> {{ maeInfo.name }} </p>
          <p class="text-lg font-medium text-center sm:text-left">  {{ maeInfo.career }} | Campus {{ maeInfo.campus }}</p>  
        </div>
      </div>
      <div class="sm:flex justify-content-end w-4">
        <div class="mt-2 w-full">
          <Button
            v-if="userInfo.uid == maeInfo.uid" 
            class="p-button-help p-button-lg w-full  text-white  border-round-3xl text-xl font-bold flex justify-content-center align-items-center border-none "
            :style="{ background: 'linear-gradient(to right, #4466A7, #51A3AC)' }"
            @click="showDialogAsesoria = true"
            :disabled=" isSavingAsesoria" 
          >
            Tienda MAE
              <img src="/assets/mentoring.svg" class="ml-4" alt="mentoring icon" style="width: 2.0rem; height: 2.0rem;" />
          </Button>
          <Button
            v-if="userInfo.uid != maeInfo.uid" 
            class="p-button-help p-button-lg w-full  text-white  border-round-3xl text-xl font-bold flex justify-content-center align-items-center border-none	 px-4"
            :style="{ background: 'linear-gradient(to right, #4466A7, #51A3AC)' }"
            @click="showDialogAsesoria = true"
            :disabled=" isSavingAsesoria" 
          >
              Evaluar asesoría
              <img src="/assets/mentoring.svg" class="ml-4" alt="mentoring icon" style="width: 2.0rem; height: 2.0rem;" />
          </Button>
        </div>
      </div>
    </div>

    <!-- <p class="text-lg font-medium text-center sm:text-left"> <i class="pi pi-clock font-medium"></i> {{ Math.round((maeInfo.totalTime / 60) * 100) / 100 }} Horas de servicio </p>
          <p class="text-lg font-medium text-center sm:text-left"> <i class="pi pi-star font-medium"></i> {{ asesoriasCount }} Asesorías </p> -->

    <div class="flex flex-row mb-4">
      <div class="w-3">

      </div>
      <div class="w-9">
        <h2 class="font-bold text-center sm:text-left"> Materias </h2>
        <div class="mb-2">
          <InputText v-model="searchQuery" placeholder="Buscar materia" class="p-mr-2 w-full" />
        </div>
        <div class="flex flex-wrap">
            <Tag v-for="(subject, index) in filteredSubjects.slice(0, showMoreTags ? Infinity : 3)" v-tooltip.top="subject.id" :key="index"
             rounded class="text-base font-semibold text-white text-center sm:mx-1 my-1 p-3 w-full sm:w-fit mx-0" :class="getSubjectColor(subject.area)">
              {{ subject.name }}
            </Tag>
            <Button v-if="maeInfo.subjects.length > 3" @click="showMoreTags = !showMoreTags" :label="showMoreTags ? 'Mostrar menos' : 'Mostrar más'" 
              severity="secondary" rounded class="text-base font-semibold text-white mx-1 my-1" :icon="showMoreTags ? 'pi pi-chevron-left' : 'pi pi-chevron-right'" iconPos="right" />
        </div>
      </div>
    </div>
    <div class="flex flex-row mb-4">
      <div class="w-3">
        
      </div>
      <div class="w-9">
        <h2 class="font-bold text-center sm:text-left"> Horario </h2>
        <div>
          <div class="grid">
            <div v-for="day in daysArray" class="md:col col-12">
              <div class="text-center p-3 border-round-sm bg-gray-200 text-xl font-bold">{{ day['es'] }}</div>
                <div v-if="maeInfo.weekSchedule[day['en']]" v-for="(slot, index) in maeInfo.weekSchedule[day['en']]" :key="`${day['en']}-${index}`" 
                class="text-center p-2 border-round-sm bg-green-500 text-white text-base font-bold mt-2">{{ `${slot['start']} - ${slot['end']}` }}</div>
                <div v-else class="text-center p-2 border-round-sm bg-gray-100 text-black text-base font-bold mt-2"> N/A </div>
            </div>
        </div>
      </div>
    </div>
    
    
    </div>
  </div>
  
  <Dialog v-model:visible="showDialogHorarios" modal header="Editar horario" class="w-9">
    <div class="grid">
      <div v-for="day in daysArray" class="md:col-4 col-12">
        <div class="text-center p-3 border-round-sm bg-gray-200 text-xl font-bold mb-2">{{day['es']}} <Button @click="addTimeSlot(day['en'], '09:00', '10:00')" icon="pi pi-plus" class="text-sm h-1rem w-1rem ml-2"  severity="secondary" text rounded/></div>
        <span v-for="(slot, index) in newSchedule[day['en']]" :key="`editor-${day['en']}-${index}`" class="flex justify-content-around flex-wrap">
          <Dropdown v-model="newSchedule[day['en']][index]['start']" optionValue="code" :options="timeSlots" optionLabel="name" placeholder="Entrada" checkmark :highlightOnSelect="false" class="md:w-5 w-4 mb-2" />
          <Dropdown v-model="newSchedule[day['en']][index]['end']" optionValue="code" :options="timeSlots" optionLabel="name" placeholder="Salida" checkmark :highlightOnSelect="false" class="md:w-5 w-4 mb-2" />
          <Button @click="newSchedule[day['en']].splice(index, 1); newSchedule[day['en']] = newSchedule[day['en']] ?? []" icon="pi pi-times" severity="danger" text rounded aria-label="Cancel"  />
        </span>
      </div>
  </div>
    <div class="flex justify-content-end gap-2">
      <div class="bg-black">
        {{ getHorasHorario() }}  / {{ getHorasRequeridas() }}
        <br> Horas
      </div>
      <Button type="button" label="Cerrar" severity="secondary" @click="showDialogHorarios = false"></Button>
      <Button type="button" label="Guardar cambios " @click="saveScheduleChanges"></Button>
    </div>
  </Dialog>

  <Dialog v-model:visible="showDialogMaterias" modal header="Editar materias" class="custom-table md:w-9">
  <div class="flex flex-col gap-2 my-4">
    <InputText v-model="subjectTableFilter['global'].value" placeholder="Buscar materia por nombre o código" class="w-full" />
    <InputText v-model="subjectTableFilter['semester'].value"  placeholder="Semestre" class="" />
    <Dropdown :options="areaOptions" option-label="label" option-value="value" v-model="subjectTableFilter['area'].value" placeholder="Área" class="" />
    <Dropdown :options="topOptions" option-label="label" option-value="value" v-model="subjectTableFilter['top'].value" placeholder="Top" class="" />
  </div>
  <DataTable :value="subjects" paginator :rows="10" :rowsPerPageOptions="[10, 25, 50, 100]"
    v-model:filters="subjectTableFilter" :globalFilterFields="['id', 'name', 'semester', 'area', 'top']"
    v-model:selection="selectedSubjects" responsiveLayout="stack">
    <template #empty>No se encontraron resultados.</template>
    <Column selectionMode="multiple" headerStyle="visibility:hidden"></Column>
    <Column field="id" header="Código"></Column>
    <Column field="name" class="text-right sm:text-left" header="Nombre"></Column>
    <Column field="semester" header="Semestre"></Column>
    <Column field="area" header="Área"></Column>
    <Column field="top" header="Top">
      <template #body="slotProps">
        <i v-if="slotProps.data.top" class="pi pi-star-fill" style="color: gold;"></i>
      </template>
    </Column>
  </DataTable>
  <div class="flex justify-content-end gap-2">
    <Button type="button" label="Cerrar" severity="secondary" @click="showDialogMaterias = false"></Button>
    <Button type="button" label="Guardar cambios" @click="saveSubjectChanges"></Button>
  </div>
</Dialog>

  <Dialog v-model:visible="showDialogAsesoria" modal header="Registrar asesoría" class="md:w-4">
    <p class="font-bold">Materia</p>
    <Dropdown v-model="materiaAsesoria" :options="subjects" filter optionLabel="name" placeholder="Materia" checkmark :highlightOnSelect="false" class="w-12 mb-2" />
    <p class="font-bold">Comentario</p>
    <Textarea v-model="comentarioAsesoria" placeholder="Agrega un comentario" variant="filled" rows="5" cols="30" class="w-12" />
    <p class="font-bold mt-3">Califica tu asesoría</p>
    <Rating v-model="ratingAsesoria" :cancel="false"/>
    <div class="flex justify-content-end gap-2">
      <Button type="button" label="Cerrar" severity="secondary" @click="showDialogAsesoria = false"></Button>
      <Button type="button" label="Confirmar registro" :disabled="!(materiaAsesoria !== null)" @click="saveAsesoria"></Button>
    </div>
  </Dialog>

  <Dialog v-model:visible="showDialogSession" modal header="Iniciar turno" class="md:w-4">
    <label for="location">Por favor indica donde te encuentras</label>
    <InputText id="text" v-model="location" placeholder="Biblioteca Piso 3" class="w-full mb-4"/>
    <div class="flex justify-content-end gap-2">
      <Button type="button" label="Cerrar" severity="secondary" @click="showDialogSession = false"></Button>
      <Button type="button" label="Iniciar turno" :disabled="location === ''" @click="startSession"></Button>
    </div>
  </Dialog>

  <Dialog v-model:visible="showDialogUpload" modal header="Cambiar foto de perfil" class="md:w-4">
    <div v-if="previewUrl" class="mb-3 flex justify-content-center">
      <img :src="previewUrl" alt="Vista previa" class="border-circle h-16rem w-16rem">
    </div>
    <div
      class="border-2 border-dashed p-3 text-center cursor-pointer"
      @dragover.prevent
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <p class="mb-3">Arrastra y suelta tu imagen aquí, o haz clic para seleccionar un archivo</p>
      <input type="file" ref="fileInput" @change="handleFileChange" accept=".jpg, .jpeg, .png" class="hidden" />
    </div>

    <div class="flex justify-content-end gap-2 mt-2">
      <Button type="button" label="Cerrar" severity="secondary" @click="showDialogUpload = false"></Button>
      <Button type="button" label="Subir" :disabled="!selectedFile" @click="uploadProfilePicture"></Button>
    </div>
  </Dialog>
</template>

<style scoped>
.space-x > * {
  margin-left: 1rem;
}
.space-y > * {
  margin-bottom: 1rem; 
}
.border-round-lg {
  border-radius: 0.75rem;
}
.custom-table .p-datatable-tbody > tr:nth-child(even) {
    background-color: #f2f2f2; 
    border: 1px solid #f4f4f5a9;

}
.custom-table .p-datatable-tbody > tr:nth-child(odd) {
    background-color: #ffffff; 
    border: 1px solid #f4f4f5a9;
}
.custom-table .p-datatable-tbody > tr > td {
    border-bottom: 2px solid #cccccc; 
    padding: 1rem 1.5rem; 
}
</style>
