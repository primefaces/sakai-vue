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

const getDateInfo = (val, daysToAdd) => {
  return moment(val).add(daysToAdd, 'days').format('YYYY-MM-DD')
}

const getReport = () => {
  const {value} = rangoDeReporte;
  console.log(rutaSeleccionada.value?.ruta, getDateInfo(value[0], 0), getDateInfo(value[1], 1))
  store.setReport(getDateInfo(value[0], 0), getDateInfo(value[1], 1), rutaSeleccionada.value?.ruta)
      .then(data => {
        console.log('report ', data)
        if (!data) {
          toast.add({
            severity: 'info',
            summary: 'No se encontraron cobros',
            detail: 'No se han registrado cobros del repartidor en estas fechas',
            life: 5000,
            closable: true
          });
        }
      })
      .catch(er => {
        console.log(er)
      })
}
const formatCurrency = (value) => {
  return (Number(value) || 0).toLocaleString('en-MX', {style: 'currency', currency: 'MXN'});
};

const getDateF = (mode, date) => {
  return moment(date).format(mode);
}

const getNamePdf = (ruta) => {
  const _f = 'D-MMM-YY'
  return selectedCity.value.code === 'GEN' ?
      `General_${getDateF(_f, rangoDeReporte.value[0])}`
      :`ruta-${ruta}_${getDateF(_f, rangoDeReporte.value[0])}_${getDateF(_f, rangoDeReporte.value[0])}`
}

function exportFile() {
  console.log(store.getOperaciones)
  var generateData = function (data) {
    const _f = 'D-MMM-YY'
    var result = [];
    console.log(data)
    // let auxiliar = [...data]
    for (var i = 0; i < data.length; i += 1) {
      console.log(data[i])
      data[i].id = i
      for (const colK in data[i]) {
        // console.log(colK)

        data[i][colK] = data[i][colK].toString()
      }
      console.log(Object.assign({}, data[i]))

      result.push(Object.assign({}, data[i]));
    }
    console.log(data)

    console.log(result)
    return result;
  };

  function createHeaders(keys) {
    var result = [];
    console.log(keys)
    for (var i = 0; i < keys.length; i += 1) {
      let nt = ['code', 'nombres', 'ruta', 'zona', 'date', 'precio_compra', 'um', 'grupo', 'cant_caja']
      if (!nt.includes(keys[i]))
        result.push({
          id: keys[i],
          name: keys[i],
          prompt: keys[i],
          width: ['description'].includes(keys[i]) ? 90 : 30,
          align: "center",
          padding: 0
        });
    }

    return result;
  }

  let keys = Object.keys(store.getOperaciones[0])
  console.log(keys)
  var headers = createHeaders(keys)
  console.log('headers', headers)
  const doc = new jsPDF({
    orientation: "landscape",
    putOnlyUsedFonts: true
  });
  doc.setFontSize(22);
  doc.setFont("helvetica", "normal");
  
  doc.setDrawColor('#445262')
  doc.text(store.getOperaciones[0].nombres + ' R-' + store.getOperaciones[0].ruta, 10, 10);
  doc.setFontSize(10);
  doc.text(`Del: ${getDateF('L', rangoDeReporte.value[0])}`, 245, 10);
  doc.text(`Al: ${getDateF('L', rangoDeReporte.value[1])}`, 245, 15);
  doc.setFontSize(10);
  doc.text(`Fecha de reporte: ${getDateF('dddd Do', new Date())}`, 12, 20);
  doc.text(`Kilolitros: ${store.getTotalKlts.toFixed(4)}`, 20, 30);
  doc.text(`Comisiones: ${formatCurrency(store.getTotalOperacionesComision)}`, 20, 35);
  doc.text(`Utilidades: ${formatCurrency(store.getTotalOperacionesUtilidad)}`, 20, 40);
  doc.text(`cobro = ${formatCurrency(store.getTotalOperacionesCobro)}`, 20, 45);

  let oprations = store.getOperaciones;
  let infop = generateData(oprations)
  doc.setFontSize(10);
  doc.setFontSize(8);
  doc.table(12, 55, generateData(oprations), headers, {fontSize: 8, padding: 2, margins: 2});

  toast.add({
    severity: 'success',
    summary: 'Archivo creado',
    detail: getNamePdf(store.getOperaciones[0].nombres),
    life: 3000
  });
  setTimeout(() => {
    doc.save(getNamePdf(store.getOperaciones[0].nombres));
  }, 500)


}


const formatDate = (date) => {
  return moment(date).format('LLLL')
}

const selectedCity = ref( {name: 'Por ruta', code: 'RUT'});
const cities = ref([
  {name: 'General', code: 'GEN'},
  {name: 'Por ruta', code: 'RUT'}
]);
</script>

