<script setup>
import { ref , computed} from 'vue';
const fecha = "Martes 14 de Noviembre de 2023"
const showMoreTags = ref(false);
const showMoreTags2 = ref(false);
const materias = [
  "tc2005b","tc2005b","papa","tc2005b","tc2005b","tc2005b",
  "tc2005b","tc2005b","tc2005b","tc2005b","tc2005b","tc2005b",
  "tc2005b","tc2005b","tc2005b","tc2005b","tc2005b","tc2005b",
  "tc2005b","tc2005b","tc2005b","tc2005b","tc2005b","tc2005b",
];

const searchQuery = ref('');
const horario = [
  ["11:00", "11:00", "11:00", "11:00", "11:00"],
  ["12:00", "12:00", "12:00", "12:00", "12:00"],

];
const filteredMaterias = computed(() => {
  return materias.filter(materia => materia.toLowerCase().includes(searchQuery.value.toLowerCase()));
});


const showDialog = ref(false);

const openDialog = () => {
  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
};

const showDialog2 = ref(false);

const openDialog2 = () => {
  showDialog2.value = true;
};

const closeDialog2 = () => {
  showDialog2.value = false;
};

</script>

<template>
  <div class="overflow-hidden font-lato px-4">

    <div class="flex relative mt-5">
      <div class="flex-1">
        <div class="text-0D294C text-6xl  ml-2.4%">Perfil</div>
      </div>

      <div class="justify-end">
        <i class="pi pi-bell text-6xl"></i>
      </div>
    </div>

    <hr class="width-5 border-t-2 border-D6D6D6 mb-2 ml-2.4%" />
    <div class="border-b-2 border-d6d6d6 w-full mb-5 ml-2.4%"></div>
    <p class="text-4xl">{{fecha}} </p>
    <div class="border-b-2 border-d6d6d6 w-full mb-5 ml-2.4%"></div>
    <div class="text-0D294C text-4xl  ml-2.4%">Materias</div>

    <div class="width-3 mb-2" style="margin-top: 20px;">
      <InputText v-model="searchQuery" placeholder="Buscar materia" class="p-mr-2 w-full" 
        style="font-size: 1.5rem; background-color: #c2c2c2; color: #000000;::placeholder { color: black; }" />
    </div>
    <div class="flex flex-wrap">
      <!-- Mostrar las primeras dos filas de etiquetas -->
      <div v-for="(materia, index) in filteredMaterias.slice(0, showMoreTags ? Infinity : 12)" :key="index"
        class="width-2 h-2 p-4">
        <Tag
          rounded
          class="w-full h-4rem text-lg font-semibold bg-0D294C text-white"
        >
          {{ materia }}
        </Tag>
      </div>

      <!-- Mostrar el botón "más/menos" si hay más etiquetas -->
      <div v-if="materias.length > 12" @click="showMoreTags = !showMoreTags" class="w-full p-2 cursor-pointer ">
        <div class="flex relative mt-3">
          <div class="flex-1"></div>
          <div class="justify-end">
            <Button
              :class="{'pi pi-plus-circle': !showMoreTags, 'pi pi-minus-circle': showMoreTags}" 
               size="large" class="ml-5 bg-0D294C"
              label="Etiquetas"
            />
          </div>
        </div>
      </div>
    </div>

    <hr class=" border-t-2 border-D6D6D6 " />
    <div class="text-0D294C text-4xl  ml-2.4%">Horario</div>

    <div class="p-grid">
      <!-- Días de la semana -->
      <div class="flex flex-wrap">
        <div v-for="(dia, index) in ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']" :key="index" class="p-row">
          <div class="text-0D294C text-4xl width-3 h-2 p-5 bg-F4F4F4">{{ dia }}</div>

          <!-- Horas -->
          <div v-for="(hora, rowIndex) in horario" :key="rowIndex" class="width-3 text-4xl p-5">
            <div
              :class="{
                'rounded bg-E2F4E4 text-black p-3 width-3': rowIndex % 2 !== 0,
                'rounded bg-16591D text-white p-3 width-3': rowIndex % 2 === 0
              }"
            >
              {{ hora[index] }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex relative mt-3">
      <div class="flex-1"></div>
      <div class="justify-end">
        <Button label="Modificar Materias" icon="pi pi-pencil" severity="info" size="large" class="ml-5 bg-0D294C" @click="openDialog2" />
        <Button label="Modificar Horario" icon="pi pi-pencil" severity="info" size="large" class="ml-5 bg-0D294C" @click="openDialog" />
      </div>
    </div>

  </div>

  <!-- Dialogos -->

  <Dialog v-model="showDialog" header="Horario" :visible="showDialog" 
    class="text-0D294C text-4xl ml-2.4%" style="width: 75%">

    <div class="flex flex-wrap">
      <div v-for="(dia, index) in ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']" :key="index" class="p-row">
        <!-- Horas -->
        <div v-for="(hora, rowIndex) in horario" :key="rowIndex" class="width-3 text-3xl p-5">
          <div
            :class="{
              'rounded bg-E2F4E4 text-black p-3 width-3': rowIndex % 2 !== 0,
              'rounded bg-16591D text-white p-3 width-3': rowIndex % 2 === 0
            }"
          >
            {{ hora[index] }}
          </div>
        </div>
      </div>
    </div>

    <div style="display: flex; flex-direction: column; align-items: flex-start;">
      <div v-for="(dia, index) in ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']" :key="index" class="p-row flex items-center">
        <div style="display: grid; grid-template-columns: repeat(4, 1fr);">

          <div class="width-3 text-3xl p-2 font-bold m-4">{{ dia }}</div>

          <input class="width-3 p-4 m-4 font-semibold bg-0D294C text-3xl rounded" placeholder="Hora de Inicio"/>

          <input style="display: flex; gap: 5px; align-items: center;" 
            class="width-3 p-4 m-4 font-semibold bg-0D294C text-3xl rounded"
          placeholder="Hora de Fin"/>

          <div class="w-1 text-3xl m-4">
            <i class="pi pi-plus" ></i>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-end mt-2">
      <div class="flex-1"></div>
      <div class="justify-end">
        <Button label="Listo" icon="pi pi-check" @click="closeDialog"
        severity="info" size="large" class="ml-5 bg-0D294C"/>
      </div>
    </div>
  </Dialog>

  <Dialog v-model="showDialog2" header="Materias" :visible="showDialog2" class="text-0D294C text-4xl ml-1.4%" 
  style="width: 75%">
    <div class="flex flex-col">
      <!-- Etiquetas de materias -->
      <div class="flex flex-wrap">
        <div v-for="(materia, index) in filteredMaterias.slice(0, showMoreTags2 ? Infinity : 8)" :key="index" class="w-3 h-3 p-4">
          <Tag
            rounded
            class="w-full h-4rem text-lg font-semibold bg-0D294C text-white"
          >
            {{ materia }}
          </Tag>
        </div>

        <!-- Mostrar más/ocultar etiquetas -->
        <div v-if="materias.length > 8" @click="showMoreTags2 = !showMoreTags2" class="w-12 p-2 cursor-pointer">
          <div class="flex relative mt-3">
            <div class="flex-1"></div>
            <div class="justify-end">
              <Button
                :class="{'pi pi-plus-circle': !showMoreTags2, 'pi pi-minus-circle': showMoreTags2}" 
                size="large" class="ml-5 bg-0D294C"
                label="Etiquetas"
              />
            </div>
          </div>
        </div>

        <!-- Barra de búsqueda de materias -->
        <InputText v-model="searchQuery" placeholder="Buscar materia" class="p-mr-2 w-11 mb-6 mt-6" 
          style="font-size: 1.5rem; background-color: #c2c2c2; color: #000000;::placeholder 
          { color: black; }" />

        <!-- Componente a la izquierda -->
        <div class="width-media">
          <p class="text-4xl">Modelación Matematica</p>
        </div>

        <!-- Componente al centro -->
        <div class="width-30">
          <Tag
            rounded
            class="h-4rem text-lg font-semibold bg-0D294C text-white"
          >
            Ejemplo
          </Tag>
        </div>

        <!-- Componente a la derecha -->
        <div class="width-20">
          <Button icon="pi pi-plus" class="p-button-rounded p-button-success ml-2" />
          <Button icon="pi pi-times" class="p-button-rounded p-button-danger" />
        </div>
      </div>
    </div>

    <!-- Botón "Listo" -->
    <div class="flex justify-end mt-2">
      <div class="flex-1"></div>
      <div class="justify-end">
        <Button label="Listo" icon="pi pi-check" @click="closeDialog2" severity="info" size="large" class="ml-5 bg-0D294C"/>
      </div>
    </div>
  </Dialog>

