<script setup>
import { ref, onMounted } from 'vue';
import { getSubjects  } from '../firebase/db/subjects';
import { normalize } from '@/utils/HorarioUtils';
import { saveAnnouncement, getAnnouncementsEdit,processAsistence, deleteAnnouncementById,
  updateAnnouncement,toggleVisibilityById}
 from '@/firebase/db/annoucement';
import { useToast } from 'primevue/usetoast';
import {
  formatDate,
  formatTime
} from '@/utils/AnunciosUtils';
import { getMaes} from '@/firebase/db/users';
import MultiSelect from 'primevue/multiselect';

const selectedType = ref('Asesoría');
const subjects = ref([]);
const filteredSubjects = ref([]);
const subjectInput = ref('');
const fileInput = ref(null);
const showDateDialog = ref(false);
const locationInput = ref('');
const toast = useToast();
const dateTime = ref(null);
const startTime = ref(null);
const endTime = ref(null);
const selectedFile = ref(null);
const titleInput = ref(''); 
const descriptionInput = ref('');
const previewUrl = ref(null);
const anuncios = ref([]);
const showInfoDialog = ref(false);
const selectedOption = ref('informacion');
const selectedAnuncio = ref(null); 
const processedAsistence = ref(null); 
const displayPreviewDialog = ref(false);
const maeInfo = ref(null);
const showDialogAsesoria = ref(false);
const showDialogDelete = ref(false);
const maeSelect = ref([])
const isEdit = ref(false);
const menuItems = [
  {
    label: 'Información',
    command: () => { selectedOption.value = 'informacion'; }
  },
  {
    label: 'Pre-registro',
    command: () => { selectedOption.value = 'pre-registro'; }
  }
];

onMounted(async () => {
  subjects.value = await getSubjects();
  anuncios.value = await getAnnouncementsEdit();
  maeInfo.value = await getMaes()
});

const loadAsistance = async () => {
  processedAsistence.value = await processAsistence(selectedAnuncio.value.id);
};


const handleSelect = (type) => {
    selectedType.value = type;
    if (type === 'Otro') {
      reset() 
    }
};

const filterSubjects = () => {
    const query = normalize(subjectInput.value);
    filteredSubjects.value = subjects.value.filter(subject =>
        normalize(subject.name).includes(query)
    );
};

const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    return file && allowedTypes.includes(file.type);
};

const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && validateFile(file)) {
        selectedFile.value = file;
        previewUrl.value = URL.createObjectURL(file);
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor, selecciona un archivo de imagen válido (JPEG o PNG).', life: 3000 });
    }
};

const handleDrop = (event) => {
    const file = event.dataTransfer.files[0];
    if (file && validateFile(file)) {
        selectedFile.value = file;
        previewUrl.value = URL.createObjectURL(file);
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor, selecciona un archivo de imagen válido (JPEG o PNG).', life: 3000 });
    }
};

const triggerFileInput = () => {
    if (fileInput.value) {
        fileInput.value.click();
    }
};

const removeFile = () => {
    selectedFile.value = null;
};

const openDateDialog = () => {
    showDateDialog.value = true;
};

const openInfoDialog = async (anuncio) => {
  selectedAnuncio.value = anuncio;
  await loadAsistance();
  showInfoDialog.value = true;
};

const convertTimestampToDate = (timestamp) => {
    if (timestamp && typeof timestamp.seconds === 'number') {
        return new Date(timestamp.seconds * 1000);
    }
    return null;
};


const saveDateTime = () => {
    const today = new Date();
    const selectedDate = new Date(dateTime.value);
    if (!dateTime.value || !startTime.value || !endTime.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor selecciona una fecha y un rango de horario.', life: 3000 });
        return;
    }
    if (selectedDate.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'La fecha seleccionada no puede ser antes del día de hoy.', life: 3000 });
        return;
    }
    if (startTime.value >= endTime.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'La hora de inicio debe ser menor que la hora de fin.', life: 3000 });
        return;
    }
    showDateDialog.value = false;
};

