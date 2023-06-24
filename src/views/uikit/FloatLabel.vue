<!-- eslint-disable prettier/prettier -->
<!-- eslint-disable prettier/prettier -->
<script setup>
import AutoComplete from 'primevue/autocomplete';
import {useToast} from 'primevue/usetoast';

const toast = useToast();
import {ref, onMounted, watch} from 'vue';
import ProductService from '@/service/ProductService';
import {useCaptuaraStore} from "@/stores";

const store = useCaptuaraStore();

const rutas = ref([
  {name: '1', code: '1'},
  {name: '5', code: '5'},
  {name: '11', code: '11'},
  {name: '12', code: '12'},
  {name: '21', code: '21'}
]);
const repartidores = ref([
  {name: 'Jose Juan', code: '1'},
  {name: 'Pepe', code: '2'},
  {name: 'Alberto', code: '3'},
  {name: 'Ramiro', code: '4'},
  {name: 'Corne', code: '5'}
]);
const products = ref([]);
const columns = ref([
  {field: 'code', header: 'Prod'},
  {field: 'salCj', header: 'Sal. Caj.'},
  {field: 'salPz', header: 'Sal. Pzs'},
  {field: 'salTotal', header: 'Sal. Total'},
  {field: 'regCj', header: 'Reg. Caj'},
  {field: 'regPz', header: 'Reg. Pzs'},
  {field: 'regTotal', header: 'Reg. Total'},
  {field: 'venta', header: 'Venta Total'},
  {field: 'saldo', header: 'Saldo venta'},
]);
const filteredProducts = ref([]);
let detalleCobro = ref([
  {
    key: 0,
    code: "",
    uC: 1,
    pL: 0,
    salCj: 0,
    salPz: 0,
    salTotal: 0,
    regCj: 0,
    regPz: 0,
    regTotal: 0,
    venta: 0,
    saldo: 0
  }
])
const rutaSeleccionada = ref(null);

onMounted(() => {
  fetchCatalogos()
});
const fetchCatalogos = () => {
  store.setProducts('productos');
  store.setRepartidores('repartidores');
}

/**
 * @Params
 * hOLA WE
 * */
const showToast = (severity, summary, detail, life) => {
  toast.add({severity, summary, detail, life});
}

const formatoMoneda = (valor) => {
  return Number(valor).toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN"
  });
};

const getTotalVenta = () => {
  return detalleCobro.value.map(({saldo}) => {
    return saldo
  }).reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0).toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN"
  });
}
const getPiezasSalida = () => {
  return detalleCobro.value.map(({salTotal}) => {
    return salTotal
  }).reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);
}
const getUtilidad = () => {

}
const getComisiones = () => {
  return Number(detalleCobro.value.map(({comision}) => {
    return comision
  }).reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0).toFixed(8));
}
const getVentas = () => {
  return Number(detalleCobro.value.map(({venta}) => {
    return venta
  }).reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0).toFixed(8));
}


const getPorcentajeVendido = () => {
  const serie = detalleCobro.value.map(({salTotal, venta}) => {
    return ((Number(venta) * 100) / Number(salTotal)) | 0
  }).filter(cob => cob > 0);
  return serie.length > 0 ? (serie.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0) / serie.length).toFixed(2) : 0
}
const changeRuta = (event) => {
  rutaSeleccionada.value = event.value
  console.log(event.value);
}


const onCellEditComplete = (event) => {
// const onCellEditComplete = (event) => {
  let {data, newValue, field} = event;
  console.log('onEditCel')

  switch (field) {
    case 'code':
      console.log(data, newValue, field,)
      if (newValue.trim().length > 0)
        data[field] = newValue;
      else

        break;
    default:
      if (isPositiveInteger(newValue))
        data[field] = newValue;
      else
        event.preventDefault();
      break;
  }
};
const isPositiveInteger = (val) => {
  let str = String(val);
  str = str.trim();
  if (!str)
    return false;
  str = str.replace(/^0+/, '') || '0';
  var n = Math.floor(Number(str));
  return n !== Infinity && String(n) === str && n >= 0;
};

