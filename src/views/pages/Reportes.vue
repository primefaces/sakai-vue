<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable prettier/prettier -->
<script setup>
import {ref, onMounted} from 'vue';
import {useReportStore} from "@/stores";
import {useToast} from 'primevue/usetoast';
import XLSX from 'xlsx';
import {read, utils, writeFileXLSX} from 'xlsx';
import {jsPDF} from "jspdf";

moment.locale('es-mx');

const rows = ref([]);
const expandedRows = ref([]);
const dt = ref(null);
const maxDate = ref(new Date());
const rutaSeleccionada = ref();
const rangoDeReporte = ref([
  moment().subtract(1, 'week').toDate(),
  moment().toDate()
]);

const store = useReportStore();
const toast = useToast();

onMounted(async () => {
  fetchCatalogos()
  const f = await fetch("https://sheetjs.com/pres.numbers");
  const ab = await f.arrayBuffer();
  /* parse workbook */
  const wb = read(ab);

  /* update data */
  rows.value = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
  console.log('TABLE-> ', moment().format('LLLL'))

});

const fetchCatalogos = () => {
  store.setRepartidores();
}

const getReport = () => {
  console.log(rutaSeleccionada.value.ruta, moment(rangoDeReporte.value[0]).format('YYYY-MM-DD'), moment(rangoDeReporte.value[1]).add(1, 'day').format('YYYY-MM-DD'))
  store.setOperaciones(moment(rangoDeReporte.value[0]).format('YYYY-MM-DD'), moment(rangoDeReporte.value[1]).add(1, 'day').format('YYYY-MM-DD'), rutaSeleccionada.value.ruta)
      .then(data => {
        console.log('ddddddd',data)
        if(!data){
          toast.add({severity: 'info', summary: 'No se encontraron cobros', detail: 'No se han registrado cobros del repartidor en estas fechas', life: 3000});

        }
      })
      .catch(er => {
    console.log(er)
  })
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

const getLts = (mlts) => {
  return mlts / 1000;
}

const getDateF = (mode, date = null) => {
  return moment(date).format(mode);
}

const getNamePdf = (ruta) => {
  const _f = 'D-MMM-YY'
  return `ruta-${ruta}_${getDateF(_f, rangoDeReporte.value[0])}_${getDateF(_f, rangoDeReporte.value[0])}`
}

function exportFile() {
  console.log(store.getOperaciones)
  var generateData = function (data) {
    const _f = 'D-MMM-YY'

    var result = [];

    for (var i = 0; i < data.length; i += 1) {
      // data[i].id = (i + 1).toString();/}}/
      for (const colK in data[i]) {
        console.log(data[i])
        if (colK === 'create_time') {
          data[i][colK] = getDateF(_f, rangoDeReporte.value[0])
        } else if (['sCj', 'sPz', 'salTotalPz', 'rCj', 'rPz', 'regTotalPz', 'ventaPz'].includes(colK)) {
          data[i][colK] = data[i][colK].toString() + colK.split('').splice(colK.length - 2, 2).join('')
        } else if (['saldo', 'comision'].includes(colK)) {
          data[i][colK] = formatCurrency(data[i][colK]).toString()

        } else
          data[i][colK] = data[i][colK].toString()

      }
      result.push(Object.assign({}, data[i]));
    }
    console.log(result)
    return result;
  };

  function createHeaders(keys) {
    var result = [];
    console.log(keys)
    for (var i = 0; i < keys.length; i += 1) {
      let nt = ['code', 'precio_compra', 'description']
      if (!nt.includes(keys[i]))
        result.push({
          id: keys[i],
          name: keys[i],
          prompt: keys[i],
          width: 80,
          align: "center",
          padding: 0
        });
    }

    return result;
  }

  let keys = Object.keys(store.getOperaciones[0].items[0])
  console.log(keys)
  var headers = createHeaders(keys)
  console.log(headers)
  const doc = new jsPDF({
    orientation: "landscape",
    putOnlyUsedFonts: true
  });
  doc.setFontSize(22);
  doc.text(store.getOperaciones[0].repartidor + ' R-' + store.getOperaciones[0].no_ruta, 10, 10);
  doc.setFontSize(10);
  doc.text(`Del: ${getDateF('L', rangoDeReporte.value[0])}`, 200, 10);
  doc.text(`Al: ${getDateF('L', rangoDeReporte.value[1])}`, 200, 15);
  doc.setFontSize(10);
  doc.text(`Kilolitros: ${store.getTotalKlts.toFixed(4)}`, 20, 20);
  doc.text(`Comisiones: ${formatCurrency(store.getTotalOperacionesComision)}`, 20, 25);

  doc.setFontSize(12);
  store.getOperaciones.forEach(op => {

    doc.text(`Comisiones: ${getDateF('dddd Do', op.date)}`, 5, 40);
    doc.setFontSize(10);
    doc.table(5, 45, generateData([...op.items]), headers, {fontSize: 8, autoSize: true, padding: 2, margins: 2});
  })
  doc.save(getNamePdf(store.getOperaciones[0].repartidor));
}


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

const formatDate = (date) => {
  return moment(date).format('LLLL')
}
</script>

<template>
  <div class="card">
    <div class="d-flex justify-content-between w-100 mb-4">
      <div class="flex-auto bg-light">
        <h5>Reportes</h5>
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
            class="p-datatable">
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
          <Column field="date" header="Date">
            <template #body="slotProps">
              <b class="">

                {{ formatDate(slotProps.data.date) }}
              </b>
            </template>
          </Column>

          <Column field="cobro" header="Cobro">
            <template #body="slotProps">
              {{ formatCurrency(slotProps.data.cobro) }}
            </template>
          </Column>
          <Column field="comision" header="Comision">
            <template #body="slotProps">
              {{ formatCurrency(slotProps.data.comision) }}
            </template>
          </Column>
          <Column field="utilidad" header="Utilidad">
            <template #body="slotProps">
              {{ formatCurrency(slotProps.data.utilidad) }}
            </template>
          </Column>
          <Column field="klts" header="k-Lts">
            <template #body="slotProps">
              <b class="text-primary"> {{ slotProps.data.klts }} </b>
            </template>
          </Column>

          <!--          <Column field="descripcion" header="Category"></Column>-->
          <template #expansion="slotProps">
            <div class="pl-8 bg-light">
              <DataTable class="p-datatable-sm" showGridlines scrollable scrollHeight="160px"
                         :value="slotProps.data.items">
                <Column field="description" header="Producto"></Column>
                <Column field="sCj" header="S.Cj."></Column>
                <Column field="sPz" header="S.Pz."></Column>
                <Column field="sTotalPz" header="S.Total"></Column>
                <Column field="rCj" header="R.Cj."></Column>
                <Column field="rPz" header="R.Pz."></Column>
                <Column field="rTotalPz" header="R.Total"></Column>
                <Column field="ventaPz" header="ventaPz"></Column>

                <!--                <Column field="ventaPz" header="Date"></Column>-->
                <Column field="saldo" header="importe" sortable>
                  <template #body="slotProps">
                    {{ formatCurrency(slotProps.data.saldo) }}
                  </template>
                </Column>
                <Column field="klts" header="k-Lts">
                  <template #body="slotProps">
                    <b class="text-primary"> {{ slotProps.data.klts }} </b>

                  </template>
                </Column>

              </DataTable>
            </div>
          </template>
          <template #footer>
            <template v-if="store.getOperaciones.length > 0">
              <div class="footer-cont">
                <div class="d-flex">
                  <div>
                    <p class="m-0"><span class="font-500 text-400">Cobro total: </span>
                      {{ formatCurrency(store.getTotalOperacionesCobro) }}. </p>
                    <p class="m-0"><span
                        class="font-500 text-400">Comision total:  </span>{{
                        formatCurrency(store.getTotalOperacionesComision)
                      }}.
                    </p>
                  </div>
                  <div>
                    <p class="m-0"><span
                        class="font-500 text-400">Utilidad total: </span>{{
                        formatCurrency(store.getTotalOperacionesUtilidad)
                      }}.
                    </p>
                    <p class="m-0"><span
                        class="font-500 text-400">Total Kilo-Litros: </span>
                      <b class="text-primary">
                        {{
                          store.getTotalKlts
                        }}.
                      </b>
                    </p>
                  </div>
                </div>
                <Button label="Guardar" size="small" class="mt-2" :loading="store.isLoading" @click="exportFile"
                        icon="pi pi-file-excel"/>
              </div>
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
  background: #ffffff;
  padding: 4px 5px 0px 54px;

  .p-datatable .p-column-header-content {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .p-datatable-row-expansion > td .p-datatable .p-column-header-content * {
    display: flex;
    align-items: center !important;
  }

  .p-datatable .p-column-header-content * {
    display: flex;
    align-items: center !important;
  }

  .p-datatable.p-datatable-sm .p-datatable-thead > tr > th {
    padding: 2px 0;
    text-align: center !important;
  }

  .p-datatable.p-datatable-sm .p-datatable-tbody > tr > td {
    padding: 1px 0;
    text-align: center;
  }
}

.font-400 {
  font-weight: 400;
}

.font-500 {
  font-weight: 500;
}

.text-end {
  text-align: end;
}

.footer-cont {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: inherit;
  padding: 0.5em 1em;
}

.p-datatable .p-datatable-footer {
  padding: 2px 8px;
  font-weight: 600;
}

.p-datatable .p-datatable-thead > tr > th {
  text-align: center;
  font-weight: 700;
  color: #574949;
  background: #fbfbfb;
}

.p-datatable .p-datatable-tbody > tr > td {
  padding: 1px 5px;
}

.p-datatable .p-datatable-tbody > tr > td {
  text-align: left;
  padding: 1px 4px;
}
</style>
