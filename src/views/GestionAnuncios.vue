<script setup>
import { ref, onMounted } from 'vue';
import { getSubjects } from '../firebase/db/subjects';
import { normalize } from '@/utils/HorarioUtils';


const selectedType = ref('Asesoría');
const subjects = ref([]);
const filteredSubjects = ref([]);
const subjectInput = ref('');
const fileInput = ref(null);
const showDateDialog = ref(false); // Controla el popup de la fecha y rango de horas

const handleSelect = (type) => {
    selectedType.value = type;
};

onMounted(async () => {
    subjects.value = await getSubjects();
    console.log(subjects.value, "Este es el objeto");
});

const filterSubjects = () => {
    const query = normalize(subjectInput.value);
    filteredSubjects.value = subjects.value.filter(subject =>
        normalize(subject.name).includes(query)
    );
};
const dateTime = ref(null);  // Variable para la fecha
const startTime = ref(null); // Variable para la hora de inicio
const endTime = ref(null);   // Variable para la hora de fin
const selectedFile = ref(null);

const validateFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/png'];
  return file && allowedTypes.includes(file.type);
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file && validateFile(file)) {
    selectedFile.value = file;
  } else {
    alert('Por favor, selecciona un archivo de imagen válido (JPEG o PNG).');
  }
};

const handleDrop = (event) => {
  const file = event.dataTransfer.files[0];
  if (file && validateFile(file)) {
    selectedFile.value = file;
  } else {
    alert('Por favor, selecciona un archivo de imagen válido (JPEG o PNG).');
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

// Guardar fecha, hora de inicio y fin
const saveDateTime = () => {
  const today = new Date(); // Obtener la fecha actual
  const selectedDate = new Date(dateTime.value); // Convertir la fecha seleccionada

  if (!dateTime.value || !startTime.value || !endTime.value) {
    alert('Por favor selecciona una fecha y un rango de horas.');
    return;
  }

  // Validar que la fecha seleccionada no sea antes del día actual
  if (selectedDate.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)) {
    alert('La fecha seleccionada no puede ser antes del día de hoy.');
    return;
  }

  // Validar que la hora de inicio sea menor que la hora de fin
  if (startTime.value >= endTime.value) {
    alert('La hora de inicio debe ser menor que la hora de fin.');
    return;
  }

  console.log(`Fecha: ${dateTime.value}, Hora de inicio: ${startTime.value}, Hora de fin: ${endTime.value}`);
  showDateDialog.value = false;
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
      
      <p class="text-black text-lg md:text-xl font-semibold text-left ">
        Materia
      </p>
      <AutoComplete 
        v-model="subjectInput" 
        :suggestions="filteredSubjects" 
        @complete="filterSubjects" 
        field="name" 
        dropdown 
        :forceSelection="false"
        placeholder="Buscar materia..." 
      />
      <span class="flex flex -column md:flex-row">
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
  <!-- Ubicación -->
  <p class="text-black text-lg md:text-xl font-semibold text-left mt-3">
    Ubicación
    <i class="pi pi-map-marker mr-2" style="font-size: 1.5rem;"></i>
  </p>
  <InputText v-model="locationInput" placeholder="Ingresa la ubicación" class="w-full" />
</span>

      </span>

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
        <Button label="Agregar" class="custom-button font-bold text-black w-full md:w-5 text-lg md:text-xl selected border-round-xl" />
        <Button class="font-bold text-black-alpha-70 w-full md:w-6 text-lg md:text-xl border-none bg-transparent">
          <p class="text-black-alpha-70 m-auto"><i class="pi pi-eye mr-2 text-md"></i> Ver previsualización</p>
        </Button>
      </span>
    </div>
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

</template>

<style scoped>
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
</style>
