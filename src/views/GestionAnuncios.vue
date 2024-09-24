<script setup>
import { ref, onMounted } from 'vue';
import { getSubjects,  } from '../firebase/db/subjects';
import { normalize } from '@/utils/HorarioUtils';
import { saveAnnouncement } from '@/firebase/db/asesorias';
import { useToast } from 'primevue/usetoast';

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

onMounted(async () => {
    subjects.value = await getSubjects();
});

const handleSelect = (type) => {
    selectedType.value = type;
    if (type === 'Otro') {
        // Limpiar campos todos los campos 
        subjectInput.value = '';
        locationInput.value = '';
        titleInput.value = '';  
        descriptionInput.value = '';  
        startTime.value = null
        endTime.value = null
        dateTime.value = null 
        locationInput.value = ''
        selectedFile.value = null 
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

const saveDateTime = () => {
    const today = new Date();
    const selectedDate = new Date(dateTime.value);

    if (!dateTime.value || !startTime.value || !endTime.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor selecciona una fecha y un rango de horas.', life: 3000 });
        return;
    }

    if (selectedDate.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'La fecha seleccionada no puede ser antes del día de hoy.', life: 3000 });
        return;
    }
    console.log(startTime, endTime, "Aca estoy")
    if (startTime.value >= endTime.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'La hora de inicio debe ser menor que la hora de fin.', life: 3000 });
        return;
    }

    showDateDialog.value = false;
};

const handleSubmit = async () => {
    if (selectedType.value === 'Asesoría') {
        if (!subjectInput.value || !dateTime.value || !startTime.value || !endTime.value || !locationInput.value || !selectedFile.value) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor completa todos los campos antes de guardar.', life: 3000 });
            return;
        }

        try {
            const announcementData = {
                type: selectedType.value,
                subject: subjectInput.value,
                dateTime: dateTime.value,
                startTime: startTime.value,
                endTime: endTime.value,
                location: locationInput.value
            };

            await saveAnnouncement(announcementData, selectedFile.value);
            subjectInput.value = '';
            locationInput.value = '';
            titleInput.value = '';  
            descriptionInput.value = '';  
            startTime.value = null
            endTime.value = null
            dateTime.value = null 
            locationInput.value = ''
            selectedFile.value = null 
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Anuncio guardado con éxito', life: 3000 });
        } catch (error) {
            console.error('Error al guardar el anuncio:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar el anuncio. Intenta de nuevo.', life: 3000 });
        }
    } else if (selectedType.value === 'Otro') {
        if ( !titleInput.value || !descriptionInput.value || !selectedFile.value) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor completa todos los campos de título,  descripción e imagen.', life: 3000 });
            return;
        }

        try {
            const announcementData = {
                type: selectedType.value,
                title: titleInput.value,
                description: descriptionInput.value
            };

            await saveAnnouncement(announcementData, selectedFile.value);  
            subjectInput.value = '';
            locationInput.value = '';
            titleInput.value = '';  
            descriptionInput.value = '';  
            startTime.value = null
            endTime.value = null
            dateTime.value = null 
            locationInput.value = ''
            selectedFile.value = null 
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Anuncio guardado con éxito', life: 3000 });
        } catch (error) {
            console.error('Error al guardar el anuncio:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar el anuncio. Intenta de nuevo.', life: 3000 });
        }
    }
};

const displayPreviewDialog = ref(false);

// Función para abrir el diálogo
const openPreviewDialog = () => {
    displayPreviewDialog.value = true;
};

// Función para cerrar el diálogo
const closePreviewDialog = () => {
    displayPreviewDialog.value = false;
};

const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long' }).format(new Date(date));
};

const formatTime = (date, showMeridiem = false) => {
    if (!date) return '';
    
    const options = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true, // Para mostrar el formato de 12 horas siempre
    };

    const formattedTime = new Intl.DateTimeFormat('es-MX', options).format(new Date(date));

    // Solo muestra "a.m." o "p.m." si showMeridiem es true, de lo contrario elimina
    return showMeridiem ? formattedTime : formattedTime.replace(/(a\.m\.|p\.m\.)/g, '').trim();
};
</script>


