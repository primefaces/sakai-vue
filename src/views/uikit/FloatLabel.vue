  <!-- eslint-disable prettier/prettier -->
  <!-- eslint-disable prettier/prettier -->
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  // import CountryService from '@/service/CountryService';
  import ProductService from '@/service/ProductService';
  // let products_ = require('../utilities/products.json');
  import json from './../utilities/products.json'
  const productsList = json;
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
      code: "",
      salidaCj: 0,
      salidaPz: 0,
      salidaTotal: 0,
      regresoCj: 0,
      regresoPz: 0,
      regresoTotal: 0,
      ventaTotal: 0,
      saldo: 0
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
    countries.value = productsList;
    filteredCountries.value = productsList.slice(0, 2)
    filteredCountries2.value = productsList.slice(0, 2)
  });

  const changeRuta = (event) => {
    console.log(event.value.code);
    value9.value = { name: 'Pepe', code: '2' }
  }


  const onCellEditComplete = (event) => {
    let { data, newValue, field } = event;

    switch (field) {
      case 'quantity':
      case 'code':
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

  const editingRows = ref([]);


  watch(filteredCountries,  (prev) => {
    console.log(prev);

  })


  </script>

  <template>
    <div class="card">
      <h5>Captura de venta</h5>
      <div class="grid p-fluid mt-3">
        <div class="field col-6 md:col-2">
          <span class="p-float-label">
            <Dropdown style="height: 2em;" @change="changeRuta" id="ruta" :options="cities" v-model="value8"
              optionLabel="name">
            </Dropdown>
            <label for="ruta">Ruta</label>
          </span>
        </div>
        <div class="field col-12 md:col-4 pt-2">
          <p style="margin-top: 8px; color: grey;">
            {{ value9?.name ? 'repartidor: ' + value9?.name : 'Selecciona la ruta' }}

          </p>
        </div>
      </div>
      <!-- </div>
      <div class="card"> -->
      <h5 class="mt-0">Captura de productos</h5>
      <!-- <span>Version preeliminar</span> -->
      <!-- <template> -->
      <!-- <div class="card p-fluid"> -->
      <DataTable :value="detalleCobro" class="p-datatable-sm" editMode="cell" @cell-edit-complete="onCellEditComplete"
        tableClass="editable-cells-table" tableStyle="min-width: 50rem" showGridlines >
        <Column v-for="col of columns" :key="col.field"  :field="col.field" :header="col.header">
          <template #body="{ data, field }" >
            <div v-if="field === 'code'">
              {{data[field]    ||  'Seleccionar'}}
            </div>
            <div v-else class="text-col">
              {{data[field]}}
            </div>
          </template>
          <template #editor="{ data, field }" >
            <div v-if="field === 'code'" style="width: 25%">
              <InputText placeholder="Codigo o Nombre" type="text" class="p-inputtext-sm" style="width: 100%;" v-model="data[field]" autofocus/>
            </div>
            <template v-else>
              <InputNumber class="p-inputtext-sm" v-model="data[field]" :min="0"  autofocus />
            </template>
          </template>
        </Column>
      </DataTable>
      <DataTable :value="products"  resizableColumns columnResizeMode="expand" showGridlines editMode="cell" @cell-edit-complete="onCellEditComplete" tableClass="editable-cells-table" tableStyle="min-width: 50rem">
        <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header">
          <template #body="{ data, field }">
            <template v-if="field === 'code'">
              <b>{{ data[field] }}</b>
            </template>
            <template v-else>
              <p>{{ field === 'price' ? formatCurrency(data[field]) : data[field] }}</p>

            </template>
          </template>
          <template #editor="{ data, field }">
            <template v-if="field === 'code'">
              <InputText type="text" class="p-inputtext-sm" v-model="data[field]" autofocus />
            </template>
            <template v-else>
              <InputNumber type="decimal" class="p-inputtext-sm w-5rem" v-model="data[field]" mode="currency"  currency="USD" locale="en-US" />
            </template>
          </template>
        </Column>
      </DataTable>
    </div>
  </template>


  <style lang="scss" scoped>
  ::v-deep(.editable-cells-table td.p-cell-editing) {
    padding-top: 0;
    padding-bottom: 0;
  }
  ::v-deep(.editable-cells-table td.p-cell-editing) {
    padding-top: 0;
    padding-bottom: 0;
  }
  ::v-deep(.p-inputnumber-input) {

    width: Inherit !important;
    flex: 0!important;
  }
  </style>
