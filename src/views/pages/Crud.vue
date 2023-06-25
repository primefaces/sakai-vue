<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import {getCurrentColumns} from "./../../shared/control";
import {useCatalogosStore} from '@/stores'

const frmat = txt => capitalize(txt).replaceAll('_', ' ')
import {capitalize, onBeforeMount, onMounted, ref, watch} from 'vue';
import {defineProps} from 'vue';
import {useRoute} from 'vue-router';


const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);

const selectedProducts = ref(null);
const filters = ref({});
const statuses = ref([
  {label: 'INSTOCK', value: 'instock'},
  {label: 'LOWSTOCK', value: 'lowstock'},
  {label: 'OUTOFSTOCK', value: 'outofstock'}
]);


const dt = ref(null);
const productDialog = ref(false);
const product = ref({});
const submitted = ref(false);


const route = useRoute();
const store = useCatalogosStore()

const currentP = {}
const genders = ref([
  { name: 'Hombre', code: 'H' },
  { name: 'Mujer', code: 'M' },
  { name: 'Otro', code: 'O' }
]);
let columns = [
  {field: 'code', header: 'Code'},
  {field: 'name', header: 'Name'},
  {field: 'category', header: 'Category'},
  {field: 'quantity', header: 'Quantity'}
];
const setCurrentP = (param) => {
  currentP.key = param;
  currentP.title = frmat(param);
  const {routeApi, properties} = getCurrentColumns(currentP.title)[0]
  columns = properties;
  currentP.routeApi = routeApi;
  store.getAll(routeApi);
  console.log('setCurrentP-> ', getCurrentColumns(currentP.title))
  console.log('setCurrentP-> ', currentP, columns)
}
const props = defineProps({
  indx: {type: String, default: 'ss'},
})


const formatCurrency = (value) => {
  return value?.toLocaleString('es-MX', {style: 'currency', currency: 'MXN'});
}

onBeforeMount(() => {
  console.log('beforeMount')
  setCurrentP(props.indx)
  store.getSecondaryData();
});

onMounted(() => {
  console.log('Mounted')
})
const editProduct = (editProduct) => {
  product.value = {...editProduct};
  console.log(product.value);
  productDialog.value = true;
};

const exportCSV = () => {
  dt.value.exportCSV();
};

const confirmDeleteProduct = (editProduct) => {
  console.log('confirmDeleteProduct')
  product.value = editProduct;
  deleteProductDialog.value = true;
};
const openNew = () => {
  product.value = {};
  submitted.value = false;
  productDialog.value = true;
};
const hideDialog = () => {
  productDialog.value = false;
  submitted.value = false;
};