<template>
  <Toast/>

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
            dataKey="id"
            ref="dt"

            :tableProps="{ style: { minWidth: '650px' } }" style="overflow: auto"

            class="p-datatable">
          <template #header>
            <div class="flex flex-wrap justify-content-between gap-2">
              <div class="field mb-0 mt-3">
                   <span class="p-float-label">
                <Dropdown input-id="report" v-model="selectedCity" :options="cities" optionLabel="name"
                          placeholder="Selecciona el tipo de reporte" class="w-full md:w-14rem"/>
                     <label for="report">Tipo de reporte</label>
                </span>
              </div>

              <div class="formgroup-inline align-items-baseline">
                <div class="field mb-0 mt-3">
                   <span class="p-float-label">
                    <Calendar hideOnRangeSelection dateFormat="yy-mm-dd" :hide="(e)=>{
                 // console.log('hide',e)
                    }" inputId="rango" v-model="rangoDeReporte"
                              selectionMode="range" :manualInput="false" :maxDate="maxDate"> </Calendar>
                    <label for="rango">Rengo de fechas</label>
                </span>
                </div>
                <div class="field mb-0 mt-3" v-if="selectedCity.code === 'RUT'">
                     <span class="p-float-label">
                       <Dropdown v-model="rutaSeleccionada" inputId="ruta" :options="store.getRepartidores"
                                 optionLabel="ruta" class="w-full md:w-14rem"
                                 placeholder="Selecciona una"></Dropdown>
                    <label for="ruta">Ruta</label>
                </span>
                </div>
                <Button icon="pi pi-plus" :loading="store.isLoading" @click="getReport" :disabled="selectedCity.code === 'RUT' && !rutaSeleccionada"
                        label="Generar"></Button>
              </div>
            </div>
          </template>

          <template #empty>
            <div class="text-gray-500 px-4 py-2 my-4 text-center">Genera tu reporte en el boton <b>+ Generar</b></div>
          </template>
          <template #loading> Cargando la información..</template>
          <!--          <Column expander style="width: 5rem"/>-->
          <Column field="description" header="Producto">
            <template #body="slotProps">
              <b class="">

                {{ slotProps.data.description }}
              </b>
            </template>
          </Column>

          <Column field="sTotalPz" header="Salida Pz">
            <template #body="slotProps">
              <b>
                {{ slotProps.data.sTotalPz }}
              </b>
            </template>
          </Column>
          <Column field="rTotalPz" header="Regreso Pz">
            <template #body="slotProps">
              <b>
                {{ slotProps.data.rTotalPz }}
              </b>
            </template>
          </Column>
          <Column field="ventaPz" header="Venta Pz">
            <template #body="slotProps">
              <b>
                {{ slotProps.data.ventaPz }}
              </b>
            </template>
          </Column>
          <Column field="saldo" header="Saldo">
            <template #body="slotProps">
              {{ formatCurrency(slotProps.data.saldo) }}
            </template>
          </Column>

          <Column field="comision" header="Comision">
            <template #body="slotProps">
              {{ formatCurrency(slotProps.data.comision) }}
            </template>
          </Column>
          <Column field="klts" header="Kilolitros">
            <template #body="slotProps">
              {{ slotProps.data.klts }}
            </template>
          </Column>
          <Column field="utilidad" header="Utilidad">
            <template #body="slotProps">
              {{ formatCurrency(slotProps.data.utilidad) }}
            </template>
          </Column>
          <!--          <Column field="klts" header="k-Lts">-->
          <!--            <template #body="slotProps">-->
          <!--              <b class="text-primary"> {{ slotProps.data.klts }} </b>-->
          <!--            </template>-->
          <!--          </Column>-->

          <!--          <Column field="descripcion" header="Category"></Column>-->
          <!--          <template #expansion="slotProps">-->
          <!--            <div class="pl-8 bg-light">-->
          <!--              <DataTable class="p-datatable-sm" showGridlines scrollable scrollHeight="160px"-->
          <!--                         :value="slotProps.data.items">-->
          <!--                <Column field="description" header="Producto"></Column>-->
          <!--                <Column field="sCj" header="S.Cj."></Column>-->
          <!--                <Column field="sPz" header="S.Pz."></Column>-->
          <!--                <Column field="sTotalPz" header="S.Total"></Column>-->
          <!--                <Column field="rCj" header="R.Cj."></Column>-->
          <!--                <Column field="rPz" header="R.Pz."></Column>-->
          <!--                <Column field="rTotalPz" header="R.Total"></Column>-->
          <!--                <Column field="ventaPz" header="ventaPz"></Column>-->

          <!--                &lt;!&ndash;                <Column field="ventaPz" header="Date"></Column>&ndash;&gt;-->
          <!--                <Column field="saldo" header="importe" sortable>-->
          <!--                  <template #body="slotProps">-->
          <!--                    {{ formatCurrency(slotProps.data.saldo) }}-->
          <!--                  </template>-->
          <!--                </Column>-->
          <!--                <Column field="klts" header="k-Lts">-->
          <!--                  <template #body="slotProps">-->
          <!--                    <b class="text-primary"> {{ slotProps.data.klts }} </b>-->

          <!--                  </template>-->
          <!--                </Column>-->

          <!--              </DataTable>-->
          <!--            </div>-->
          <!--          </template>-->
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

<style lang="scss">
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

.p-button.p-button-sm .p-button-icon,
.p-button-icon {
  font-size: 1.2rem !important;
}
</style>
