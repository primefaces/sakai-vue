<script setup>
import { ref, onMounted } from 'vue';
import { getSubjects } from '../firebase/db/subjects';
import { normalize } from '@/utils/HorarioUtils';

const selectedType = ref('Asesoría');
const subjects = ref([]);
const filteredSubjects = ref([]);
const subjectInput = ref('');
const fileInput = ref(null);


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
const dateTime = ref(null);
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



</script>


<template>
    <div class="flex md:flex-row flex-column">
        <!-- Primera columna -->
        <div class="flex flex-column md:w-6">
            <h1 class="text-black text-2xl md:text-3xl font-bold mb-5 text-left">
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
            <p class="text-black text-lg md:text-xl font-semibold text-left mt-3">
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
                class="mt-2 "
            />
            <span class="flex flex-column sm:flex-row items-center w-full">
                <span class="flex  flex-column w-6 md:mr-5"> 
                    <p class="text-black text-lg md:text-xl font-semibold text-left mt-3 ">
                        Fecha & hora
                    </p>
                    <Calendar 
                        v-model="dateTime" 
                        showTime 
                        hourFormat="24" 
                        placeholder="Fecha y hora" 
                        class="w-full" 
                        showIcon
                    /> 
                </span>
                <span class="flex  flex-column ">
                    <p class="text-black text-lg md:text-xl font-semibold text-left mt-3">
                        Ubicación
                        <i class="pi pi-map-marker mr-2" style="font-size: 1.5rem;"></i>
                    </p> 
                    <InputText 
                        v-model="locationInput" 
                        placeholder="Ingresa la ubicación" 
                        class="w-6 md:w-full" 
                    />
                </span>
                
            </span>
            <p class="text-black text-lg md:text-xl font-semibold text-left mt-3">
                Portada
            </p>
            <div>
                <!-- Área de arrastrar y soltar y seleccionar archivo -->
                <div
                class="border-2 border-dashed pt-1 border-round-xl cursor-pointer"
                @dragover.prevent
                @drop.prevent="handleDrop"
                @click="triggerFileInput"
                >
                <p  v-if="!selectedFile">
                    <span class="flex flex-row text-center justify-content-center">
                        Subir imagen de portada  <i class="pi pi-image text-3xl ml-2 "></i>
                    </span>
                </p>
                <p  v-else> 
                    <span class="flex flex-row text-center justify-content-center">
                        <i class="pi pi-image text-3xl mr-2"></i>
                        {{ selectedFile.name }}
                        <button @click="removeFile" class="mr-2 text-red-500">x</button>
                    </span>
                </p>
                <input 
                    type="file" 
                    ref="fileInput" 
                    @change="handleFileChange" 
                    accept=".jpg, .jpeg, .png" 
                    class="hidden" 
                />
                
                </div>
            </div>

            
        </div>
        
        
        <!-- Segunda columna -->
        <div class="flex flex-column w-6">
            <h2 class="text-black text-2xl font-semibold">
                Papa
            </h2>
        </div>
    </div>
</template>

<style scoped>
.custom-button {
    padding: 15px;
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
    box-shadow: none; /* Asegúrate de eliminar cualquier sombra al hacer foco */
}


</style>