<template>
  <div class="flex md:flex-row flex-column">
    <!-- Primera columna -->
    <div class="flex flex-column md:w-6">
      <h1 class="text-black text-2xl md:text-3xl font-bold mb-3 text-left">
        Gestión de Anuncios
      </h1>
      <span class="flex flex-column sm:flex-row justify-content-between items-center">
        <p class="text-black text-lg md:text-xl font-semibold text-left mt-3">
          Tipo de Asesoría
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
                  Fecha & Horas
              </p>
              <div class="p-inputgroup w-full">
                  <span class="p-inputgroup-addon">
                  <i class="pi pi-calendar"></i> 
                  </span>
                  <Button 
                  label=" Fecha y Horas" 
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
        <InputText v-model="titleInput" maxlength="30" placeholder="Ingresa el título" class="w-full" />
        <p class="text-gray-600 text-sm mt-1 ml-1">
          {{ titleInput.length }}/30 caracteres
        </p>

        <p class="text-black text-lg md:text-xl font-semibold text-left  m-1">
          Descripción
        </p>
        <InputText v-model="descriptionInput" maxlength="120" placeholder="Ingresa la descripción" class="w-full" />
        <p class="text-gray-600 text-sm mt-1 ml-1 ">
          {{ descriptionInput.length }}/120 caracteres
        </p>
      </div>

      <!-- Portada -->
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

      <!-- Botones Agregar y Ver previsualización -->
      <span class="flex flex-column md:flex-row justify-content-between mt-3">
        <Button label="Agregar" class="custom-button font-bold text-black w-full md:w-5 text-lg md:text-xl selected border-round-xl"  @click="handleSubmit" />
        <Button class="font-bold text-black-alpha-70 w-full md:w-6 text-lg md:text-xl border-none bg-transparent"
          @click="openPreviewDialog"         
        >
          <p class="text-black-alpha-70 m-auto"><i class="pi pi-eye mr-2 text-md"></i> Ver previsualización</p>
        </Button>
      </span>
    </div>
    <!-- Segunda columna -->
    <div class="second-column mt-2  flex flex-column md:w-6 md:ml-3">
  <div class="bg-white m-3 border-round-3xl h-8rem p-3">
    <div class="flex flex-row  justify-content-between">
      <p class="font-medium text-xl text-left mt-0 mb-1"> 
        Materia: Economía clásica
      </p>
      <i class="pi pi-info-circle mr-2 text-gray-500 text-2xl"></i> 
    </div>
    
    <p class="font-medium text-xl text-left mt-0 mb-1"> 
      Aulas 2
    </p>
    <Divider class="m-0 second-column"/>
    <div class="flex flex-row justify-content-between mb-2 mt-2">
      <div class="text-left text-xl ">
        3:00 - 5:00 p.m
      </div>
      <div class="text-left text-xl ">
        15 de diciembre
      </div>
    </div>
  </div>  
</div>

    <!-- Fin div -->
  </div>

  <!-- Diálogo para seleccionar la fecha y horas -->
<Dialog 
  v-model:visible="showDateDialog" 
  header="Seleccionar Fecha y Horas" 
  :modal="true" 
  :closable="true"  
  :dismissable-mask="true"
>
  <div>
    <!-- Selección de fecha -->
    <Calendar 
      v-model="dateTime" 
      placeholder="Seleccionar Fecha" 
      class="w-full mb-3" 
    />

    <!-- Selección de hora de inicio -->
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

    <!-- Selección de hora de fin -->
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

    <!-- Botones de acción -->
    <div class="mt-3 flex justify-content-end">
      <Button 
        label="Guardar" 
        class="p-button-success mr-2" 
        @click="saveDateTime" 
      />
      <Button 
        label="Cancelar" 
        class="p-button-secondary" 
        @click="() => showDateDialog = false" 
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
        <div class="flex   flex-wrap border-round-3xl text-white  h-16rem" :style="{ background: 'linear-gradient(to right, #779AC4, #29AB93)'}">
          <div class="relative w-full md:w-4 border-round-left-3xl">
            <span class="overlay">
              <Button
                label="Previsualización"
                class="text-xl border-none btn-left hidden block  border-round-top-left-3xl"
              />
              <img
                class="w-full h-16rem clip-diagonal border-round-top-3xl md:border-round-left-3xl arrow"
                :src="previewUrl || 'https://i.imgur.com/C6psSY1.png'"
              />
            </span>
          </div>
          <div class="w-full md:w-8 text-center p-4 flex gap-5">
            <div>
              <template v-if="selectedType === 'Asesoría'">
                <h2 class="text-white text-3xl font-bold" >
                  Asesorías Grupales
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
            <!-- Botón de cerrar el diálogo -->
             <span class="flex justify-content-center">
              <Button 
                label="Cerrar Previsualización" 
                class=" p-button-rounded mt-4 selected  border-round-left-3xl"
                @click="closePreviewDialog" 
            />
             </span>
           
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
  background: linear-gradient(to right, #779AC4, #29AB93);
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
</style>