const deleteProduct = () => {
  console.log('delete', product.value)

  store.delete(currentP.key, product.value.id)
  deleteProductDialog.value = false;
  setCurrentP(currentP.key)

}
const saveProduct = async () => {
  submitted.value = true;
  console.log('saveProduct', product.value)
  if (product.value.id) {
    await store.update(currentP.routeApi, product.value.id, product.value)
  }
  else if (product.value.code && currentP.key === 'Productos') {
    const body = product.value;
    console.log(body)
    const cas = {
      description: body.description,
      precio_lista: body.precio_lista,
      precio_compra: body.precio_compra,
      cant_caja: body.cant_caja,
      content: body.content,
      comision: body.comision,
      um: body.um.id,
      grupo: body.grupo.id,
    }
    console.log('-----',cas)
    await store.update(currentP.routeApi, product.value.code, cas)

  }
  else if (product.value.no_ruta && currentP.key === 'Rutas') {
    const body = product.value;
    console.log(body)
    await store.update(currentP.routeApi, product.value.no_ruta, body)
  }
  else {
    switch (currentP.key) {
      case 'grupos':
        const {familia} = product.value;
        console.log('--', familia)
        product.value.familia = familia.id
        break
      case 'factores_de_conversión':
        const {um, um_eq} = product.value;
        console.log('--', um, um_eq)
        product.value.um = um.id
        product.value.um_eq = um_eq.id
        break
      case 'Repartidores':
        const {ruta, sexo} = product.value;
        console.log('--',ruta, sexo)
        product.value.ruta = ruta.no_ruta
        product.value.sexo = sexo.code
        break
      default:
        console.log('default')
        break
    }
    store.register(currentP.routeApi, product.value)
  }
  productDialog.value = false;
  await store.getAll(currentP.routeApi);
  // setCurrentP(currentP.routeApi)


  // if (product.value.name && product.value.name.trim() && product.value.price) {
  //   if (product.value.id) {
  //     product.value.inventoryStatus = product.value.inventoryStatus.value ? product.value.inventoryStatus.value : product.value.inventoryStatus;
  //     products.value[findIndexById(product.value.id)] = product.value;
  //     toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
  //   } else {
  //     product.value.id = createId();
  //     product.value.code = createId();
  //     product.value.image = 'product-placeholder.svg';
  //     product.value.inventoryStatus = product.value.inventoryStatus ? product.value.inventoryStatus.value : 'INSTOCK';
  //     products.value.push(product.value);
  //     toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
  //   }
  //   productDialog.value = false;
  //   product.value = {};
  // }
};
watch(
    () => props.indx,
    (val) => {
      console.log(val)
      setCurrentP(val)
    }
);
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5>{{ currentP.title }}</h5>

        <DataTable
            :value="store.dataCatalog"
            :paginator="true"
            ref="dt"
            :rows="10"
            class="p-data-table-sm"
            dataKey="id"
            :rowHover="true"
            :key="currentP.key"
            stripedRows
            scrollable scrollHeight="10%"
            :loading="store.isLoading">
          <template #header>
            <div class="flex flex-wrap justify-content-between gap-2">
                <span class="p-input-icon-left">
            <i class="pi pi-search"/>
            <InputText v-model="store.searching" placeholder="Global Search"/>
        </span>
              <div class="formgroup-inline align-items-baseline">
                <span class="p-buttonset">
                    <Button label="Registrar" size="small" :loading="store.isLoading" @click="openNew"
                            icon="pi pi-plus"/>
                    <Button label="Guardar" size="small" :loading="store.isLoading" @click="exportCSV($event)"
                            icon="pi pi-file-excel"/>
                </span>

              </div>
            </div>
          </template>
          <template #empty> {{ currentP.title }} no tiene registros.</template>
          <template #loading> Cargando la información..</template>
          <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header">
            <template v-if="'precio_lista' === col.field " #body="slotProps">
              <b> {{ formatCurrency(slotProps.data.precio_lista) }}</b>
            </template>
            <template v-if="'precio_compra' === col.field " #body="slotProps">
              <b> {{ formatCurrency(slotProps.data.precio_compra) }}</b>
            </template>
          </Column>
          <Column headerStyle="width:7em; min-width:fit-content;" class="btns-col">
            <template #body="slotProps">
              <Button text icon="pi pi-file-edit" @click="editProduct(slotProps.data)"/>
              <Button text icon="pi pi-trash" @click="confirmDeleteProduct(slotProps.data)" severity="danger"
              />
            </template>
          </Column>
          <template #footer> Total de elementos: {{ store.dataCatalog.length || 0 }}.</template>
        </DataTable>


        <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Registrar nuevo" :modal="true"
                class="p-fluid">
          <img :src="'demo/images/product/' + product.image" :alt="product.image" v-if="product.image" width="150"
               class="mt-0 mx-auto mb-5 block shadow-2"/>

          <div class="field" v-if="['Productos'].includes(currentP.key)">
            <label for="code">Codigo</label>
            <InputText id="code" :disabled="product.code" v-model.trim="product.code" required="true"
                       :class="{ 'p-invalid': submitted && !product.code }"/>
            <small class="p-invalid" v-if="submitted && !product.code">code is required.</small>
          </div>
          <div class="field" v-if="currentP.key==='Repartidores'">
            <label for="nombres">Nombres</label>
            <InputText id="nombres" v-model.trim="product.nombres" required="true"
                       :class="{ 'p-invalid': submitted && !product.nombres }"/>
            <small class="p-invalid" v-if="submitted && !product.nombres">Name is required.</small>
          </div>

          <div class="field" v-if="['repartidores', 'grupos'].includes(currentP.key)">
            <label for="nombre">Nombre</label>
            <InputText id="nombre" v-model.trim="product.nombre" required="true"
                       :class="{ 'p-invalid': submitted && !product.nombre }"/>
            <small class="p-invalid" v-if="submitted && !product.nombre">Name is required.</small>
          </div>
          <div class="field"
               v-if="['Rutas', 'unidades_de_medida', 'familias'].includes(currentP.key)">
            <label for="descripcion">Descripcion</label>
            <InputText id="descripcion" v-model.trim="product.descripcion" required="true"
                       :class="{ 'p-invalid': submitted && !product.descripcion }"/>
            <small class="p-invalid" v-if="submitted && !product.descripcion">descripcion is required.</small>
          </div>
          <div class="field"
               v-if="['grupos',  'factores_de_conversión','Productos'].includes(currentP.key)">
            <label for="description">Descripcion</label>
            <InputText id="description" v-model.trim="product.description" required="true"
                       :class="{ 'p-invalid': submitted && !product.description }"/>
            <small class="p-invalid" v-if="submitted && !product.description">description is required.</small>
          </div>


          <div class="field" v-if="['unidades_de_medida','familias'].includes(currentP.key)">
            <label for="codigo">Codigo</label>
            <InputText id="codigo" v-model.trim="product.codigo" required="true" autofocus
                       :class="{ 'p-invalid': submitted && !product.codigo }"/>
            <small class="p-invalid" v-if="submitted && !product.codigo">Name is required.</small>
          </div>


          <div class="field" v-if="['grupos'].includes(currentP.key)">
            <label for="inventoryStatus" class="mb-3">Familia</label>
            <Dropdown id="inventoryStatus" v-model="product.familia" :options="store.getFamilias" optionLabel="label"
                      placeholder="Selecciona la familia">
              <template #value="slotProps">
                <div v-if="slotProps.value && slotProps.value.value">
                  <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                </div>
                <div v-else-if="slotProps.value && !slotProps.value.value">
                  <span :class="'product-badge status-' + slotProps.value.toString().toLowerCase()">{{
                      store.getFamilias.filter(f => f.id === slotProps.value)[0].label
                    }}</span>
                </div>
                <span v-else>
                                    {{ slotProps.placeholder }}
                                </span>
              </template>
            </Dropdown>
          </div>


          <div class="formgrid grid" v-if="['Productos'].includes(currentP.key)">
            <div class="field col">
              <label for="precio">$ Compra</label>
              <InputNumber id="precio" v-model="product.precio_compra" mode="currency" currency="USD" locale="en-US"
                           :class="{ 'p-invalid': submitted && !product.precio_compra }" :required="true"/>
              <small class="p-invalid" v-if="submitted && !product.precio_compra">Price is required.</small>
            </div>
            <div class="field col">
              <label for="costo">$ Venta</label>
              <InputNumber id="costo" v-model="product.precio_lista" mode="currency" currency="USD" locale="en-US"
                           :class="{ 'p-invalid': submitted && !product.precio_lista }" :required="true"/>
              <small class="p-invalid" v-if="submitted && !product.precio_lista">Price is required.</small>
            </div>
            <div class="field col">
              <label for="comision">$ comision</label>
              <InputNumber id="comision" v-model="product.comision" mode="currency" currency="USD"
                           :min-fraction-digits="3" locale="en-US"
                           :class="{ 'p-invalid': submitted && !product.comision }" :required="true"/>
              <small class="p-invalid" v-if="submitted && !product.comision">Price is required.</small>
              <small class="p-invalid" v-if="submitted && !product.comision">Price is required.</small>
            </div>

          </div>
          <div class="formgrid grid" v-if="['Repartidores'].includes(currentP.key)">
            <div class="field col">
              <label for="sexo">Genero</label>
              <Dropdown id="sexo" v-model="product.sexo" :options="genders" optionLabel="name"
                        placeholder="sexo">
                <template #value="slotProps">
                  <div v-if="slotProps.value && slotProps.value.value">
                    <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                  </div>
                  <div v-else-if="slotProps.value && !slotProps.value.value">
                  <span :class="'product-badge status-' + slotProps.value.toString().toLowerCase()">{{
                      // store.getGrupos.filter(f => f.id === slotProps.value)[0].label
                      slotProps.value.name
                    }}</span>
                  </div>
                  <span v-else>
                                    {{ slotProps.placeholder }}
                                </span>
                </template>
              </Dropdown>
            </div>
            <div class="field col">
              <label for="edad">Edad</label>
              <InputNumber id="edad" v-model="product.edad" mode="decimal"
                           :class="{ 'p-invalid': submitted && !product.edad }" :required="true"/>
              <small class="p-invalid" v-if="submitted && !product.edad">Factor is required.</small>
            </div>

          </div>
          <div class="field" v-if="['Repartidores'].includes(currentP.key)">
            <label for="ruta" class="mb-3">Ruta</label>
            <Dropdown id="ruta" v-model="product.ruta" :options="store.getRutas" optionLabel="label"
                      placeholder="Selecciona la ruta">
              <template #value="slotProps">
                <div v-if="slotProps.value && slotProps.value.value">
                  <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                </div>
                <div v-else-if="slotProps.value && !slotProps.value.value">
                  <span :class="'product-badge status-' + slotProps.value.toString().toLowerCase()">{{
                      store.getRutas.filter(f => f.no_ruta === slotProps.value)[0].label
                    }}</span>
                </div>
                <span v-else>
                                    {{ slotProps.placeholder }}
                                </span>
              </template>
            </Dropdown>
          </div>
          <div class="formgrid grid" v-if="['factores_de_conversión'].includes(currentP.key)">
            <div class="field col">
              <label for="um">U. origen</label>
              <Dropdown id="um" v-model="product.um" :options="store.getUnidadesMedida" optionLabel="label"
                        placeholder="Um">
                <template #value="slotProps">
                  <div v-if="slotProps.value && slotProps.value.value">
                    <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                  </div>
                  <div v-else-if="slotProps.value && !slotProps.value.value">
                  <span :class="'product-badge status-' + slotProps.value.toString().toLowerCase()">{{
                      // store.getGrupos.filter(f => f.id === slotProps.value)[0].label
                      slotProps.value
                    }}</span>
                  </div>
                  <span v-else>
                                    {{ slotProps.placeholder }}
                                </span>
                </template>
              </Dropdown>
            </div>
            <div class="field col">
              <label for="um_eq">U. destino</label>
              <Dropdown id="um_eq" v-model="product.um_eq" :options="store.getUnidadesMedida" optionLabel="label"
                        placeholder="um_eq">
                <template #value="slotProps">
                  <div v-if="slotProps.value && slotProps.value.value">
                    <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                  </div>
                  <div v-else-if="slotProps.value && !slotProps.value.value">
                  <span :class="'product-badge status-' + slotProps.value.toString().toLowerCase()">{{
                      // store.getGrupos.filter(f => f.id === slotProps.value)[0].label
                      slotProps.value
                    }}</span>
                  </div>
                  <span v-else>
                                    {{ slotProps.placeholder }}
                                </span>
                </template>
              </Dropdown>
            </div>
            <div class="field col">
              <label for="cantidad">Factor</label>
              <InputNumber id="cantidad" v-model="product.cantidad" mode="decimal"
                           :class="{ 'p-invalid': submitted && !product.cantidad }" :required="true"/>
              <small class="p-invalid" v-if="submitted && !product.cantidad">Factor is required.</small>
            </div>

          </div>
          <div class="formgrid grid" v-if="['Productos'].includes(currentP.key)">
            <div class="field col">
              <label for="cont">Cont</label>
              <InputNumber id="cont" v-model="product.content" mode="decimal"
                           :class="{ 'p-invalid': submitted && !product.content }" :required="true"/>
              <small class="p-invalid" v-if="submitted && !product.content">Price is required.</small>
            </div>
            <div class="field col">
              <label for="um">Ud. medida</label>
              <Dropdown id="um" v-model="product.um" :options="store.getUnidadesMedida" optionLabel="label"
                        placeholder="U.medida">
                <template #value="slotProps">
                  <div v-if="slotProps.value && slotProps.value.value">
                    <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                  </div>
                  <div v-else-if="slotProps.value && !slotProps.value.value">
                  <span :class="'product-badge status-' + slotProps.value.toString().toLowerCase()">
                    {{store.getUnidadesMedida.filter(f => f.id === slotProps.value)[0].codigo}}</span>
                  </div>
                  <span v-else>
                                    {{ slotProps.placeholder }}
                                </span>
                </template>
              </Dropdown>
              <!--              <label for="um">um</label>-->
              <!--              <InputNumber id="um" v-model="product.um" mode="currency" currency="USD" locale="en-US"-->
              <!--                           :class="{ 'p-invalid': submitted && !product.um }" :required="true"/>-->
              <small class="p-invalid" v-if="submitted && !product.um">Price is required.</small>
            </div>
            <div class="field col">
              <label for="caja">Unidades caja</label>
              <InputNumber id="cont" v-model="product.cant_caja" mode="decimal"
                           :class="{ 'p-invalid': submitted && !product.cant_caja }" integeronly :required="true"/>
              <small class="p-invalid" v-if="submitted && !product.cant_caja">Price is required.</small>
            </div>
          </div>

          <div class="field" v-if="['Productos'].includes(currentP.key)">
            <label for="grupos" class="mb-3">Grupo</label>
            <Dropdown id="grupos" v-model="product.grupo" :options="store.getGrupos" optionLabel="label"
                      placeholder="Selecciona la un grupo">
              <template #value="slotProps">
                <div v-if="slotProps.value && slotProps.value.value">
                  <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                </div>
                <div v-else-if="slotProps.value && !slotProps.value.value">
                  <span :class="'product-badge status-' + slotProps.value.toString().toLowerCase()">
                    {{store.getGrupos.filter(f => f.id === slotProps.value)[0].label}}
                  </span>
                </div>
                <span v-else>
                                    {{ slotProps.placeholder }}
                                </span>
              </template>
            </Dropdown>
          </div>

          <template #footer>
            <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
            <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="saveProduct"/>
          </template>
        </Dialog>
        <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Eliminar" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
            <span v-if="product"
            >Estás seguro que desear eliminar el elemento <b>{{ product.descripcion }}</b
            >?</span
            >
          </div>
          <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductDialog = false"/>
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteProduct"/>
          </template>
        </Dialog>
        <!--          <div class="field">-->
        <!--            <label class="mb-3">Category</label>-->
        <!--            <div class="formgrid grid">-->
        <!--              <div class="field-radiobutton col-6">-->
        <!--                <RadioButton id="category1" name="category" value="Accessories" v-model="product.category"/>-->
        <!--                <label for="category1">Accessories</label>-->
        <!--              </div>-->
        <!--              <div class="field-radiobutton col-6">-->
        <!--                <RadioButton id="category2" name="category" value="Clothing" v-model="product.category"/>-->
        <!--                <label for="category2">Clothing</label>-->
        <!--              </div>-->
        <!--              <div class="field-radiobutton col-6">-->
        <!--                <RadioButton id="category3" name="category" value="Electronics" v-model="product.category"/>-->
        <!--                <label for="category3">Electronics</label>-->
        <!--              </div>-->
        <!--              <div class="field-radiobutton col-6">-->
        <!--                <RadioButton id="category4" name="category" value="Fitness" v-model="product.category"/>-->
        <!--                <label for="category4">Fitness</label>-->
        <!--              </div>-->
        <!--            </div>-->
        <!--          </div>-->

        <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
            <span v-if="product">Are you sure you want to delete the selected products?</span>
          </div>
          <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductsDialog = false"/>
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProducts"/>
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
::v-deep(.btns-col ) {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

::v-deep(.p-datatable .p-datatable-tbody > tr > td) {
  text-align: left;
  border: 1px solid #f4f4f5;
  border-width: 0 0 1px 0;
  padding: .5rem 1rem;
}
</style>
