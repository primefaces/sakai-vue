<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable prettier/prettier -->
<script setup>
import Card from 'primevue/card';
import {ref, onMounted} from 'vue';
import {useReportStore} from "@/stores";
import {useToast} from 'primevue/usetoast';
import moment from 'moment';
moment.locale('es-mx');


import XLSX from 'xlsx';
import {read, utils, writeFileXLSX} from 'xlsx';

const rows = ref([]);


// Descargar el archivo
const expandedRows = ref([]);
const dt = ref(null);
const maxDate = ref(new Date());
const rutaSeleccionada = ref();
// const rangoDeReporte = ref();
const rangoDeReporte = ref([
  moment().subtract(1, 'month').toDate(),
  moment().toDate()
]);

const store = useReportStore();
const toast = useToast();

onMounted(async () => {
  /* Download from https://sheetjs.com/pres.numbers */
  fetchCatalogos()

  const f = await fetch("https://sheetjs.com/pres.numbers");
  const ab = await f.arrayBuffer();

  /* parse workbook */
  const wb = read(ab);

  /* update data */
  rows.value = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
  console.log(moment().format('LLLL'))
});

const fetchCatalogos = () => {
  store.setRepartidores();
}

const getReport = () => {
  console.log(rutaSeleccionada.value.ruta, moment(rangoDeReporte.value[0]).format('YYYY-MM-DD'), moment(rangoDeReporte.value[1]).add(1, 'day').format('YYYY-MM-DD'))
  store.setOperaciones(rutaSeleccionada.value.ruta, moment(rangoDeReporte.value[0]).format('YYYY-MM-DD'), moment(rangoDeReporte.value[1]).add(1, 'day').format('YYYY-MM-DD'));
}
const onRowExpand = (event) => {
  console.log()
  toast.add({severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000});
  console.log(event)
};
const onRowCollapse = (event) => {
  toast.add({severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000});
};

const expandAll = () => {
  expandedRows.value = products.value.filter((p) => p.id);
};
const collapseAll = () => {
  expandedRows.value = null;
};
const formatCurrency = (value) => {
  return (value || 0).toLocaleString('en-MX', {style: 'currency', currency: 'MXN'});
};

function exportFile() {
  const ws = utils.json_to_sheet(rows.value);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, "Data");
  writeFileXLSX(wb, "SheetJSVueAoO.xlsx");
}

const exportCSV = () => {
  // Crear una hoja de cálculo
  const workbook = XLSX.utils.book_new();
  const sheetData =
      [
        [
          ['del', 'al'],
          ['fecha1', 'fecha2'],

        ],
        [
          ['Nombre', 'Edad'],
          ['Juan', 25],
          ['María', 30],
          ['Pedro', 35]
        ]
      ];
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');

// Generar el archivo de Excel
  const excelBuffer = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
  const blob = new Blob([excelBuffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  const fileName = 'reporte.xlsx';

  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
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
    </div>
    <div class="row">
      <div class="col-12">
        <DataTable
            :value="store.getOperaciones"
            v-model:expandedRows="expandedRows"
            dataKey="id"
            ref="dt"
            :tableProps="{ style: { minWidth: '650px' } }" style="overflow: auto"
            @rowExpand="onRowExpand"
            @rowCollapse="onRowCollapse"
            class="p-datatable-sm">
          <template #header>
            <div class="flex flex-wrap justify-content-end gap-2">
              <div class="formgroup-inline align-items-baseline">
                <div class="field mb-0 mt-3">
                   <span class="p-float-label">
                    <Calendar hideOnRangeSelection dateFormat="yy-mm-dd" :hide="(e)=>{
                      console.log('hide',e)
                    }" inputId="rango" v-model="rangoDeReporte"
                              selectionMode="range" :manualInput="false" :maxDate="maxDate"> </Calendar>
                    <label for="rango">Rengo de fechas</label>
                </span>
                </div>
                <div class="field mb-0 mt-3">
                     <span class="p-float-label">
                       <Dropdown v-model="rutaSeleccionada" inputId="ruta" :options="store.getRepartidores"
                                 optionLabel="ruta" class="w-full md:w-14rem"
                                 placeholder="Selecciona una"></Dropdown>
                    <label for="ruta">Ruta</label>
                </span>
                </div>
                <Button icon="pi pi-plus" :loading="store.isLoading" @click="getReport" :disabled="!rutaSeleccionada"
                        label="Generar"></Button>
              </div>
            </div>
          </template>
          <template #empty>
            <div class="text-gray-500 px-4 py-2">Genera tu reporte en el boton <b>+ Generar</b></div>
          </template>
          <template #loading> Cargando la información..</template>
          <Column expander style="width: 5rem"/>
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
                <Column field="description" header="Producto"></Column>
                <Column field="sCj" header="Sal. Cj."></Column>
                <Column field="sPz" header="Sal. Pz."></Column>
                <Column field="sTotalPz" header="Sal. Total"></Column>
                <Column field="rCj" header="Reg. Cj."></Column>
                <Column field="rPz" header="Reg. Pz."></Column>
                <Column field="rTotalPz" header="Reg. Total"></Column>
<!--                <Column field="ventaPz" header="Date"></Column>-->
                <Column field="saldo" header="Amount" sortable>
                  <template #body="slotProps">
                    {{ formatCurrency(slotProps.data.saldo) }}
                  </template>
                </Column>

              </DataTable>
            </div>
          </template>
          <template #footer>
            <template v-if="store.getOperaciones.length > 0">

              <p><span
                  class="font-300 text-400">Utilidad total: </span>{{
                  formatCurrency(store.getTotalOperacionesUtilidad)
                }}.
              </p>
              <p><span class="font-300 text-400">Cobro total: </span>
                {{ formatCurrency(store.getTotalOperacionesCobro) }}. </p>
              <p><span
                  class="font-300 text-400">Comision total:  </span>{{
                  formatCurrency(store.getTotalOperacionesComision)
                }}.
              </p>
              <Button label="Guardar" size="small" :loading="store.isLoading" @click="exportFile"
                      icon="pi pi-file-excel"/>

            </template>

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
::v-deep(.p-datatable-row-expansion > td) {

  background: #fafafa;
}

.font-400 {
  font-weight: 400;
}

.font-300 {
  font-weight: 300;
}
</style>
