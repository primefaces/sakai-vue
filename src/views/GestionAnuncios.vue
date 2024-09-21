<script setup>
import { ref } from 'vue';

const selectedType = ref('Asesoría'); // Por defecto se selecciona "Asesoría"

const handleSelect = (type) => {
    selectedType.value = type;
};
</script>

<template>
    <div class="flex  md:flex-row flex-column">
        <!-- Primera columna -->
        <div class="flex flex-column md:w-6">
            <h1 class="text-black text-2xl md:text-4xl font-bold mb-5 text-left ">
                Gestión de Anuncios
            </h1>
            <span class="flex flex-column sm:flex-row justify-content-between items-center ">
                <p class="text-black text-lg md:text-xl font-semibold text-left mt-3">
                    Tipo de Asesoría
                </p>
                <div class="flex flex-row sm:justify-content-end bg-white	border-round-xl  shadow-3 w-16rem">
                    <!-- Primer botón "Asesoría" -->
                    <Button 
                        label="Asesoría" 
                        :class="[ 
                            'custom-button w-8rem text-lg md:text-xl', 
                            selectedType === 'Asesoría' ? 'selected border-round-xl' : 'bg-white text-black border-round-left-xl' 
                        ]"
                        @click="handleSelect('Asesoría')"
                    />
                    <!-- Segundo botón "Otro" -->
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
