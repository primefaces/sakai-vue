<!-- eslint-disable prettier/prettier -->
<!-- eslint-disable prettier/prettier -->
<script setup>
import AutoComplete from 'primevue/autocomplete';
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
    index: 0,
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
],
[
  {
    index: 0,
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
],)

const value8 = ref(null);
const value9 = ref(null);

const productService = new ProductService();

onMounted(() => {
   fetchCatalogos()
});
const fetchCatalogos = () => {

  // Obtener todos los catálogos
  store.setProducts('productos');

  // Acceder a los datos del catálogo
  // products.value = ;

  // Realizar otras operaciones con los datos
  // console.log(products.value);
}

// const deleteCatalogo = async () => {
//   // const store = useCaptuaraStore();
//
//   // Eliminar un catálogo por su ID
//   await store.delete('frgm', id);
// }

const changeRuta = (event) => {
  console.log(event.value.code);
  value9.value = {name: 'Pepe', code: '2'}
}


const onCellEditComplete = (event) => {
// const onCellEditComplete = (event) => {
  let {data, newValue, field} = event;
  console.log('onEditCelol')

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
const selectOne = (event, rowThat) => {
  console.log(event, rowThat);
};
const onChange = (data) => {

  console.log('onCgange', data);
  setValue(data);
};

const searchCode = (event) => {
  setTimeout(() => {
  console.log(event, store.getProducts)
    if (!event.query.trim().length) {
      filteredProducts.value = [];
    } else {
      filteredProducts.value = store.getProducts.filter(({code, description}) => {
        console.log(code, description)
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
        <p style=" color: grey;">
          {{ value9?.name ? 'repartidor: ' + value9?.name : 'Selecciona la ruta' }}

        </p>
      </div>
    </div>

    <h5 class="mt-0">Captura de productos</h5>

    <DataTable :value="detalleCobro" showGridlines @cell-edit-complete="onCellEditComplete"
               tableClass="editable-cells-table">
      <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header">
        <template #body="{ data, field }">
          <template v-if="field === 'code'">
            <AutoComplete :id="`${field}${data.index}`"
                          @complete="searchCode"
                          @change="selectOne(e, data)"
                          v-model="data[field]"
                          class="p-autocomplete-sm"
                          optionLabel="code"
                          :suggestions="filteredProducts" :delay="100" selectOnFocus force-selection complete-on-focus
                          autoOptionFocus selectionMessage="selection message" emptySelectionMessage="empty selection"
                          searchMessage="search msj" aria-labelledby="codeSearch">
              <template #option="slotProps">
                <div class="flex align-items-baseline  align-options-center">
                  <b class="mr-2">{{ slotProps.option.code }}</b> <small class="text-mutted"> {{ slotProps.option.description }}</small>

                </div>
              </template>
            </AutoComplete>
          </template>
          <template v-else-if="['venta', 'saldo'].includes(field)">
            <InputNumber :id="`${field}${data.index}`" readonly type="decimal" class="p-inputnumber-sm "
                         v-model="data[field]" mode="currency"
                         :disabled="['salTotal', 'regTotal'].includes(field)" currency="USD" locale="en-US"/>
          </template>
          <template v-else>

            <InputNumber type="decimal" class="p-inputnumber-sm " v-model="data[field]"
                         :disabled="['salTotal', 'regTotal'].includes(field)"/>
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

  .p-inputtext{

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