const handleSubmit = async () => {
  if (selectedType.value === 'Asesoría' && typeof subjectInput.value === 'string') {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Acuerdate que debes seleccionar la materia.',
      life: 3000
    });
    //else if (selectedType.value === 'Otro' && typeof subjectInput.value === 'string')
    return;
  }

  if (selectedType.value === 'Asesoría') {
    if (!subjectInput.value || !dateTime.value || !startTime.value || !endTime.value || !selectedFile.value) {
      toast.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Por favor completa todos los campos antes de guardar.', 
        life: 3000 
      });
      return;
    }
    
    if (maeSelect.value.length === 0) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor asigna los maes y al coordinador que darán la asesoría.',
        life: 3000
      });
      return;
    }

    try {
      const selectedMaes = maeSelect.value.map(mae => ({
        uid: mae.uid,
        name: mae.name,
        career: mae.career,
        campus: mae.campus,
        area: mae.area,
      }));
      const announcementData = {
        type: selectedType.value,
        subject: subjectInput.value,
        dateTime: dateTime.value,
        startTime: startTime.value,
        endTime: endTime.value,
        location: locationInput.value || 'Indefinido', 
        maesAsignados: selectedMaes,
        visible: true  
      };
      
      await saveAnnouncement(announcementData, selectedFile.value);
      anuncios.value = await getAnnouncementsEdit();
      reset();
      showDialogAsesoria.value = false;
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Anuncio guardado con éxito', life: 3000 });
    } catch (error) {
      console.error('Error al guardar el anuncio:', error);
      toast.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar el anuncio. Intenta de nuevo.', life: 3000 });
    }
  } else if (selectedType.value === 'Otro') {
    if (!titleInput.value || !descriptionInput.value || !selectedFile.value) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor completa todos los campos de título, descripción e imagen.', life: 3000 });
      return;
    }
    try {
      const announcementData = {
        type: selectedType.value,
        title: titleInput.value,
        description: descriptionInput.value,
        visible: true
      };
      
      console.log('Data to save:', announcementData);
      
      await saveAnnouncement(announcementData, selectedFile.value);
      reset();
      anuncios.value = await getAnnouncementsEdit();
      showDialogAsesoria.value = false;
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Anuncio guardado con éxito', life: 3000 });
    } catch (error) {
      console.error('Error al guardar el anuncio:', error);
      toast.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar el anuncio. Intenta de nuevo.', life: 3000 });
    }
  }
};

const reset = () => {
  subjectInput.value = '';
  locationInput.value = '';
  titleInput.value = '';  
  descriptionInput.value = '';  
  startTime.value = null
  endTime.value = null
  dateTime.value = null 
  locationInput.value = ''
  selectedFile.value = null 
  maeSelect.value = []
  previewUrl.value = null
  selectedFile.value = null
}

const openPreviewDialog = () => {
    displayPreviewDialog.value = true;
};

const closePreviewDialog = () => {
    displayPreviewDialog.value = false;
};

const closeInfoDialog = () => {
    showInfoDialog.value = false
    isEdit.value = false
    reset()
};
const formatDateComplete = (date, start, end) => {
  const formattedDate = formatDate(date); 
  const formattedStartTime = formatTime(start, false); 
  const formattedEndTime = formatTime(end, true);
  return `${formattedDate}, ${formattedStartTime} - ${formattedEndTime}`;
};

const handleVisible = async () => {
      try {
        if (selectedAnuncio.value?.id) {
          
          await toggleVisibilityById(selectedAnuncio.value.id); 
          anuncios.value = await getAnnouncementsEdit();
          showDialogDelete.value = false;
          showInfoDialog.value = false;
          if(selectedAnuncio.value?.visible){
            toast.add({
            severity: "success",
            summary: "Éxito",
            detail: "Anuncio ocultado",
            life: 3000,
          });
          }else{
            toast.add({
            severity: "success",
            summary: "Éxito",
            detail: "Anuncio desocultado",
            life: 3000,
          });
          }
          
        }
      } catch (error) {
        console.error("Error al ocultar el anuncio:", error);

        toast.add({
          severity: "error",
          summary: "Error",
          detail: "No se pudo ocultar el anuncio",
          life: 3000,
        });
      }
    };