const selectOne = (event, field) => {

  const {key} = field;
  if (typeof event.value === 'object') {

    const {originalEvent} = event;
    if (originalEvent) {
      console.log('selectOne', event, field, typeof event.value)
      const {code, type} = event.originalEvent;

      if (['Enter', 'Tab'].includes(code) || type === 'click') {//  SE REQUIERE SETEAR LAS UNIDADES POR CAJA(uC), PRECIO LISTA
        const {cant_caja, precio_lista, description, code} = event.value


        detalleCobro.value[key].uC = 0;
        detalleCobro.value[key].pL = 0;
        detalleCobro.value[key].salCj = 0;
        detalleCobro.value[key].salPz = 0;
        detalleCobro.value[key].salTotal = 0;
        detalleCobro.value[key].regCj = 0;
        detalleCobro.value[key].regPz = 0;
        detalleCobro.value[key].regTotal = 0;
        detalleCobro.value[key].venta = 0;
        detalleCobro.value[key].saldo = 0;
        detalleCobro.value[key].uC = cant_caja;
        detalleCobro.value[key].pL = precio_lista;
        filteredProducts.value = [...store.getProducts.slice(0, 5)]
        // store.quitProd(event.value);
        showToast('info', 'Código añadido', `Se añadió ${description} al renglón correctamente.`, 2000)
        // console.log('----------add row', event, '\n', field, '\n', detalleCobro.value[key])
      }
    }
  } else {
    detalleCobro.value[key].uC = 0;
    detalleCobro.value[key].pL = 0;
  }

};
const onChange = (data) => {
  console.log('onCgange', data);
  setValue(data)
};
const handleChangeNumber = (e) => {
  console.log('onCgange', e);
  // setValue(data)
};

const handleBlurInputNumber = (event, index, field) => {
  const {uC} = detalleCobro.value[index];
  switch (field) {
    case 'salCj':
      let {salPz} = detalleCobro.value[index];
      detalleCobro.value[index].salTotal = (uC * event) + salPz;
      break
    case 'salPz':
      const {salCj} = detalleCobro.value[index];
      detalleCobro.value[index].salTotal = (uC * salCj) + event;
      break

    case 'regCj':
      const {regPz} = detalleCobro.value[index];

      detalleCobro.value[index].regTotal = (uC * event) + regPz;
      break
    case 'regPz':
      const {regCj} = detalleCobro.value[index];
      detalleCobro.value[index].regTotal = (uC * regCj) + event;
      break
    default:
      console.log('default case')
  }
  if (detalleCobro.value[index].salTotal > 0) {
    if (!detalleCobro.value[index + 1])
      detalleCobro.value.push({
        key: index + 1,
        code: "",
        uC: 1,
        pL: 0,
        salCj: 0,
        salPz: 0,
        salTotal: 0,
        regCj: 0,
        regPz: 0,
        regTotal: 0,
        venta: 0,
        saldo: 0
      })
    const {salTotal, regTotal, pL} = detalleCobro.value[index];
    const venta = salTotal - regTotal;
    const saldo = venta * pL;

    detalleCobro.value[index].venta = venta;
    detalleCobro.value[index].saldo = saldo;
  }
}
const handleFocus = (e, inx) => {
  const {sourceCapabilities, relatedTarget} = e
  // console.log(e,value)
  let {code} = detalleCobro.value[inx]
  let noneValid = ['focus p-toast-icon-close p-link', 'focus p-inputtext p-component p-inputnumber-input'].includes(e.relatedTarget?.className)
  // console.log('\tfocus', noneValid)
  if (typeof code === "object" && sourceCapabilities && !noneValid) {
    store.addProd(code)
  }
}
const handleblur = (e, inx) => {
  let {code} = detalleCobro.value[inx]
  // console.log('\tblur',value,code)
  if (typeof code === "object") {
    store.quitProd(code)
  }
}
const searchCode = (event) => {
  const {query} = event
  if (!query.trim().length)
    filteredProducts.value = store.getProducts.slice(0, 5);
  else {
    console.log('---')
    filteredProducts.value = store.getProducts.filter(({code, description, nameCode}) => {
      // console.log(nameCode, query)
      return code.toLowerCase().startsWith(query?.toLowerCase()) ||
          description.toLowerCase().startsWith(query?.toLowerCase()) ||
          nameCode.toLowerCase().startsWith(query?.toLowerCase())
    });
  }
};
const onColReorder = () => {
  toast.add({severity: 'success', summary: 'Column Reordered', life: 3000});
};
const onRowReorder = (event) => {
  detalleCobro.value = event.value;
  toast.add({severity: 'success', summary: 'Rows Reordered', life: 3000});
};

