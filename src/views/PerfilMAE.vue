<script setup>
import { ref, computed } from 'vue';
const showMoreTags = ref(false);
const showMoreTags2 = ref(false);
const materias = [
  "tc2005b", "tc2005b", "tc2005b", "tc2005b", "tc2005b",
  "tc2005b", "tc2005b", "tc2005b", "tc2005b", "tc2005b", "tc2005b",
  "tc2005b", "tc2005b", "tc2005b", "tc2005b", "tc2005b", "tc2005b",
  "tc2005b", "tc2005b", "tc2005b", "tc2005b", "tc2005b", "tc2005b",
];

const filteredMaterias = computed(() => {
  return materias.filter(materia => materia.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const searchQuery = ref('');
const horario = [
  ["11:00", "11:00", "11:00", "11:00", "11:00"],
  ["12:00", "12:00", "12:00", "12:00", "12:00"],
];

const showExtraTime = ref(false)

const showDialogHorarios = ref(false);
const showDialogMaterias = ref(false);

</script>

<template>
  <div class="flex relative">
    <div class="flex-1">
      <h1 class="text-black text-6xl font-bold mb-5">Perfil</h1>
    </div>
    <div class="justify-end hidden md:block">
      <!-- <i class="pi pi-bell text-4xl"></i> -->
    </div>
  </div>

  <div class="card mb-0">
    <div class="flex">
      <div class="flex flex-1">
        <img src="https://i.pinimg.com/originals/b1/44/f5/b144f535fb1878b7bdc57aedc14dfc24.jpg" alt="Foto de perfil" class="border-circle h-11rem w-11rem mr-5">
        <div>
          <p class="text-3xl font-bold">Luis Ángel Guzmán Iribe</p>
          <p class="text-lg font-medium"> <i class="pi pi-envelope font-medium"></i> a01741757@tec.mx </p>
          <p class="text-lg font-medium"> <i class="pi pi-book font-medium"></i> ITC </p>
          <p class="text-lg font-medium"> <i class="pi pi-building font-medium"></i> Campus MTY </p>
        </div>
      </div>
      <div class="justify-end space-x">
        <Button label="Materias" icon="pi pi-pencil" size="large"
          @click="showDialogMaterias = true" />
        <Button label="Horario" icon="pi pi-pencil" size="large"
          @click="showDialogHorarios = true" />
      </div>
    </div>
    <h2 class="font-bold"> Materias </h2>
    <div class="mb-2">
      <InputText v-model="searchQuery" placeholder="Buscar materia" class="p-mr-2 w-full" />
    </div>
    <div class="flex flex-wrap">
      <!-- Mostrar las primeras dos filas de etiquetas -->
        <Tag v-for="(materia, index) in filteredMaterias.slice(0, showMoreTags ? Infinity : 12)" :key="index" rounded class="text-lg font-semibold text-white mx-2 my-1 p-3 uppercase">
          {{ materia }}
        </Tag>
        <Button v-if="materias.length > 12" @click="showMoreTags = !showMoreTags" :label="showMoreTags ? 'Mostrar menos' : 'Mostrar más'" 
          severity="secondary" rounded class="text-lg font-semibold text-white mx-2 my-1" :icon="showMoreTags ? 'pi pi-chevron-left' : 'pi pi-chevron-right'" iconPos="right" />
    </div>

    <hr />
    <h2 class="font-bold"> Horario </h2>

    <div>
      <div class="grid">
        <div class="col">
            <div class="text-center p-3 border-round-sm bg-gray-200 text-xl font-bold mb-2">Lunes</div>
            <div class="text-center p-3 border-round-sm bg-green-500 text-white text-xl font-bold">11:00 - 13:00</div>
        </div>
        <div class="col">
            <div class="text-center p-3 border-round-sm bg-gray-200 text-xl font-bold mb-2">Martes</div>
            <div class="text-center p-3 border-round-sm bg-green-500 text-white text-xl font-bold ">11:00 - 13:00</div>
        </div>
        <div class="col">
            <div class="text-center p-3 border-round-sm bg-gray-200 text-xl font-bold">Miércoles <Button @click="showExtraTime = !showExtraTime" :icon="showExtraTime ? 'pi pi-chevron-up' : 'pi pi-chevron-down'" class="p-0 text-sm h-1rem w-1rem ml-2"  severity="secondary" text rounded/></div>
            <div class="text-center p-3 border-round-sm bg-green-500 text-white text-xl font-bold mt-2">11:00 - 13:00</div>
            <div v-if="showExtraTime" class="text-center p-3 border-round-sm bg-green-500 text-white text-xl font-bold mt-2">11:00 - 13:00</div>
        </div>
        <div class="col">
            <div class="text-center p-3 border-round-sm bg-gray-200 text-xl font-bold mb-2">Jueves</div>
            <div class="text-center p-3 border-round-sm bg-green-500 text-white text-xl font-bold ">11:00 - 13:00</div>
        </div>
        <div class="col">
            <div class="text-center p-3 border-round-sm bg-gray-200 text-xl font-bold mb-2">Viernes</div>
            <div class="text-center p-3 border-round-sm bg-green-500 text-white text-xl font-bold ">11:00 - 13:00</div>
        </div>
    </div>
    </div>

    <!-- Días de la semana -->
    <!-- <div class="p-grid">
      <div class="flex flex-wrap">
        <div v-for="(dia, index) in ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']" :key="index" class="p-row">
          <div class="text-0D294C text-4xl width-3 h-2 p-5 bg-F4F4F4">{{ dia }}</div>
          <div v-for="(hora, rowIndex) in horario" :key="rowIndex" class="width-3 text-4xl p-5">
            <div :class="{
              'rounded bg-E2F4E4 text-black p-3 width-3': rowIndex % 2 !== 0,
              'rounded bg-16591D text-white p-3 width-3': rowIndex % 2 === 0
            }">
              {{ hora[index] }}
            </div>
          </div>
        </div>
      </div>
    </div> -->

  </div>

  <!-- Dialogos -->

  <Dialog v-model:visible="showDialogHorarios" modal header="Horario" style="width: 75%">

    <div class="flex flex-wrap">
      <div v-for="(dia, index) in ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']" :key="index" class="p-row">
        <!-- Horas -->
        <div v-for="(hora, rowIndex) in horario" :key="rowIndex" class="width-3 text-3xl p-5">
          <div :class="{
            'border-round-md bg-E2F4E4 text-black p-3 width-3': rowIndex % 2 !== 0,
            'border-round-md bg-16591D text-white p-3 width-3': rowIndex % 2 === 0
          }">
            {{ hora[index] }}
          </div>
        </div>
      </div>
    </div>

    <div style="display: flex; flex-direction: column; align-items: flex-start;">
      <div v-for="(dia, index) in ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']" :key="index"
        class="p-row flex items-center">
        <div style="display: grid; grid-template-columns: repeat(4, 1fr);">

          <div class="width-3 text-3xl p-2 font-bold m-4">{{ dia }}</div>

          <input class="width-3 p-4 m-4 font-semibold bg-0D294C text-3xl rounded" placeholder="Hora de Inicio" />

          <input style="display: flex; gap: 5px; align-items: center;"
            class="width-3 p-4 m-4 font-semibold bg-0D294C text-3xl rounded" placeholder="Hora de Fin" />

          <div class="w-1 text-3xl m-4">
            <i class="pi pi-plus"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-end mt-2">
      <div class="flex-1"></div>
      <div class="justify-end">
        <Button label="Listo" icon="pi pi-check" @click="closeDialog" severity="info" size="large"
          class="ml-5 bg-0D294C" />
      </div>
    </div>
  </Dialog>

  <Dialog v-model:visible="showDialogMaterias" modal header="Materias" style="width: 75%">
    <div class="flex flex-col">
      <!-- Etiquetas de materias -->
      <div class="flex flex-wrap">
        <div v-for="(materia, index) in filteredMaterias.slice(0, showMoreTags2 ? Infinity : 8)" :key="index"
          class="w-3 h-3 p-4">
          <Tag rounded class="w-full h-4rem text-lg font-semibold bg-0D294C text-white">
            {{ materia }}
          </Tag>
        </div>

        <!-- Mostrar más/ocultar etiquetas -->
        <div v-if="materias.length > 8" @click="showMoreTags2 = !showMoreTags2" class="w-12 p-2 cursor-pointer">
          <div class="flex relative mt-3">
            <div class="flex-1"></div>
            <div class="justify-end">
              <Button :class="{ 'pi pi-plus-circle': !showMoreTags2, 'pi pi-minus-circle': showMoreTags2 }" size="large"
                class="ml-5 bg-0D294C" label="Etiquetas" />
            </div>
          </div>
        </div>

        <!-- Barra de búsqueda de materias -->
        <InputText v-model="searchQuery" placeholder="Buscar materia" class="p-mr-2 w-11 mb-6 mt-6" style="font-size: 1.5rem; background-color: #c2c2c2; color: #000000;::placeholder 
          { color: black; }" />

        <!-- Componente a la izquierda -->
        <div class="width-media">
          <p class="text-4xl">Modelación Matematica</p>
        </div>

        <!-- Componente al centro -->
        <div class="width-30">
          <Tag rounded class="h-4rem text-lg font-semibold bg-0D294C text-white">
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
        <Button label="Listo" icon="pi pi-check" @click="closeDialog2" severity="info" size="large"
          class="ml-5 bg-0D294C" />
      </div>
    </div>
  </Dialog>
</template>

<style scoped>

/* Horizontal spacing utility class */
.space-x > * {
  margin-right: 1rem;
}

/* Vertical spacing utility class */
.space-y > * {
  margin-bottom: 1rem; 
}


.bg-0D294C {
  background-color: #0D294C;
  color: #fff;
  border: 1px solid #0D294C;
  border-radius: 20px;
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
.width-media {
  width: 50%;
}

.width-30 {
  width: 30%;
}

.width-20 {
  width: 20%;
}
</style>