const handleDelete = async () => {
      try {
        if (selectedAnuncio.value?.id) {
          await deleteAnnouncementById(selectedAnuncio.value.id); 
          anuncios.value = await getAnnouncementsEdit();
          showDialogDelete.value = false;
          showInfoDialog.value = false;
          toast.add({
            severity: "success",
            summary: "Éxito",
            detail: "Anuncio eliminado con éxito",
            life: 3000,
          });
        }
      } catch (error) {
        console.error("Error al eliminar el anuncio:", error);

        toast.add({
          severity: "error",
          summary: "Error",
          detail: "No se pudo eliminar el anuncio",
          life: 3000,
        });
      }
    };

const isLoading = ref(false);

const handleEdit = async () => {
    isLoading.value = true;
    try {
        maeInfo.value = await getMaes();
        isEdit.value = true;
        subjectInput.value = selectedAnuncio.value.subject;
        startTime.value = convertTimestampToDate(selectedAnuncio.value.startTime);
        endTime.value = convertTimestampToDate(selectedAnuncio.value.endTime);
        dateTime.value = convertTimestampToDate(selectedAnuncio.value.dateTime);
        locationInput.value = selectedAnuncio.value.location || 'Indefinido';
        maeSelect.value = selectedAnuncio.value.maesAsignados.map(mae =>
            maeInfo.value.find(info => info.uid === mae.uid)
        );
        isLoading.value = false;
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    } 
};

const handleEditAnn = async () => {
    if (selectedType.value === 'Asesoría') {
        if (!subjectInput.value || !dateTime.value || !startTime.value || !endTime.value) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor completa todos los campos antes de guardar.', life: 3000 });
            return;
        }
        if (maeSelect.value.length === 0) {
            toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Por favor asigna los maes y al coordinador que darán la asesoría.',
              life: 3000
            });
            return;
        }

        try {
          const selectedMaes = maeSelect.value.map(mae => ({
            uid: mae.uid,
            name: mae.name,
            career: mae.career,
            campus: mae.campus,
            area: mae.area,
          }));

          const updatedData = {
              subject: subjectInput.value,
              dateTime: dateTime.value,
              startTime: startTime.value,
              endTime: endTime.value,
              location: locationInput.value || 'Indefinido',
              maesAsignados: selectedMaes
          };

          await updateAnnouncement(selectedAnuncio.value.id, updatedData);
          anuncios.value = await getAnnouncementsEdit();
          reset();
          showInfoDialog.value = false
          toast.add({ severity: 'success', summary: 'Éxito', detail: 'Anuncio actualizado con éxito', life: 3000 });
        } catch (error) {
            console.error('Error al actualizar el anuncio:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el anuncio. Intenta de nuevo.', life: 3000 });
        }
    } else if (selectedType.value === 'Otro') {
        if (!titleInput.value || !descriptionInput.value) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor completa todos los campos de título, descripción.', life: 3000 });
            return;
        }
        try {
            const updatedData = {
                title: titleInput.value,
                description: descriptionInput.value
            };

            await updateAnnouncement(selectedAnuncio.value.id, updatedData);
            anuncios.value = await getAnnouncementsEdit();
            showInfoDialog.value = false
            reset();
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Anuncio actualizado con éxito', life: 3000 });
        } catch (error) {
            console.error('Error al actualizar el anuncio:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el anuncio. Intenta de nuevo.', life: 3000 });
        }
    }
};


</script>