const getPriceFormat = (cant) => Math.round(cant, 3);

const saveOperation = async () => {
  // console.log(rutaSeleccionada.value)
  const comision = detalleCobro.value.map(({code, venta}) => {
    console.log(code.comision, venta)
    return code ? code.comision * venta : 0
  }).reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0)

  const ventas = detalleCobro.value.map(({code, venta}) => {
    console.log(code.precio_lista, venta)
    return code ? code.precio_lista * venta : 0
  }).reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0)
  console.log('------------',)
  // let uitilidad = detalleCobro.value.map()
  const body = {
    repartidor: rutaSeleccionada.value.no_ruta,
    utilidad: getPriceFormat(ventas * .2),
    cobro: getPriceFormat(ventas),
    comision: getPriceFormat(comision),
    items: detalleCobro.value.filter(d => d.code).map(det => {
      return {
        code: det.code.code,
        sCj: det.salCj,
        sPz: det.salPz,
        sTotalPz: det.salTotal,
        rCj: det.regCj,
        rPz: det.regPz,
        rTotalPz: det.regTotal,
        ventaPz: det.venta,
        saldo: det.saldo,
      }
    })
  }
  console.log('body-> ',body)
  await store.saveOperation(body)
  showToast('info', 'Operación guardada!', `Se guardaron los datos correctamente".`, 8000)
  detalleCobro.value = [
    {
      key: 0,
      code: "",
      uC: 1,
      pL: 0,
      salCj: 0,
      salPz: 0,
      salTotal: 0,
      regCj: 0,
      regPz: 0,
      regTotal: 0,
      venta: 0,
      saldo: 0
    }
  ]
  rutaSeleccionada.value = undefined

}
const rowStyle = (data) => {
  if (data.salTotal === data.regTotal) {
    if (data.salTotal > 0)
      return {fontWeight: 'bold', fontStyle: 'italic', color: 'red'};

  }
};
const rowClass = (data) => {
  return [{'text-muted': data.code === '' && data.salTotal === 0 && data.regTotal === 0}];
};

</script>