</template>

<style scoped>
  /* Estilo de colores */
  .text-0D294C {
    color: #0D294C;
    font-weight: bold;
  }

  .bg-FF69B4{
      background-color: #FF69B4
  }
  /* Estilo del botón */
  .bg-0D294C {
    background-color: #0D294C;
    color: #fff;
    border: 1px solid #0D294C;
    border-radius: 20px;
  }

  /* Línea gris */
  .border-D6D6D6 {
    border-color: #D6D6D6;
  }

  /* Establece el tamaño fijo de la línea horizontal */
  .width-5 {
    width: 41.6667%;
  }
  .width-2{
      width: 16.6667%;
  }


  .widthDialog-3{
      width: 25%;
  }


  @media (max-width: 768px) {
    .width-3 {
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    .width-2 {
      width: 25%; 
    }
  }
  @media (max-width: 768px) {
    .widthDialog-3 {
      width: 37.5%; 
    }
  }


  @media (max-width: 768px) {
    .width-5 {
      width: 55%; 
    }
  }

  /* Redondear las horas */
  .rounded {
    border-radius: 20px;
  }

  /* Estilo de colores */
  .bg-F4F4F4 {
    background-color: #d8d6d6;
  }

  .bg-E2F4E4 {
    background-color: #a5eba5;
    color: #000;
  }

  .bg-16591D {
    background-color: #16591D;
    color: #fff;
  }
  .width-media{
    width: 50%; 
  }
  .width-30{
    width: 30%; 
  }
  .width-20{
    width: 20%; 
  }
</style>
