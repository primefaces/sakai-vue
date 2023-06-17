<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable prettier/prettier -->
<script setup>
import Card from 'primevue/card';
import {ref, onMounted} from 'vue';
import {useReportStore} from "@/stores";
import {useToast} from 'primevue/usetoast';
import moment from 'moment'


moment.locale('es-mx');
const store = useReportStore();
const toast = useToast();
// const rutaSeleccionada = ref(null);
const expandedRows = ref([]);

const rutaSeleccionada = ref();
const rangoDeReporte = ref();


onMounted(() => {
  fetchCatalogos()
  // rangoDeReporte.value(moment())
});
const fetchCatalogos = () => {
  store.setRepartidores();
}

const getReport = ()=>{
  console.log(rutaSeleccionada.value.ruta, rangoDeReporte.value)
  store.setOperaciones(rutaSeleccionada.value.ruta);
}
const onRowExpand = (event) => {
  toast.add({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
};
const onRowCollapse = (event) => {
  toast.add({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
};

const expandAll = () => {
  expandedRows.value = products.value.filter((p) => p.id);
};
const collapseAll = () => {
  expandedRows.value = null;
};
const formatCurrency = (value) => {
  return value?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || 0;
};
const getSeverity = (product) => {
  switch (product.inventoryStatus) {
    case 'INSTOCK':
      return 'success';

    case 'LOWSTOCK':
      return 'warning';

    case 'OUTOFSTOCK':
      return 'danger';

    default:
      return null;
  }
};
const getOrderSeverity = (order) => {
  switch (order.status) {
    case 'DELIVERED':
      return 'success';

    case 'CANCELLED':
      return 'danger';

    case 'PENDING':
      return 'warning';

    case 'RETURNED':
      return 'info';

    default:
      return null;
  }
};

</script>

<template>
  <div class="card">

    <div class="d-flex justify-content-between w-100 mb-4">
      <div class="flex-auto bg-light">
        <h5>Operaciones</h5>
      </div>

<!--      <div class="inline-flex  flex-row justify-content-end gap-2">-->
<!--        <span class="p-float-label">-->
<!--          <Calendar v-model="rangoDeReporte"  inputId="range"-->
<!--                  selectionMode="range"-->
<!--                  :manualInput="false"/>-->
<!--          <label for="range">Rango de fechas</label>-->
<!--        </span>-->

<!--        <div class="p-float-label">-->
<!--          <Dropdown v-model="rutaSeleccionada" inputId="ruta" :options="store.getRepartidores"-->
<!--                    optionLabel="ruta"-->
<!--                    placeholder="Selecciona una"/>-->
<!--          <label for="ruta">Ruta entrante</label>-->
<!--        </div>-->
<!--        <Button icon="pi pi-search" :disabled="!rutaSeleccionada" severity="primary" @click="getReport" aria-label="Search"/>-->
<!--      </div>-->
    </div>
    <div class="row">
      <div class="col-12">
        <DataTable :value="store.getOperaciones"  v-model:expandedRows="expandedRows" dataKey="id"
                   @rowExpand="onRowExpand" @rowCollapse="onRowCollapse" class="p-datatable-sm" tableStyle="min-width: 60rem">
          <template #header>
            <div class="flex flex-wrap justify-content-end gap-2">
              <div class="formgroup-inline align-items-baseline">
                <div class="field mb-0 mt-3">
                   <span class="p-float-label">
                    <Calendar hideOnRangeSelection :hide="(e)=>{
                      console.log(e)
                    }" inputId="rango"  v-model="rangoDeReporte"
                              selectionMode="range"  :manualInput="false"> </Calendar>
                    <label for="rango">Inicio - Fin</label>
                </span>
                </div>
                <div class="field mb-0 mt-3">
                     <span class="p-float-label">
                       <Dropdown v-model="rutaSeleccionada" inputId="ruta" :options="store.getRepartidores"
                                 optionLabel="ruta" class="w-full md:w-14rem"
                                 placeholder="Selecciona una"></Dropdown>
                    <label for="ruta">Dropdown</label>
                </span>
                </div>
                <Button  icon="pi pi-search" :loading="store.isLoading"  @click="getReport" :disabled="!rutaSeleccionada" label="Generar"></Button>
              </div>
            </div>
          </template>
          <Column expander style="width: 5rem" />
          <Column field="cobro" header="Cobro">
            <template #body="slotProps">
              {{ formatCurrency(slotProps.data.cobro) }}
            </template>
          </Column>
          <Column field="comision" header="Comision">
            <template #body="slotProps">
              {{ formatCurrency(slotProps.data.comosion) }}
            </template>
          </Column>
          <Column field="utilidad" header="Utilidad">
            <template #body="slotProps">
              {{ formatCurrency(slotProps.data.utilidad) }}
            </template>
          </Column>
          <Column field="date" header="Date">
            <template #body="slotProps">
              {{ moment(slotProps.data.date).format('LLLLL') }}
            </template>
          </Column>
          <Column field="descripcion" header="Category"></Column>
          <template #expansion="slotProps">
            <div class="p-0 bg-light">
              <DataTable class="p-datatable-sm" :value="slotProps.data.items">
                <Column field="description" header="Producto" sortable></Column>
                <Column field="sCj" header="Sal. Cj." sortable></Column>
                <Column field="sPz" header="Sal. Pz." sortable></Column>
                <Column field="sTotalPz" header="Sal. Total" sortable></Column>
                <Column field="rCj" header="Reg. Cj." sortable></Column>
                <Column field="rPz" header="Reg. Pz." sortable></Column>
                <Column field="rTotalPz" header="Reg. Total" sortable></Column>
                <Column field="ventaPz" header="Date" sortable></Column>
                <Column field="saldo" header="Amount" sortable>
                  <template #body="slotProps">
                    {{ formatCurrency(slotProps.data.saldo) }}
                  </template>
                </Column>

              </DataTable>
            </div>
          </template>
        </DataTable>

      </div>
    </div>
  </div>


  <!--  <div class="card">-->
  <!--    <template #title> Simple Card </template>-->
  <!--    <template #content>-->

  <!--    </template>-->
  <!--  </div>-->
</template>

<style scoped lang="scss">
::v-deep(.p-datatable-row-expansion > td){

  background: #fafafa;
}
</style>
