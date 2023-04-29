<!-- eslint-disable prettier/prettier -->
<!-- eslint-disable prettier/prettier -->
<script setup>
import { ref, onMounted } from 'vue';
// import CountryService from '@/service/CountryService';
import ProductService from '@/service/ProductService';

const countries = ref([]);
const cities = ref([
  { name: '1', code: '1' },
  { name: '5', code: '5' },
  { name: '11', code: '11' },
  { name: '12', code: '12' },
  { name: '21', code: '21' }
]);
const repartidores = ref([
  { name: 'Jose Juan', code: '1' },
  { name: 'Pepe', code: '2' },
  { name: 'Alberto', code: '3' },
  { name: 'Ramiro', code: '4' },
  { name: 'Corne', code: '5' }
]);
const products = ref();
const columns = ref([
  { field: 'code', header: 'Prod' },
  { field: 'salidaCj', header: 'Sal. Caj.' },
  { field: 'salidaPz', header: 'Sal. Pzs' },
  { field: 'salidaTotal', header: 'Sal. Total' },
  { field: 'regresoCj', header: 'Reg. Caj' },
  { field: 'regresoPz', header: 'Reg. Pzs' },
  { field: 'regresoTotal', header: 'Reg. Total' },
  { field: 'saldo', header: 'Saldo' },
]);
const filteredCountries = ref(null);
let detalleCobro = ref([
  {
    code: "[37] LECHE PAST. ENTERA GALON",
    salidaCj: 3,
    salidaPz: 1,
    salidaTotal: 13,
    regresoCj: 1,
    regresoPz: 2,
    regresoTotal: 6,
    ventaTotal: 7,
    saldo: 77


  }
])
const filteredCountries2 = ref(null);
// const value1 = ref(null);
const value2 = ref(null);
const value3 = ref(null);
const value4 = ref(0);
const value5 = ref(0);
const value6 = ref(0);
const value7 = ref(0);
const value8 = ref(null);
const value9 = ref(null);
const value10 = ref(0);
const value11 = ref(0);
// const value10 = ref(null);
// const dropdownItem = ref(null);

const productService = new ProductService();

onMounted(() => {
  productService.getProducts().then((data) => (products.value = data));
  // countryService.getCountries().then((data) => (countries.value = data));
  let productsList = [
    {
      "code": "37",
      "name": "LECHE PAST. ENTERA",
      "description": "LECHE PAST. ENTERA GALON",
      "content": 1,
      "content-um": "galon",
      "price": 60,
      "price-sale": 77,
      "category": "Leches",
      "box-quantity": 4,
      "quantity": 10000,
      "inventoryStatus": "INSTOCK",
      "rating": 5,
    },
    {
      "code": "6",
      "name": "LECHE PAST. ENTERA",
      "content": 1,
      "content-um": "Litro",
      "description": "LECHE PAST. ENTERA 1LT.",
      "price": 60,
      "price-sale": 77,
      "category": "Leches",
      "box-quantity": 4,
      "quantity": 10000,
      "inventoryStatus": "INSTOCK",
      "rating": 5,
    },
    {
      "code": "80",
      "name": "LECHE PAST. ENTERA",
      "description": "LECHE PAST. ENTERA 1/2GALON",
      "content": 0.5,
      "content-um": "galon",
      "price": 60,
      "price-sale": 77,
      "category": "Leches",
      "box-quantity": 4,
      "quantity": 10000,
      "inventoryStatus": "INSTOCK",
      "rating": 5,
    },
    {
      "code": "83",
      "name": "LECHE PAST. LIGTH",
      "description": "LECHE PAST. LIGTH 1/2GALON",
      "content": 0.5,
      "content-um": "galon",
      "price": 60,
      "price-sale": 77,
      "category": "Leches",
      "box-quantity": 4,
      "quantity": 10000,
      "inventoryStatus": "INSTOCK",
      "rating": 5,
    },

  ]
  countries.value = productsList;
  filteredCountries.value = productsList.slice(0, 2)
  filteredCountries2.value = productsList.slice(0, 2)
});

