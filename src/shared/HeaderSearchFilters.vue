<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps(['title']);

const dropdownItems = ref([
  { name: 'Option 1', code: 'Option 1' },
  { name: 'Option 2', code: 'Option 2' },
  { name: 'Option 3', code: 'Option 3' }
]);

const itensButton = ref([
  {
    label: 'Exportar',
    icon: 'pi pi-file-export'
  },
  {
    label: 'Delete',
    icon: 'pi pi-times'
  },
  {
    separator: true
  },
  {
    label: 'Home',
    icon: 'pi pi-home'
  }
]);
const calendarValueFrom = ref(null);
const calendarValueTo = ref(null);

const dropdownItem = ref(null);
</script>

<template>
  <div class="col-12">
    <div class="card">
      <h5>{{ props.title }}</h5>
      <div class="p-fluid formgrid grid">
        <div class="field col-12 md:col-2">
          <label for="firstname2"> Fecha de solicitud Desde </label>
          <Calendar :showIcon="true" :showButtonBar="true" v-model="calendarValueFrom"></Calendar>
        </div>
        <div class="field col-12 md:col-2">
          <label for="firstname2">Fecha de solicitud Hasta </label>
          <Calendar :showIcon="true" :showButtonBar="true" v-model="calendarValueTo"></Calendar>
        </div>
        <div class="field col-12 md:col-2">
          <label for="state">Tipo de cuenta</label>
          <Dropdown id="state" v-model="dropdownItem" :options="dropdownItems" optionLabel="name" placeholder="Select One"></Dropdown>
        </div>

        <div class="field col-12 md:col-2">
          <label for="state">Estatus</label>
          <Dropdown id="state" v-model="dropdownItem" :options="dropdownItems" optionLabel="name" placeholder="Select One"></Dropdown>
        </div>

        <div class="field col-12 md:col-2">
          <label for="state">Acciones</label>
          <SplitButton label="Filtrar" icon="pi pi-check" :model="itensButton" class="p-button-info mr-2 mb-2"></SplitButton>
        </div>
      </div>
    </div>
  </div>
</template>
