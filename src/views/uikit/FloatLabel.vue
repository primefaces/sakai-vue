<!-- eslint-disable prettier/prettier -->
<!-- eslint-disable prettier/prettier -->
<script setup>
import {ref, onMounted, watch} from 'vue';
// import CountryService from '@/service/CountryService';
import ProductService from '@/service/ProductService';
// let products_ = require('../utilities/products.json');
import json from './../utilities/products.json'

const productsList = json;
const countries = ref([]);
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
    code: "",
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
const filteredCountries2 = ref(null);


const value8 = ref(null);
const value9 = ref(null);

const productService = new ProductService();

onMounted(() => {
  products.value = productsList;
  filteredProducts.value = productsList.slice(0, 2)
});

const changeRuta = (event) => {
  console.log(event.value.code);
  value9.value = {name: 'Pepe', code: '2'}
}


const onCellEditComplete = (event) => {
  let {data, newValue, field} = event;

  switch (field) {
    case 'code':
      console.log(data, newValue, field,)
      if (newValue.trim().length > 0)
        data[field] = newValue;
      else
        event.preventDefault();
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

  if (!str) {
    return false;
  }
  str = str.replace(/^0+/, '') || '0';
  var n = Math.floor(Number(str));

  return n !== Infinity && String(n) === str && n >= 0;
};
const productFormat = (value) => {
  return value ? `<b> [${value}] </b>` : ''
}


const searchCode = (event) => {
  console.log(event)
  setTimeout(() => {
    if (!event.query.trim().length) {
      filteredProducts.value = [...products.value];
    } else {
      filteredProducts.value = products.value.filter((p) => {
        console.log(p.code, p.descripcion)
        return p.code.toLowerCase().startsWith(event.query.toLowerCase()) ||
            p.descripcion.toLowerCase().startsWith(event.query.toLowerCase())
      });
    }
  }, 250);
  // filteredProducts.value = filtered;
};


watch(filteredProducts, (prev) => {
  console.log(prev);

})


</script>

<template>
  <div class="card">
    <h5>Captura de venta</h5>
    <div class="grid p-fluid mt-3 align-items-end">
      <div class="field col-6 md:col-4">
          <span class="p-float-label">
            <Dropdown class="p-inputtext-sm " @change="changeRuta" id="ruta" :options="rutas" v-model="value8"
                      optionLabel="name">
            </Dropdown>
            <label for="ruta">Ruta</label>
          </span>
      </div>
      <div class="field col-6 md:col-4 pt-2">
        <p style=" color: grey;">
          {{ value9?.name ? 'repartidor: ' + value9?.name : 'Selecciona la ruta' }}

        </p>
      </div>
    </div>

    <h5 class="mt-0">Captura de productos</h5>

    <DataTable :value="detalleCobro" showGridlines @cell-edit-complete="onCellEditComplete"
               tableClass="editable-cells-table" tableStyle="min-width: 20rem">
      <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header">
        <template #body="{ data, field }">
          <template v-if="field === 'code'">
            <AutoComplete v-model="data[field]" class="p-inputtext-sm" optionLabel="code"
                          :suggestions="filteredProducts" @complete="searchCode">
              <template #option="slotProps">
                <div class="flex align-items-baseline  align-options-center">
                  <b class="mr-2">{{ slotProps.option.code }}</b> <small>{{ slotProps.option.descripcion }}</small>

                </div>
              </template>
            </AutoComplete>
          </template>
          <template v-else-if="['venta', 'saldo'].includes(field)">

            <InputNumber type="decimal" class="p-inputnumber-sm w-5rem" v-model="data[field]" mode="currency"
                         :disabled="['salTotal', 'regTotal'].includes(field)" currency="USD" locale="en-US"/>
          </template>
          <template v-else>

            <InputNumber type="decimal" class="p-inputnumber-sm w-5rem" v-model="data[field]" :disabled="['salTotal', 'regTotal'].includes(field)"/>
          </template>
        </template>



        <template #editor="{ data, field }">
          <template v-if="field === 'code'">
            <AutoComplete v-model="data[field]" class="p-inputtext-sm" optionLabel="code"
                          :suggestions="filteredProducts" @complete="searchCode">
              <template #option="slotProps">
                <div class="flex align-items-baseline  align-options-center">
                  <b class="mr-2">{{ slotProps.option.code }}</b> <small>{{ slotProps.option.descripcion }}</small>

                </div>
              </template>
            </AutoComplete>
          </template>
          <template v-else-if="['venta', 'saldo'].includes(field)">

            <InputNumber type="decimal" class="p-inputnumber-sm w-5rem" v-model="data[field]" mode="currency"
                         :disabled="['salTotal', 'regTotal'].includes(field)" currency="USD" locale="en-US"/>
          </template>
          <template v-else>

            <InputNumber type="decimal" class="p-inputnumber-sm w-2rem" v-model="data[field]" :disabled="['salTotal', 'regTotal'].includes(field)"/>
          </template>
        </template>
      </Column>
    </DataTable>
  </div>
</template>


<style lang="scss" scoped>
::v-deep(.editable-cells-table td) {
  padding: 0.2rem 0.2rem !important;
}

::v-deep(.editable-cells-table td.p-cell-editing) {
  padding: 0.2rem 0.2rem !important;
}

::v-deep(.p-inputnumber),
::v-deep(.p-autocomplete) {
  display: table;
  margin: auto;
  width: max-content !important;
  /* flex-wrap: wrap; */
  /* justify-content: space-between; */
}
</style>