const changeRuta = (event) => {
  console.log(event.value.code);
  value9.value = { name: 'Pepe', code: '2' }
}
console.log('updateValue', event);
const updateValue = (event, code) => {
  if (!event) {
    if (code) {
      value3.value = null;
    } else {
      value2.value = null;
    }

  }
  else if (typeof event !== 'string') {
    console.log('\t', typeof event);
    console.log('\taaaaaaaaaaaa');
    if (code) {
      detalleCobro.value.push(
        {
          code: `[${value2.value.code}] ${value2.value.name}`,
          salidaCj: 3,
          salidaPz: 1,
          salidaTotal: 13,
          regresoCj: 1,
          regresoPz: 2,
          regresoTotal: 6,
          ventaTotal: 7,
          saldo: 77
        })
        value2 = ref

    } else {
      value2.value = value3.value;
    }
  }
}

const onCellEditComplete = (event) => {
  let { data, newValue, field } = event;

  switch (field) {
    case 'quantity':
    case 'code':
      if (newValue.trim().length > 0) data[field] = newValue;
      else event.preventDefault();
      break;

    default:
      if (isPositiveInteger(newValue)) data[field] = newValue;
      else event.preventDefault();
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
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}


const searchCountry = (event) => {
  //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
  const filtered = [];
  const query = event.query;
  for (let i = 0; i < countries.value.length; i++) {
    const country = countries.value[i];
    if (country.code.toLowerCase().indexOf(query.toLowerCase()) == 0) {
      filtered.push(country);
    }
  }
  filteredCountries.value = filtered;
};
const searchCountry2 = (event) => {
  //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
  const filtered = [];
  const query = event.query;
  for (let i = 0; i < countries.value.length; i++) {
    const country = countries.value[i];
    if (country.description.toLowerCase().indexOf(query.toLowerCase()) == 0) {
      filtered.push(country);
    }
  }
  filteredCountries2.value = filtered;
};
</script>

<template>
  <div class="card">
    <h5>Captura de venta</h5>
    <div class="grid p-fluid mt-3">
      <div class="field col-6 md:col-2" >
        <span class="p-float-label">
          <Dropdown style="height: 2.5em;" @change="changeRuta" id="ruta" :options="cities" v-model="value8" optionLabel="name">
          </Dropdown>
          <label for="ruta">Ruta</label>
        </span>
      </div>
      <div class="field col-12 md:col-4 pt-2">
        <p style="margin-top: 8px; color: grey;">
          {{ value9?.name ?  'repartidor: '+  value9?.name : 'Selecciona la ruta' }}

        </p>
      </div>
    </div>
    <!-- </div>
    <div class="card"> -->
    <h5>Captura de productos</h5>
    <!-- <span>Version preeliminar</span> -->
    <!-- <template> -->
    <!-- <div class="card p-fluid"> -->
    <DataTable :value="detalleCobro" editMode="cell" @cell-edit-complete="onCellEditComplete"
      tableClass="editable-cells-table" tableStyle="min-width: 50rem">
      <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header">
        <template #body="{ data, field }">
          {{
            field === "price" ? formatCurrency(data[field]) : data[field]
          }}
        </template>
        <template #editor="{ data, field }">
          <template v-if="field === 'code'">
            <InputText  readonly v-model="data[field]" autofocus />
          </template>
          <template v-else>
            <InputNumber class="sm-c" v-model="data[field]" :min="0" :max="100" />
          </template>
        </template>
      </Column>
    </DataTable>
    <div class="p-fluid formgrid grid ml-2">

      <div class="field col-12 md:col-3 p-0">
        <span class="p-float-label mt-4">
          <AutoComplete v-model="value2" class="no-margin" id="code" forceSelection :completeOnFocus="true"
            optionLabel="code" :dropdown="false" :clearable="true" dropdownClass="btn-dd" :suggestions="filteredCountries"
            @update:modelValue="updateValue($event, true)" @complete="searchCountry($event)">
            <template #option="slotProps">
              <div class="flex align-options-center justify-content-between item-autocomplete-opt">
                <div class="text-code">{{ slotProps.option.code }}</div>
                <div class="text-descpription">
                  {{ slotProps.option.description }}
                </div>
              </div>
            </template>
          </AutoComplete>
          <label for="code">Codigo</label>
        </span>
      </div>
    </div>
    <!-- </div> -->
    <!-- </template> -->
    <!-- 
    <div class="p-fluid formgrid grid">
      
      <div class="field col-12 md:col-1 p-0">
        <span class="p-float-label mt-4">
          <AutoComplete
            v-model="value2"
            class="no-margin"
            id="code"
            forceSelection
            :completeOnFocus="true"
            optionLabel="code"
            :dropdown="false"
            :clearable="true"
            dropdownClass="btn-dd"
            :suggestions="filteredCountries"
            @update:modelValue="updateValue($event, true)"
            @complete="searchCountry($event)"
          >
            <template #option="slotProps">
              <div
                class="flex align-options-center justify-content-between item-autocomplete-opt"
              >
                <div class="text-code">{{ slotProps.option.code }}</div>
                <div class="text-descpription">
                  {{ slotProps.option.description }}
                </div>
              </div>
            </template>
          </AutoComplete>
          <label for="code">Codigo</label>
        </span>
      </div>
      <div class="field col-12 md:col-2 p-0">
        <span class="p-float-label mt-4">
          <AutoComplete
            class="no-margin"
            id="product"
            forceSelection
            :completeOnFocus="true"
            optionLabel="description"
            :dropdown="true"
            :clearable="true"
            v-model="value3"
            :suggestions="filteredCountries2"
            @update:modelValue="updateValue($event, false)"
            @complete="searchCountry2($event)"
            field="description"
          ></AutoComplete>
          <label for="product">Producto</label>
        </span>
      </div>
      <div class="field col-12 md:col-1 p-0">
        <span class="p-float-label mt-4">
          <InputNumber id="cajas-s" :min="0" v-model="value4" />
          <label for="cajas-s">Cajas salida</label>
        </span>
      </div>
      <div class="field col-12 md:col-1 p-0">
        <span class="p-float-label mt-4">
          <InputNumber id="piesas-s" :min="0" v-model="value5" />
          <label for="piesas-s">Piesas salida</label>
        </span>
      </div>
      <div class="field col-12 md:col-1 p-0">
        <span class="p-float-label mt-4">
          <InputNumber id="salida" :min="0" v-model="value6" />
          <label for="salida">salida total</label>
        </span>
      </div>
      <div class="field col-12 md:col-1 p-0">
        <label for="city">PiesasS</label>
        <InputNumber
          class="no-margin"
          id="piesasS"
          v-model="value5"
          type="number"
        />
      </div>
      <div class="field col-12 md:col-1 p-0">
        <label for="city">Salida Pzs</label>
        <InputNumber
          readonly
          disabled
          class="no-margin"
          id="piesasS"
          v-model="value6"
          type="number"
        />
      </div>
      <div class="field col-12 md:col-1 p-0">
        <label for="lastname2">CajasR</label>
        <InputNumber
          class="no-margin"
          id="CajasS"
          v-model="value7"
          type="number"
        />
      </div>
      <div class="field col-12 md:col-1 p-0">
        <label for="city">PiesasR</label>
        <InputNumber
          class="no-margin"
          id="piesasS"
          v-model="value10"
          type="number"
        />
      </div>
      <div class="field col-12 md:col-1 p-0">
        <label for="city">Regreso Pzs</label>
        <InputNumber
          readonly
          disabled
          class="no-margin"
          id="piesasS"
          v-model="value11"
          type="number"
        />
      </div>
    </div> -->
  </div>
</template>

<style>
.w-100 {
  width: 100%;
}

.item-autocomplete-opt {
  width: 250px;
}

.text-code {
  font-weight: 600;
}

.text-descpription {
  font-size: small;
  opacity: 0.5;
}

.btn-dd {
  width: 2em;
}

.p-cell-editing {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

::v-deep(.editable-cells-table td.p-cell-editing) {
  padding-top: 0;
  padding-bottom: 0;
}
.sm-c > *{
  width: 5em!important;
  padding: 0.5rem 0.5rem!important;
}
</style>
