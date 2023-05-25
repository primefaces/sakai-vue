<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import {getCurrentColumns} from "./../../shared/control";
import { useCatalogosStore } from '@/stores'
const store = useCatalogosStore()
console.log(store);
const frmat =  txt => capitalize(txt).replaceAll('_', ' ')
import {capitalize, onBeforeMount, watch} from 'vue';
import {defineProps} from 'vue';
import {useRoute} from 'vue-router';

const route = useRoute();

const currentP = {}
let columns = [
  { field: 'code', header: 'Code' },
  { field: 'name', header: 'Name' },
  { field: 'category', header: 'Category' },
  { field: 'quantity', header: 'Quantity' }
];
const setCurrentP = (param) => {
  currentP.key = param;
  currentP.title = frmat(param);
  const {routeApi, properties} = getCurrentColumns(currentP.title)[0]
  columns = properties;
  store.getAll(routeApi);
  console.log('setCurrentP-> ',currentP, columns)
}
const props = defineProps({
  indx: {type: String, default: 'ss'},
})

const formatCurrency = (value) => {
  return value.toLocaleString('es-US', {style: 'currency', currency: 'USD'});
}

onBeforeMount(() => {
  setCurrentP(props.indx)
});

watch(
    () => props.indx,
    (newVal) => {
      setCurrentP( newVal)
    }
);
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h1>{{ currentP.title }}</h1>
        <DataTable :value="store.dataCatalog" class='p-datatable-sm' :key="currentP.key" tableStyle="min-width: 50rem" :loading="store.isLoading">
          <template #empty> No customers found. </template>
          <template #loading> Loading customers data. Please wait. </template>
            <Column v-for="col of columns" sortable :key="col.field" :field="col.field" :header="col.header">
              <template v-if="'precio_lista' === col.field " #body="slotProps">
                {{ formatCurrency(slotProps.data.precio_lista) }}
              </template>
              <template v-if="'precio_compra' === col.field " #body="slotProps">
                {{ formatCurrency(slotProps.data.precio_compra) }}
              </template>
            </Column>
        </DataTable>

      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