<template>
  <div class="flex md:flex-row flex-column">
    <!-- Primera columna -->
    <div class="flex flex-column md:w-6">
      <h1 class="text-black text-2xl md:text-3xl font-bold mb-3 text-left">
        Gestión de anuncios
      </h1>
      <span class="flex flex-column sm:flex-row justify-content-between items-center">
        <p class="text-black text-lg md:text-xl font-semibold text-left mt-3">
          Tipo de anuncio
        </p>
        <div class="flex flex-row sm:justify-content-end bg-white border-round-xl shadow-3 w-16rem">
          <Button 
            label="Asesoría" 
            :class="[ 
              'custom-button w-8rem text-lg md:text-xl', 
              selectedType === 'Asesoría' ? 'selected border-round-xl' : 'bg-white text-black border-round-left-xl' 
            ]"
            @click="handleSelect('Asesoría')"
          />

          <Button 
            label="Otro" 
            :class="[ 
              'custom-button font-bold text-black w-8rem text-lg md:text-xl', 
              selectedType === 'Otro' ? 'selected border-round-xl ' : 'bg-white text-black border-round-right-xl' 
            ]"
            @click="handleSelect('Otro')"
          />
        </div>
      </span>
      
      <!-- Campos para 'Asesoría' -->
      <div v-if="selectedType === 'Asesoría'">
        <p class="text-black text-lg md:text-xl font-semibold text-left ">
          Materia
        </p>
        <AutoComplete 
          class="w-full"
          v-model="subjectInput" 
          :suggestions="filteredSubjects" 
          @complete="filterSubjects" 
          field="name" 
          dropdown 
          :forceSelection="false"
          placeholder="Buscar materia..." 
        />
        <span class="flex flex-column md:flex-row">
          <span class="flex flex-column w-6">
              <p class="text-black text-lg md:text-xl font-semibold text-left mt-3">
                  Fecha & horario
              </p>
              <div class="p-inputgroup w-full">
                  <span class="p-inputgroup-addon">
                  <i class="pi pi-calendar"></i> 
                  </span>
                  <Button 
                    label=" Fecha y horario" 
                    class="p-button-outlined w-full bg-white text-black p-inputgroup-addon text-left  w-full md:w-9" 
                    icon="pi pi-chevron-down" 
                    iconPos="right"
                    @click="openDateDialog"
                  />
              </div>
          </span>

          <span class="flex flex-column">
            <p class="text-black text-lg md:text-xl font-semibold text-left mt-3">
              Ubicación
              <i class="pi pi-map-marker mr-2" style="font-size: 1.5rem;"></i>
            </p>
            <InputText v-model="locationInput" placeholder="Ingresa la ubicación" class="w-full" />
          </span>
        </span>
      </div>

      <!-- Campos para 'Otro' -->
      <div v-if="selectedType === 'Otro'">
        <p class="text-black text-lg md:text-xl font-semibold text-left m-1">
          Título
        </p>
        <InputText v-model="titleInput" maxlength="80" placeholder="Ingresa el título" class="w-full" />
        <p class="text-gray-600 text-sm mt-1 ml-1">
          {{ titleInput.length }}/80 caracteres
        </p>
        <p class="text-black text-lg md:text-xl font-semibold text-left  m-1">
          Descripción
        </p>
        <InputText v-model="descriptionInput" maxlength="120" placeholder="Ingresa la descripción" class="w-full" />
        <p class="text-gray-600 text-sm mt-1 ml-1 ">
          {{ descriptionInput.length }}/120 caracteres
        </p>
      </div>
      <p class="text-black text-lg md:text-xl font-semibold text-left mt-3">
        Portada
      </p>
      <div class="border-2 border-dashed pt-1 border-round-xl cursor-pointer" @dragover.prevent @drop.prevent="handleDrop" @click="triggerFileInput">
        <p v-if="!selectedFile">
          <span class="flex flex-row items-center text-center justify-content-center mt-3">
            Subir imagen de portada <i class="pi pi-image text-3xl ml-2"></i>
          </span>
        </p>
        <p v-else>
          <span class="flex flex-row items-center text-center justify-content-center mt-3">
            <i class="pi pi-image text-3xl mr-2"></i>
            {{ selectedFile.name }}
            <button @click="removeFile" class="mr-2 text-red-500">x</button>
          </span>
        </p>
        <input type="file" ref="fileInput" @change="handleFileChange" accept=".jpg, .jpeg, .png" class="hidden" />  
      </div>
      <span class="flex flex-column md:flex-row justify-content-between mt-3">
        <Button label="Agregar" class="custom-button font-bold text-black w-full md:w-5 text-lg md:text-xl selected border-round-xl"   @click="showDialogAsesoria = true" />
        <Button class="font-bold text-black-alpha-70 w-full md:w-6 text-lg md:text-xl border-none bg-transparent"
          @click="openPreviewDialog"         
        >
          <p class="text-black-alpha-70 m-auto"><i class="pi pi-eye mr-2 text-md"></i> Ver previsualización</p>
        </Button>
      </span>
    </div>

    <div class="second-column mt-2 pt-3 flex flex-column md:w-6 md:ml-3 border-round-3xl" style="max-height: 500px; overflow-y: auto;">
      <div
        v-for="anuncio in anuncios"
        :key="anuncio.id"
        class=" mx-4 my-2 border-round-3xl h-auto p-3 relative"
        :class="anuncio.visible ? 'bg-white' : 'bg-gray-500'"
      >
        <i v-if="!anuncio.visible" class="pi pi-eye-slash text-5xl text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"></i>

        <div class="flex flex-row justify-content-between">
          <p class="font-bold text-xl text-left mt-0 mb-1">
            {{ anuncio.type === 'Asesoría' ? (anuncio.subject.name.length > 30 ? anuncio.subject.name.slice(0, 30) + '...' : anuncio.subject.name)  : (anuncio.title.length > 30 ? anuncio.title.slice(0, 30) + '...' : anuncio.title) }}
          </p>
          <i @click="openInfoDialog(anuncio)" class="pi pi-info-circle mr-2 text-2xl cursor-pointer"   
          :class="anuncio.visible ? 'text-gray-500 ' : 'text-white'"></i>
        </div>
        
        <p v-if="anuncio.type === 'Asesoría'" class="font-medium text-xl text-left mt-0 mb-1">
          {{ anuncio.location }}
        </p>
        
        <p v-else class="font-medium text-xl text-left mt-0 mb-1">
          {{ anuncio.description }}
        </p>

        <Divider v-if="anuncio.type === 'Asesoría'" class="m-0 second-column"/>

        <div v-if="anuncio.type === 'Asesoría'" class="flex flex-row justify-content-between mb-2 mt-2">
          <div class="text-left text-xl">
            {{ formatTime(anuncio.startTime, false) }} - {{ formatTime(anuncio.endTime, true) }}
          </div>
          <div class="text-left text-xl">
            {{ formatDate(anuncio.dateTime) }}
          </div>
        </div>
      </div>
    </div>

  </div>

      <Dialog 
        v-model:visible="showDateDialog" 
        header="Seleccionar Fecha y horario" 
        :modal="true" 
        :closable="true"  
        :dismissable-mask="true"
      >
        <div>
          <Calendar 
            v-model="dateTime" 
            placeholder="Seleccionar Fecha" 
            class="w-full mb-3" 
          />

          <p>Hora de inicio:</p>
          <Calendar 
            v-model="startTime" 
            timeOnly 
            showTime 
            hourFormat="24" 
            stepMinute="30" 
            class="w-full mb-3" 
            placeholder="Seleccionar Hora de Inicio" 
          />

          <p>Hora de fin:</p>
          <Calendar 
            v-model="endTime" 
            timeOnly 
            showTime 
            hourFormat="24" 
            stepMinute="30" 
            class="w-full" 
            placeholder="Seleccionar Hora de Fin" 
          />

          <div class="mt-3 flex justify-content-end">
            <Button 
              label="Guardar" 
              class="p-button-success mr-2" 
              @click="saveDateTime" 
            />
            <Button 
              label="Cancelar" 
              class="p-button-secondary" 
              @click="() => { showDateDialog = false; dateTime = null;startTime = null; endTime = null; }" 
            />
          </div>
        </div>
      </Dialog>

      <Dialog 
            v-model:visible="displayPreviewDialog" 
            header="Previsualización"
            modal
            :style="{ width: '55%' }"
            :closable="true"
            :dismissable-mask="true"
        >
        <div class="flex   flex-wrap border-round-3xl text-white  h-18rem" :style="{ background: 'linear-gradient(to right, #779AC4, #29AB93)'}">
          <div class="relative w-full md:w-4 border-round-left-3xl">
            <span class="overlay">
              <Button
                label="Previsualización"
                class="text-xl border-none btn-left hidden block  border-round-top-left-3xl"
              />
              <img
                class="w-full h-18rem clip-diagonal border-round-top-3xl md:border-round-left-3xl arrow"
                :src="previewUrl || 'https://i.imgur.com/C6psSY1.png'"
              />
            </span>
          </div>
          <div class="w-full md:w-8 text-center p-4 flex gap-5">
            <div>
              <template v-if="selectedType === 'Asesoría'">
                <h2 class="text-white text-3xl font-bold" >
                  Asesorías grupales
                </h2>
              <p class="font-medium text-xl text-left ml-5">
                Materia: {{ subjectInput.name }} 
              </p>
              <p class="font-medium text-xl text-left ml-5">
                Fecha: {{ formatDate(dateTime) }}, {{ formatTime(startTime, false) }} - {{ formatTime(endTime, true) }}
              </p>
              <p class="font-medium text-xl text-left ml-5">
                Ubicación: {{ locationInput }} 
              </p>
              <p class="text-white text-2xl font-bold text-right text-left ml-5">
                Pre-registro <i class="pi pi-arrow-right text-2xl font-bold"></i>
              </p>
              
            </template>

            <template v-if="selectedType === 'Otro'">
              <h2 class="text-white text-3xl font-bold" >
                {{ titleInput}}
              </h2>
              <p class="font-medium text-xl mr-2 text-left ml-5 w-10">
                 {{ descriptionInput  }} 
              </p>
            </template>   
          </div>
          </div>
        </div>
             <span class="flex justify-content-center">
              <Button 
                label="Cerrar previsualización" 
                class=" p-button-rounded mt-4 selected  border-round-left-3xl"
                @click="closePreviewDialog" 
            />
             </span>
        </Dialog>
        
        <Dialog 
          v-model:visible="showInfoDialog"
          :modal="true" 
          :closable="true"  
          :dismissable-mask="true"
          class="mr-3 w-8"
          @hide="closeInfoDialog"

        >
          <template #header>
            <Menubar v-if="selectedAnuncio?.type === 'Asesoría'" :model="menuItems" />
            <span v-else>
              <h3>Información</h3>
            </span>
          </template>
         
          <div v-if="selectedOption === 'informacion' && selectedAnuncio.type != 'Asesoría'">
            <p>{{ selectedAnuncio?.title || 'No hay información disponible' }}</p>
            <p>{{ selectedAnuncio?.description || 'Sin descripción' }}</p>
          </div>
          <div v-if="isLoading" class="loading-indicator ">
            <ProgressSpinner style="width: 60px; height: 60px; animation: spin-fast 0.5s linear infinite;" strokeWidth="6" fill="var(--surface-ground)" />
            
          </div>
          <div class="flex flex-row" v-if="selectedOption === 'informacion' && selectedAnuncio.type == 'Asesoría' && !isLoading">
            <div class="w-8 ml-5">
              <p class="text-black text-xl font-semibold text-left ">
                Materia
              </p>
              <span v-if="isEdit">
                <AutoComplete 
                  class="w-full"
                  v-model="subjectInput" 
                  :suggestions="filteredSubjects" 
                  @complete="filterSubjects" 
                  field="name" 
                  dropdown 
                  :forceSelection="false"
                  placeholder="Buscar materia..." 
                />
              </span>
              <span v-else>
                <InputText 
                :value="selectedAnuncio?.subject.name" 
                class="w-full text-lg" 
                readonly 
              />
              </span>
              <p class="text-black text-xl font-semibold text-left  mt-4">
                Fecha y hora
              </p>
              <span v-if="isEdit">
                <div class="p-inputgroup w-full">
                  <span class="p-inputgroup-addon">
                  <i class="pi pi-calendar"></i> 
                  </span>
                  <Button 
                  label=" Fecha y horario" 
                  class="p-button-outlined w-full bg-white text-black p-inputgroup-addon text-left  w-full md:w-9" 
                  icon="pi pi-chevron-down" 
                  iconPos="right"
                  @click="openDateDialog"
                  />
              </div>
              </span>
              <span v-else>
                <InputText 
                  :value="`${formatDateComplete(selectedAnuncio?.dateTime, selectedAnuncio?.startTime, selectedAnuncio?.endTime)}`" 
                  class="w-full text-lg" 
                  readonly 
                />
              </span> 
              
              <p class="text-black text-xl font-semibold text-left  mt-4">
                Ubicación
              </p>
              <span v-if="isEdit">
                <InputText v-model="locationInput" placeholder="Ingresa la ubicación" class="w-full" />
              </span>
              <span v-else>
                <InputText 
                  :value="selectedAnuncio?.location" 
                  class="w-full text-lg" 
                  readonly 
                />
              </span>

              <span v-if="isEdit">
                <p class="text-black text-xl font-semibold text-left  mt-4"><strong> MAEs y coordinador seleccionados:</strong></p>
                <MultiSelect
                  v-model="maeSelect" 
                  :options="maeInfo"
                  optionLabel="name"
                  placeholder="Seleccione Maes"
                  filter
                  class="w-12 mb-2"
                  showClear
                />
                <div v-if="maeSelect.length > 0" class="mt-4">
                  
                  <ul>
                    <li v-for="mae in maeSelect" :key="mae.uid">{{ mae.name }}</li>
                  </ul>
                </div>
              </span>
              
              <span v-else>
                <div v-if="selectedAnuncio?.maesAsignados.length > 0" class="mt-4">
                  <p class="text-black text-xl font-semibold text-left  mt-4"><strong> MAEs y coordinador seleccionados:</strong></p>
                  <ul>
                    <li v-for="mae in selectedAnuncio?.maesAsignados" :key="mae.uid">{{ mae.name }}</li>
                  </ul>
                </div>
              </span> 
            </div>

            <div class="w-4 flex  flex-column justify-content-center align-items-center ml-5">
              <Button
                class="p-button-help p-button-lg py-3 w-8 text-white border-round-3xl mb-3 text-xl font-bold flex justify-content-center align-items-center border-none"
                :style="{ background: '#4484A7' }"
                @click="handleEdit"
                v-if="!isEdit"
              >
                Editar
                <img src="/assets/editAnun.svg" class="ml-4" alt="edit icon" style="width: 2.0rem; height: 2.0rem;" />
              </Button>
              <Button
                class="p-button-help p-button-lg py-3 w-8 text-white border-round-3xl mb-3 text-xl font-bold flex justify-content-center align-items-center border-none"
                :style="{ background: '#646464' }"
                @click="handleVisible"
              >
                <span v-if="selectedAnuncio?.visible" class="flex items-center gap-2">
                  <p class="m-0">Ocultar</p> 
                  <i :class="'pi pi-eye'" class="ml-2" style="font-size: 2.0rem;"></i> 
                </span>
                <span v-else class="flex items-center gap-2"> 
                  <p class="m-0 mr-5">Desocultar</p> 
                  <i :class="'pi pi-eye-slash'" class="ml-7" style="font-size: 2.0rem;"></i> 
                </span>
              </Button>

              <Button
                class="p-button-help p-button-lg py-3 w-8 text-white border-round-3xl mb-3 text-xl font-bold flex justify-content-center align-items-center border-none"
                :style="{ background: '#C55F5F' }"
                @click="showDialogDelete = true"
          
              >
                Eliminar
                <img src="/assets/trash.svg" class="ml-4" alt="trash icon" style="width: 2.0rem; height: 2.0rem;" />
              </Button>
              <Button
                class="p-button-help p-button-lg py-3 w-8 text-white border-round-3xl mt-6 text-xl font-bold flex justify-content-center align-items-center border-none"
                :style="{ background: 'linear-gradient(to right, #4466A7, #51A3AC)' }"
                @click="closeInfoDialog"
                v-if="!isEdit"
              >
                Cerrar
              </Button>
              <Button 
                label="Guardar" 
                class="p-button-help p-button-lg py-3 w-8 text-white border-round-3xl mt-6 text-xl font-bold flex justify-content-center align-items-center border-none"
                v-if="isEdit"
                @click="handleEditAnn"
                :style="{ background: 'linear-gradient(to right, #44A79b, #69ac51)' }"
              />
              <Button 
                label="Cancelar" 
                class="p-button-help p-button-lg py-3 w-8 text-white border-round-3xl mt-3 text-xl font-bold flex justify-content-center align-items-center border-none"
                @click="closeInfoDialog"
                v-if="isEdit"
                :style="{ background: 'linear-gradient(to right, #4466A7, #51A3AC)' }"
              />
            </div>
          </div>

          <div v-else-if="selectedOption === 'pre-registro' && selectedAnuncio.type == 'Asesoría'" class="flex flex-row">
            <div class="w-8 ml-5">
              <DataTable 
                :value="processedAsistence" 
                paginator 
                :rows="4" 
                dataKey="id" 
                :loading="loading" 
                responsiveLayout="scroll" 
                class="custom-table "
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
                
                <Column header="Asistencia" field="asistence">
                  <template #body="{ data }">
                    <p class="text-sm">
                      <img 
                        v-if="!data.asistence" 
                        src="/assets/cancel.svg" 
                        class="ml-4" 
                        alt="cancel icon" 
                        style="width: 2.0rem; height: 2.0rem;" 
                      />
                      <img 
                        v-else 
                        src="/assets/check.svg" 
                        class="ml-4" 
                        alt="check icon" 
                        style="width: 2.0rem; height: 2.0rem;" 
                      />
                    </p>
                  </template>
                </Column>

              </DataTable>

            </div>

            <div class="w-4 ml-5">
              <Button
                class="p-button-help p-button-lg py-3 w-8 text-white border-round-3xl mt-6 text-xl font-bold flex justify-content-center align-items-center border-none"
                :style="{ background: 'linear-gradient(to right, #4466A7, #51A3AC)' }"
                @click="showInfoDialog= false"
              >
                Cerrar
              </Button>
            </div>
            
          </div>
          
        </Dialog>
        
        <Dialog 
          v-model:visible="showDialogAsesoria" 
          modal 
          header="Seleccionar MAEs" 
          class="md:w-4"
        >
          <p> Selecciona a los MAEs y coordinador que participarán en esta asesoría grupal</p>
          <MultiSelect
            v-model="maeSelect" 
            :options="maeInfo"
            optionLabel="name"
            placeholder="Seleccione Maes"
            filter
            class="w-12 mb-2"
            showClear
          />
          <div v-if="maeSelect.length > 0" class="mt-4">
            <p><strong> MAEs y coordinador seleccionados:</strong></p>
            <ul>
              <li v-for="mae in maeSelect" :key="mae.uid">{{ mae.name }}</li>
            </ul>
          </div>

          <template #footer>
            <div class="flex justify-content-end mt-4">
              <Button 
                label="Confirmar" 
                @click="handleSubmit"
                :style="{ background: 'linear-gradient(to right, #44a79b, #69ac51)' }"
              />
              <Button 
                label="Cerrar" 
                class="p-button-text mr-2" 
                @click="showDialogAsesoria = false"
              />
            </div>
          </template>
        </Dialog>

        <Dialog 
          v-model:visible="showDialogDelete" 
          modal  
          :header="`¿Deseas eliminar esta asesoria ${selectedAnuncio?.title || selectedAnuncio?.subject.name}?`" 
          class="md:w-4"
        >

          <template #footer>
            <div class="flex justify-content-end mt-4">
              <Button 
                label="Eliminar" 
                @click="handleDelete"
               :style="{ background: '#C55F5F' }"
              />
              <Button 
                label="Cerrar" 
                class="p-button-text mr-2" 
                @click="showDialogDelete= false"
              />
            </div>
          </template>
        </Dialog>


