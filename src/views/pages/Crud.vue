<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import {getCurrentColumns} from "./../../shared/control";
import { useCatalogosStore } from '@/stores'
const frmat =  txt => capitalize(txt).replaceAll('_', ' ')
import {capitalize, onBeforeMount, onMounted, onUpdated, watch} from 'vue';
import {defineProps} from 'vue';
import {useRoute} from 'vue-router';

const route = useRoute();
const store = useCatalogosStore()

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
  console.log('beforeMount')
  setCurrentP(props.indx)
});

onMounted(()=>{
  console.log('Mounted')
})

watch(
    () => props.indx,
    (val) => {
      console.log(val)
      setCurrentP( val )
    }
);
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5 >{{ currentP.title }}</h5>
        <DataTable
            :value="store.dataCatalog"
            :paginator="true"
            :rows="10"
            dataKey="id"
            :rowHover="true"
            :key="currentP.key"
            tableStyle="min-width: 50rem"
            :loading="store.isLoading">
          <template #empty> {{ currentP.title }} no tiene registros. </template>
          <template #loading> Cargando la información..</template>
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
