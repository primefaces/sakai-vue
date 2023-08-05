<!-- eslint-disable prettier/prettier -->
<!-- eslint-disable prettier/prettier -->
<script setup>
moment.locale('es-mx');
import AutoComplete from 'primevue/autocomplete';
import {useToast} from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

const toast = useToast();
import {ref, onMounted, watch} from 'vue';
import ProductService from '@/service/ProductService';
import {useCaptuaraStore} from "@/stores";
import {useReportStore} from "@/stores";
import {markRaw, defineAsyncComponent} from 'vue';
import {useDialog} from 'primevue/usedialog';
import {useRouter} from 'vue-router';
const confirmPopup = useConfirm();

import Button from 'primevue/button';
// import {useConfirm} from "primevue/useconfirm";
// import moment from "moment";

const router = useRouter();
const ProductListDemo = defineAsyncComponent(() => import('./List.vue'));
const FooterDemo = defineAsyncComponent(() => import('./uikit/FooterDemo.vue'));

const dialog = useDialog();

const store = useCaptuaraStore();
const storeReport = useReportStore();
// const confirmPopup = useConfirm();

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
const operationEditing = ref({})
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
const selectedProduct = ref(null);
const op = ref(null);
const op2 = ref(null);


const rutaSeleccionada = ref(null);


onMounted(() => {

  fetchCatalogos()
});

const clearViewInfo = () => {
  operationEditing.value = {};
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
  fetchCatalogos()
  toast.add({severity: 'Ruta ingresada', detail: 'Se han limpíado todos los datos', life: 3000});

}
const showProducts = () => {
  const dialogRef = dialog.open(ProductListDemo, {
    props: {
      header: 'Capturas de hoy',
      style: {
        width: '40rem',
      },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
      modal: true
    },
    templates: {
      footer: markRaw(FooterDemo)
    },
    onClose: (options) => {
      const data = options.data;
      if (data) {
        console.log(data)
        const {id, items, no_ruta} = data;
        operationEditing.value = {...data};
        rutaSeleccionada.value = no_ruta
        detalleCobro.value = [];
        detalleCobro.value = [...items.map((i, indx) => {
          return {
            key: indx,
            id: i.id,
            code: store.products.find(p => p.code === i.code),
            uC: i.cant_caja,
            pL: i.precio_lista,
            salCj: i.sCj,
            salPz: i.sPz,
            salTotal: i.sTotalPz,
            regCj: i.rCj,
            regPz: i.rPz,
            regTotal: i.rTotalPz,
            venta: i.ventaPz,
            saldo: i.saldo
          }
        }), {
          key: items.length,
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
        }]
        const summary_and_detail = id ? {summary: 'Product Selected', detail: data.id} : {
          summary: 'No Product Selected',
          detail: `Pressed '${id}' button`
        }

        toast.add({severity: 'info', ...summary_and_detail, life: 3000});
      }
    }
  });

}