<template>
  <div class="card py-4">

    <div class="grid p-fluid align-items-center">
      <div class="field col-6 md:col-8">
        <h5>Captura de venta</h5>
      </div>

      <div class="field text-right pb-2 col-6 md:col-2 p-2">
        <p style="color: grey;">
          {{ rutaSeleccionada?.no_ruta ? '' + rutaSeleccionada?.descripcion : 'Selecciona la ruta' }}
        </p>
      </div>
      <div class="field  col-6 md:col-2">
        <div class="p-float-label">
          <Dropdown class="p-inputtext-sm" :model-value="rutaSeleccionada" @change="changeRuta" id="ruta"
                    :options="store.getRepartidores"
                    optionLabel="no_ruta">
          </Dropdown>
          <label for="ruta">Ruta</label>
        </div>
      </div>
    </div>

    <Toast/>

    <DataTable :value="detalleCobro" :reorderableColumns="true" @columnReorder="onColReorder" @rowReorder="onRowReorder"
               showGridlines class="p-datatable-sm" scrollable scrollHeight="calc(100% - 500px)"
               @cell-edit-complete="onCellEditComplete" :rowStyle="rowStyle" :row-class="rowClass"
               tableClass="editable-cells-table">
      <Column rowReorder headerStyle="width: 1rem" :reorderableColumn="false"/>
      <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header">
        <template #body="{ data, field }">
          <template v-if="field === 'code'">
            <AutoComplete :id="`${field}-${data.key}`"
                          @complete="searchCode"
                          @change="selectOne($event, data)"
                          @focus="handleFocus($event, data.key)"
                          @blur="handleblur($event, data.key)"
                          v-model="data[field]"
                          class="p-autocomplete-sm"
                          autoOptionFocus
                          optionLabel="nameCode"
                          :suggestions="filteredProducts" :delay="50" selectionMessage="Mensaje de seleccion"
                          emptySelectionMessage="No se encontró"
                          searchMessage="search msj" aria-labelledby="codeSearch">
              <template #option="slotProps">
                <div class="flex align-items-baseline  align-options-center">
                  <b class="mr-2">{{ slotProps.option.code }}</b> <small class="text-mutted">
                  {{ slotProps.option.description }}</small>

                </div>
              </template>
            </AutoComplete>
          </template>


          <!-- COLUMNA A MOSTRAR CUANDO INVOLUCRAMOS VENTA Y SALDO Ó DINERO PUES!! -->
          <template v-else-if="['saldo'].includes(field)">
            <span>
              <div :id="`${field}${data.key}`" class="container-digits price slideDown ">
              {{ formatoMoneda(data[field]) }}

              </div>
            </span>
          </template>

          <!--SALIDAS-->
          <template v-else-if="['salCj', 'salPz'].includes(field)">
            <InputNumber type="decimal" @update:modelValue="handleBlurInputNumber($event,data.key, field)"
                         class="p-inputnumber-sm"
                         :min="0"
                         v-model="data[field]"
                         :disabled="data['pL'] === 0"/>
          </template>

          <!--REGRESOS-->
          <template v-else-if="['regCj', 'regPz'].includes(field)">
            <InputNumber type="decimal" @update:modelValue="handleBlurInputNumber($event,data.key, field)"
                         class="p-inputnumber-sm"
                         :min="0"
                         :max="field === 'regCj' ? data.salCj :data.salPz"
                         v-model="data[field]"
                         :disabled="data['salTotal'] === 0"/>

          </template>
          <!-- COLUMNA A MOSTRAR CUANDO INVOLUCRAMOS VENTA Y SALDO Ó DINERO PUES!! -->
          <template v-else>
            <div :id="`${field}${data.key}`" class="container-digits slideDown">
              {{ data[field] }} <small class="text-gray-400">pzas.</small>
            </div>
            <!--            <InputNumber type="decimal" @blur="handleBlurInputNumber($event,data.key, field)" class="p-inputnumber-sm"-->
            <!--                         :min="0"-->
            <!--                         v-model="data[field]"-->
            <!--                         readonly-->
            <!--                         :disabled="['salTotal', 'regTotal'].includes( field) ||  data['pL'] === 0"-->
            <!--            />-->
          </template>
        </template>

        <!--        <template #editor="{ data, field }">-->
        <!--          <template v-if="field === 'code'">-->
        <!--            <AutoComplete @complete="searchCode" v-model="data[field]"  class="p-autocomplete-sm" optionLabel="code"-->
        <!--                          :suggestions="filteredProducts" >-->
        <!--              <template #option="slotProps">-->
        <!--                <div class="flex align-items-baseline  align-options-center">-->
        <!--                  <b class="mr-2">{{ slotProps.option.code }}</b> <small>{{ slotProps.option.descripcion }}</small>-->

        <!--                </div>-->
        <!--              </template>-->
        <!--            </AutoComplete>-->
        <!--          </template>-->
        <!--          <template v-else-if="['venta', 'saldo'].includes(field)">-->

        <!--            <InputNumber type="decimal" class="p-inputnumber-sm " v-model="data[field]" mode="currency"-->
        <!--                         :disabled="['salTotal', 'regTotal'].includes(field)" currency="USD" locale="en-US"/>-->
        <!--          </template>-->
        <!--          <template v-else>-->

        <!--            <InputNumber type="decimal" class="p-inputnumber-sm " v-model="data[field]"-->
        <!--                         :disabled="['salTotal', 'regTotal'].includes(field)"/>-->
        <!--          </template>-->
        <!--        </template>-->
      </Column>
    </DataTable>
    <Divider/>


    <div class="grid justify-content-end align-content-center align-items-center px-4">
      <div class="field text-center pb-2 p-2">
        <p class="m-0 text-gray-600">Salidas</p>
        <p class="m-0 p-0 gap-1 inline-flex align-items-baseline">

          <h3 class="m-0 mt-1">{{ getPiezasSalida() }}</h3><small class="text-gray-500">Pzas</small>
        </p>
      </div>
      <Divider layout="vertical" class="m-3"/>
      <div class="field text-center pb-2 p-2">
        <p class="m-0 text-gray-600">Venta</p>
        <p class="m-0 p-0 gap-1 inline-flex align-items-baseline">

          <h3 class="m-0 mt-1">{{ getVentas() }} </h3> <small class="text-gray-500"> Pzas</small>
        </p>
      </div>
      <Divider layout="vertical" class="m-3"/>
      <div class="field text-center pb-2 p-2">
        <p class="m-0 text-gray-600">Carga vendida</p>
        <p class="m-0 p-0 gap-1 inline-flex align-items-baseline">
          <h3 class="m-0 mt-1">{{ getPorcentajeVendido() }}</h3><small class="text-gray-500">%</small>
        </p>
      </div>
      <Divider layout="vertical" class="m-3"/>
      <div class="field text-center py-2">

        <p class="m-0 text-gray-600">Total de venta</p>
        <h3 class="m-0 mt-1">{{ getTotalVenta() }}</h3>
      </div>
      <Divider layout="vertical" class="m-3"/>
      <Button type="button" label="Guardar" icon="pi pi-spin pi-cog" :loading="store.isLoading"
              :disabled="detalleCobro.length < 2 || !rutaSeleccionada" @click="saveOperation"/>
    </div>

  </div>
