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
const value9 = ref(null);

onMounted(() => {
  fetchCatalogos()
});
const fetchCatalogos = () => {
  store.setProducts('productos');
}

/**
 * @Params
 * hOLA WE
 * */
const showToast = (severity, summary, detail, life) => {
  toast.add({severity, summary, detail, life});
}


const changeRuta = (event) => {
  console.log(event.value.code);
  value9.value = {name: 'Pepe', code: '2'}
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

  if (typeof event.value === 'object') {

    const {originalEvent} = event;
    if (originalEvent) {
      const {code, type} = event.originalEvent;

      if (code === 'Enter' || type === 'click') {//  SE REQUIERE SETEAR LAS UNIDADES POR CAJA(uC), PRECIO LISTA
        const {key} = field;
        const {cant_caja, precio_lista, description} = event.value
        detalleCobro.value[key].uC = cant_caja;
        detalleCobro.value[key].pL = precio_lista;

        showToast('info', 'Código añadido', `Se añadió ${description} al renglón correctamente.`, 2000)
        console.log('----------add row', event, '\n', field, '\n', detalleCobro.value[key])
      }

    }
  }
};
const onChange = (data) => {
  console.log('onCgange', data);
  setValue(data)
};

const handleBlurInputNumber = (event, index, field) => {
  const {uC} = detalleCobro.value[index];
  console.log('handleBlurInputNumber->', event, index, field, detalleCobro.value[index])
  switch (field) {
    case 'salCj':
    case 'salPz':
      const {salCj, salPz} = detalleCobro.value[index];
      console.log(uC, salCj, salPz)
      detalleCobro.value[index].salTotal = (uC * salCj) + salPz;
      break
    case 'regCj':
    case 'regPz':
      const {regCj, regPz} = detalleCobro.value[index];
      const totalReg = (uC * regCj) + regPz;
      detalleCobro.value[index].regTotal = totalReg
      if (totalReg > 0) {
        if(!detalleCobro.value[index + 1])
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
        const {salTotal, regTotal, pL}  = detalleCobro.value[index];
        const venta   = salTotal - regTotal;
        const saldo = venta * pL;


        detalleCobro.value[index].venta = venta;
        detalleCobro.value[index].saldo = saldo;


      }
      console.log(uC, regCj, regPz)
      break
    default:
      console.log('default case')
  }
}

const searchCode = (event) => {
  setTimeout(() => {
    if (!event.query.trim().length) {
      filteredProducts.value = [];
    } else {
      filteredProducts.value = store.getProducts.filter(({code, description}) => {
        return code.toLowerCase().startsWith(event.query.toLowerCase()) ||
            description.toLowerCase().startsWith(event.query.toLowerCase())
      });
    }
  }, 10);
  // filteredProducts.value = filtered;
};


</script>

<template>
  <div class="card">
    <h5>Captura de venta</h5>
    <div class="grid p-fluid mt-3 align-items-end">
      <div class="field col-6 md:col-4">
          <span class="p-float-label">
            <Dropdown class="p-inputtext-sm " @change="changeRuta" id="ruta" :options="rutas"
                      optionLabel="name">
            </Dropdown>
            <label for="ruta">Ruta</label>
          </span>
      </div>
      <div class="field col-6 md:col-4 pt-2">
        <p style="color: grey;">
          {{ value9?.name ? 'repartidor: ' + value9?.name : 'Selecciona la ruta' }}
        </p>
      </div>
    </div>

    <h5 class="mt-0">Captura de productos</h5>
    <Toast/>

    <DataTable :value="detalleCobro" showGridlines class="p-datatable-sm" @cell-edit-complete="onCellEditComplete"
               tableClass="editable-cells-table">
      <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header">
        <template #body="{ data, field }">
          <template v-if="field === 'code'">
            <AutoComplete :id="`${field}-${data.key}`"
                          @complete="searchCode"
                          @change="selectOne($event, data)"
                          v-model="data[field]"
                          class="p-autocomplete-sm"
                          optionLabel="code"
                          :suggestions="filteredProducts" :delay="100"  selectionMessage="Mensaje de seleccion" emptySelectionMessage="No se encontró"
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
            <InputNumber :id="`${field}${data.key}`" readonly type="decimal" class="p-inputnumber-sm "
                         v-model="data[field]" mode="currency"
                         currency="USD" locale="en-US"/>
          </template>

          <!--SALIDAS-->
          <template v-else-if="['salCj', 'salPz'].includes(field)">
            <InputNumber type="decimal" @blur="handleBlurInputNumber($event,data.key, field)" class="p-inputnumber-sm"
                         :min="0"
                         v-model="data[field]"
                         :disabled="data['pL'] === 0"/>
          </template>

          <!--REGRESOS-->
          <template v-else-if="['regCj', 'regPz'].includes(field)">
            <InputNumber type="decimal" @blur="handleBlurInputNumber($event,data.key, field)" class="p-inputnumber-sm"
                         :min="0"
                         v-model="data[field]"
                         :disabled="data['salTotal'] === 0"/>

          </template>
          <!-- COLUMNA A MOSTRAR CUANDO INVOLUCRAMOS VENTA Y SALDO Ó DINERO PUES!! -->
          <template v-else>
            <InputNumber type="decimal" @blur="handleBlurInputNumber($event,data.key, field)" class="p-inputnumber-sm"
                         :min="0"
                         v-model="data[field]"
                         readonly
                         :disabled="data['pL'] === 0"
            />
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
  </div>
</template>


<style lang="scss" scoped>
::v-deep(.editable-cells-table td .p-autocomplete) {
  padding: 0.2rem 0.2rem !important;
  display: contents;

  .p-inputtext {

    width: 17em;
  }

}

::v-deep(.editable-cells-table td .p-inputnumber) {
  display: grid;
  padding: 0.2rem 0.2rem !important;
}

::v-deep(.editable-cells-table td ) {
  padding: 0.2rem 0.2rem !important;
}


</style>