const fetchCatalogos = () => {
  store.setProducts('productos');
  store.setRepartidores('repartidores/aviables');
  storeReport.setOperacionesCount(moment().format('YYYY-MM-DD'), moment().add(1, 'day').format('YYYY-MM-DD'))
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
  clearViewInfo()
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
  console.log(event);
  if (typeof event.value === 'object') {
    const {originalEvent} = event;
    if (originalEvent) {
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
        store.quitProd(event.value);
        showToast('info', 'Código añadido', `Se añadió ${description} al renglón correctamente.`, 2000)
        console.log('----------add row', event, '\n', field, '\n', detalleCobro.value[key])
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
  console.log(code)
  let noneValid = ['focus p-toast-icon-close p-link', 'focus p-inputtext p-component p-inputnumber-input'].includes(e.relatedTarget?.className)
  // console.log('\tfocus', noneValid)
  if (typeof code === "object" && sourceCapabilities && !noneValid) {
    store.addProd(code)
  }
}
const handleblur = (e, inx) => {
  let {code} = detalleCobro.value[inx]
  console.log('\tblur',code)
  if (typeof code === "object") {
    store.quitProd(code)
  }
}
const searchCode = (event) => {
  const {query} = event
  if (!query.trim().length)
    filteredProducts.value = store.getProducts.slice(0, 5);
  else {
    filteredProducts.value = store.getProducts.filter(({code, description, nameCode}) => {
      return code.toLowerCase().startsWith(query?.toLowerCase()) ||
          description.toLowerCase().startsWith(query?.toLowerCase()) ||
          nameCode.toLowerCase().startsWith(query?.toLowerCase())
    });
  }
};
const onColReorder = () => {
  toast.add({severity: 'success', summary: 'Elemento reajustado', life: 3000});
};
const setInitialItems = ()=>{
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
}
const onRowReorder = (event) => {
  detalleCobro.value = event.value;
  toast.add({severity: 'success', summary: 'Elemento reajustado', life: 3000});
};
const getPriceFormat = (cant) => Math.round(cant, 3);

const saveOperation = async () => {
  // console.log(rutaSeleccionada.value)
  const comision = detalleCobro.value.map(({code, venta}) => {
    return code ? code.comision * venta : 0
  }).reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0)
  const ventas = detalleCobro.value.map(({code, venta}) => code ? code.precio_lista * venta : 0).reduce((a, b) => {
    return a + b
  }, 0)
  const costos = detalleCobro.value.map(({code, venta}) => code ? code.precio_compra * venta : 0).reduce((a, b) => {
    return a + b
  }, 0)


  console.log('------------ detalleCobro', detalleCobro.value)

  const body = {
    repartidor: rutaSeleccionada.value.no_ruta,
    utilidad: getPriceFormat(ventas - (costos + comision)),
    costos,
    cobro: getPriceFormat(ventas),
    comision: getPriceFormat(comision),
    date: moment().format("YYYY-MM-DD HH:mm:ss"),
    // date: moment().format(),
    items: detalleCobro.value.filter(d => d.code).map(det => {
      return {
        id: det.id,
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
  console.log('body-> ', body)
  await store.saveOperation(body)
  showToast('success', 'Operación guardada!', `Captura de la ruta ${rutaSeleccionada.value.no_ruta} guardada gorrectamente.`, 8000)
  fetchCatalogos()

  setInitialItems()
  rutaSeleccionada.value = undefined
  router.push('/');

}

const updateOperation = () => {
  const comision = detalleCobro.value.map(({code, venta}) => {
    return code ? code.comision * venta : 0
  }).reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0)
  const ventas = detalleCobro.value.map(({code, venta}) => code ? code.precio_lista * venta : 0).reduce((a, b) => {
    return a + b
  }, 0)
  const costos = detalleCobro.value.map(({code, venta}) => code ? code.precio_compra * venta : 0).reduce((a, b) => {
    return a + b
  }, 0)

  console.log({...operationEditing.value})
  let body = {
    ...operationEditing.value,
    utilidad: getPriceFormat(ventas - (costos + comision)),
    costos,
    cobro: getPriceFormat(ventas),
    comision: getPriceFormat(comision),
    items: detalleCobro.value.filter(d => d.code && d.salTotal && d.saldo).map(det => {
      return {
        id: det.id,
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
  console.log(body)
  store.updateOperation(body).then(dat => {
    showToast('success', 'Operación actualizada!', `Captura de la ruta ${body.no_ruta} se actualizó correctamente.`, 8000)
    fetchCatalogos()

    setInitialItems()
    rutaSeleccionada.value = undefined
    router.push('/');
  }).catch(er => {
    console.log('errr--', er)
  })
}

const confirmLeaveCurrentOp = (event) => {
  const total = detalleCobro.value.map(({saldo}) => {
    return saldo
  }).reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0)
  if (total > 0) {

    confirmPopup.require({
      target: event.target,
      message: 'Si continuas se eliminará tu data actual?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel:'Sí',
      rejectLabel:'No',
      accept: () => {
        showProducts()
      },
      reject: () => {
        console.log('rej')
      }
    });
  }else{
    showProducts()
  }

};
const rowStyle = (data) => {
  if (operationEditing.value.id) {

    if (data.id) {
      return {background: '#e0ebf4', fontWeight: 'bold'};
    } else {

      return {background: 'rgb(254 255 194)'};
    }
  } else {
    if (data.salTotal === data.regTotal) {
      if (data.salTotal > 0)
        return {fontWeight: 'bold', fontStyle: 'italic', color: 'red !important'};
    }
  }
};
const rowClass = (data) => {
  return [{'text-muted': data.code === '' && data.salTotal === 0 && data.regTotal === 0}];
};

const formatDate = (date) => {
  return moment(date).calendar()
}

</script>

<template>
  <div class="grid">
    <Toast/>

    <div class="col-12">
      <div class="card mb-0 px-3 py-3 ">
        <div class="p-fluid formgrid grid align-items-flex-end">

          <div class="field col-12 md:col-9 align-self-start">
            <h5>Captura de venta</h5>
          </div>
          <div class="field col-12 md:col-1">
            <label for="ruta">Ruta</label>
            <Dropdown class="" :model-value="rutaSeleccionada" @change="changeRuta" placeholder="Selecciona una ruta"
                      id="ruta"
                      :options="store.getRepartidores"
                      optionLabel="no_ruta">
            </Dropdown>
          </div>
          <div class="field col-12 md:col-2">
            <ConfirmPopup></ConfirmPopup>
            <Button label="Capturas de hoy" :disabled="storeReport.getOperacionesCount === 0" severity="info"
                     icon="pi pi-external-link" @click="confirmLeaveCurrentOp"/>
            <DynamicDialog/>
          </div>
        </div>

        <DataTable :value="detalleCobro"
                   showGridlines
                   :class="[operationEditing?.id ? 'editando': 'normal', 'p-datatable-sm table-operations']"
                   scrollable scrollHeight="calc(100% - 500px)"
                   @cell-edit-complete="onCellEditComplete" :rowStyle="rowStyle" :row-class="rowClass"
                   tableClass="editable-cells-table">
          <template #header>
            <div class="flex justify-content-between px-2 gap-2">
              <div v-if="operationEditing.id">
                <p class="m-0 p-text-secondary text-sm ">Repartidor: <span
                    class="text-primary text-xl"> {{
                    operationEditing.repartidor || 'No seleccionado'
                  }}</span>
                </p>
                <p class="m-0 p-text-secondary text-sm">Ruta: {{ operationEditing.no_ruta }}
                  ({{ operationEditing.descripcion }}), </p>
                <p class="m-0 text-primary-300 text-sm ">{{ formatDate(operationEditing.date) }}</p>
              </div>
              <div v-else>
                <p class="m-0 p-text-secondary text-sm ">Repartidor: <span
                    class="text-primary text-xl"> {{
                    rutaSeleccionada?.nombres || 'No seleccionado'
                  }}</span>
                </p>
                <p v-if="rutaSeleccionada" class="m-0 p-text-secondary text-sm ">Ruta:
                  {{ rutaSeleccionada?.no_ruta }} ( {{ rutaSeleccionada?.descripcion }}), </p>
                <p v-if="rutaSeleccionada" class="m-0 text-primary-300 text-sm">{{ formatDate() }}</p>
              </div>
              <div>
                <p :class="[operationEditing.id ? 'text-blue-700': 'text-primary', 'text-2xl']">
                  {{ operationEditing.id ? 'EDITANDO' : 'NUEVA' }}</p>
              </div>
            </div>
          </template>
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
                <span class="text-primary">{{ formatoMoneda(data[field]) }}</span>
              </div>
            </span>
              </template>

              <!--SALIDAS-->
              <template v-else-if="['salCj', 'salPz'].includes(field)">
                <InputNumber type="decimal" @update:modelValue="handleBlurInputNumber($event,data.key, field)"
                             class="p-inputnumber-sm"
                             :min="0"
                             v-model="data[field]"
                             :max="field === 'salPz' ? data.uC : null"

                             :disabled="data['pL'] === 0"/>
              </template>

              <!--REGRESOS-->
              <template v-else-if="['regCj', 'regPz'].includes(field)">
                <InputNumber type="decimal" @update:modelValue="handleBlurInputNumber($event,data.key, field)"
                             class="p-inputnumber-sm"
                             :min="0"
                             :max="field === 'regCj' ? data.salCj : (data.salCj === data.regCj ? data.salPz : data.uC) "
                             v-model="data[field]"
                             :disabled="data['salTotal'] === 0"/>

              </template>
              <!-- COLUMNA A MOSTRAR CUANDO INVOLUCRAMOS VENTA Y SALDO Ó DINERO PUES!! -->
              <template v-else>
                <div :id="`${field}${data.key}`" class="container-digits slideDown">
                  {{ data[field] }} <small class="p-text-secondary">pzas.</small>
                </div>
              </template>
            </template>
          </Column>
        </DataTable>
        <Divider/>


        <div class="grid justify-content-end align-content-center align-items-center px-4">
          <div class="field text-center pb-2 p-2">
            <p class="m-0 p-text-secondary">Salidas</p>
            <p class="m-0 p-0 gap-1 inline-flex align-items-baseline">

              <h3 class="m-0 mt-1">{{ getPiezasSalida() }}</h3><small class="p-text-secondary">Pzas</small>
            </p>
          </div>
          <Divider layout="vertical" class="m-3"/>
          <div class="field text-center pb-2 p-2">
            <p class="m-0 p-text-secondary">Venta</p>
            <p class="m-0 p-0 gap-1 inline-flex align-items-baseline">

              <h3 class="m-0 mt-1">{{ getVentas() }} </h3> <small class="p-text-secondary"> Pzas</small>
            </p>
          </div>
          <Divider layout="vertical" class="m-3"/>
          <div class="field text-center pb-2 p-2">
            <p class="m-0 p-text-secondary">Carga vendida</p>
            <p class="m-0 p-0 gap-1 inline-flex align-items-baseline">
              <h3 class="m-0 mt-1">{{ getPorcentajeVendido() }}</h3><small class="p-text-secondary">%</small>
            </p>
          </div>
          <Divider layout="vertical" class="m-3"/>
          <div class="field text-center py-2">

            <p class="m-0 p-text-secondary">Total de venta</p>
            <h3 class="m-0 mt-1">{{ getTotalVenta() }}</h3>
          </div>
          <Divider layout="vertical" class="m-3"/>
          <template v-if="operationEditing.id">
            <Button type="button" text severity="secondary" label="Cerrar" icon="pi pi-times" :loading="store.isLoading"
                    @click="clearViewInfo()"/>
            <Button type="button" label="Editar" icon="pi pi-file-edit" :loading="store.isLoading"
                    @click="updateOperation()"/>
          </template>
          <Button v-else type="button" label="Guardar" icon="pi pi-save" :loading="store.isLoading"
                  :disabled="detalleCobro.length < 2 || !rutaSeleccionada" @click="saveOperation"/>
        </div>

      </div>
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
  min-width: 6em;


}

::v-deep(.editable-cells-table td:first-of-type) {
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

::v-deep(.editando .p-datatable-header) {
  //background: #f0f0ff !important;
}

//::v-deep(.editando .p-datatable-tbody > tr ){
//    background: #e0ebf4!important;
//}

::v-deep(.table-operations .p-inputtext ) {
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


::v-deep(.p-autocomplete-panel .p-autocomplete-items .p-autocomplete-item .p-focus)
  {
   color: #574949;
   background: #FFCDD2 !important;
   font-weight: 700!important;
 
 
}


.container-digits {
  margin: 0;
  width: 7.5%;
  min-width: 5em;
  max-width: 100%;
  //padding: 0rem 0.75rem;
  font-weight: 600;
  padding: 5.2px 5px;
  width: auto;
}

.normal .container-digits {
  background: #fffff9;

}

.editando .container-digits {
  background: #fcfeff;
}

.text-muted {
  color: var(--gray-100);
}

.align-items-flex-end {
  align-items: flex-end;
}

.p-disabled, .p-component:disabled {
  opacity: 0.5;
}

.pi {
  font-size: 1.3rem!important;
}
</style>