</template>


<style lang="scss" scoped>
::v-deep(.editable-cells-table td .p-autocomplete) {
  padding: 0.2rem 0.2rem !important;
  display: contents;

  .p-inputtext {
    //background: #0aa9f2;
    width: 100%;
  }
}

::v-deep(.editable-cells-table td .p-inputnumber) {
  display: grid;
  padding: 0.1rem 0.1rem !important;
}

::v-deep(.editable-cells-table td ) {
  padding: 0rem 0rem !important;
  //background:blanchedalmond;
  width: 7.5%;
  min-width: 5em;


}

::v-deep(.editable-cells-table td:first-of-type) {
  width: 3rem !important;
  min-width: 3em;
  text-align: center;
  cursor: move;
  transition: all .3s ease;
}

::v-deep(.editable-cells-table td:nth-of-type(2) ) {
  width: 40% !important;
}

::v-deep(.editable-cells-table td:first-of-type:hover ) {
  color: var(--highlight-text-color);
  background: var(--surface-50);
}

::v-deep(.p-datatable-scrollable > .p-datatable-wrapper ) {
  position: relative;
  border-bottom: 1px solid #e8e8e8;
}

::v-deep(.p-inputtext ) {
  margin: 0;
  width: 100%;
  max-width: 100%;
  padding: 0.3rem 0.75rem;

}

::v-deep(.p-datatable-table) {

  border-spacing: 0px;
  width: 100%;
  max-width: 100%;
}


.container-digits {
  margin: 0;
  width: 7.5%;
  min-width: 5em;
  max-width: 100%;
  //padding: 0rem 0.75rem;
  font-weight: 600;
  background: #f7fff7;
  padding: 5.2px 5px;
  width: auto;
}

.text-muted {
  color: var(--gray-100) !important;
}

</style>