</template>

<style scoped>
.second-column{
  background-color: #d2d2d2;
}

.custom-button {
  border: none;
  background-color: white;
  color: black;
  font-weight: bold;
}

.selected {
  background: linear-gradient(to right, #4466A7, #51A3AC);
  color: white;
}

.custom-button:focus {
  box-shadow: none;
}

.btn-left {
    position: absolute;
    top: 0%;
    left: 0;
    z-index: 10; 
    color: white; 
    background: linear-gradient(to right, #4466A7, #51A3AC);
}
  .arrow{
    filter: brightness(0.8);
  }

  @media (min-width: 968px) {
  .clip-diagonal {
    clip-path: polygon(0 0, 85% 0, 100% 100%, 0 100%);
    
  }
}

.custom-table .p-datatable-tbody > tr:nth-child(even) {
    background-color: #ffffff;
}

.custom-table .p-datatable-tbody > tr:nth-child(odd) {
    background-color: #f2f2f2 ;
}

.custom-table {
    border-radius: 12px; 
    overflow: hidden; 
    border: 1px solid #e4e7e6; 
}


.custom-table .p-datatable-tbody > tr > td span p {
    margin: 0;
}

.custom-table .p-datatable-tbody > tr > td {
    border-bottom: 1px solid #e4e7e6;
    padding: 1rem 1.5rem;
    text-align: left;
}

.pi-eye-slash {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2.5rem;
}
</style>
