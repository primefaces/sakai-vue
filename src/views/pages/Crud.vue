<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import {getCurrentColumns} from "./../../shared/control";
import {useCatalogosStore} from '@/stores'

const frmat = txt => capitalize(txt).replaceAll('_', ' ')
import {capitalize, onBeforeMount, onMounted, ref, watch} from 'vue';
import {defineProps} from 'vue';
import {useRoute} from 'vue-router';
const dt = ref(null);
const productDialog = ref(false);
const product = ref({});
const submitted = ref(false);


const route = useRoute();
const store = useCatalogosStore()

const currentP = {}
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
  store.getAll(routeApi);
  console.log('setCurrentP-> ', currentP, columns)
}
const props = defineProps({
  indx: {type: String, default: 'ss'},
})


const formatCurrency = (value) => {
  return value?.toLocaleString('es-US', {style: 'currency', currency: 'USD'});
}

onBeforeMount(() => {
  console.log('beforeMount')
  setCurrentP(props.indx)
});

onMounted(() => {
  console.log('Mounted')
})
const editProduct = (editProduct) => {
  product.value = {...editProduct};
  console.log(product);
  productDialog.value = true;
};

const exportCSV = () => {
  dt.value.exportCSV();
};

const confirmDeleteProduct = (editProduct) => {
  product.value = editProduct;
  deleteProductDialog.value = true;
};
const openNew = () => {
  product.value = {};
  submitted.value = false;
  productDialog.value = true;
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
        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="my-2">
              <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
<!--              <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" />-->
            </div>
          </template>

          <template v-slot:end>
<!--            <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />-->
            <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
          </template>
        </Toolbar>
        <DataTable
            :value="store.dataCatalog"
            :paginator="true"
            ref="dt"
            :rows="10"
            dataKey="id"
            :rowHover="true"
            :key="currentP.key"
            scrollable scrollHeight="10%"
            tableStyle="min-width: 50rem"
            :loading="store.isLoading">
          <template #empty> {{ currentP.title }} no tiene registros.</template>
          <template #loading> Cargando la información..</template>
          <Column v-for="col of columns" sortable :key="col.field" :field="col.field" :header="col.header">
            <template v-if="'precio_lista' === col.field " #body="slotProps">
              {{ formatCurrency(slotProps.data.precio_lista) }}
            </template>
            <template v-if="'precio_compra' === col.field " #body="slotProps">
              {{ formatCurrency(slotProps.data.precio_compra) }}
            </template>
          </Column>
          <Column headerStyle="min-width:2em;">
            <template #body="slotProps">
              <Button icon="pi pi-pencil" class=" p-button-success mr-2"
                      @click="editProduct(slotProps.data)"/>
              <Button icon="pi pi-trash" class=" p-button-warning mt-2"
                      @click="confirmDeleteProduct(slotProps.data)"/>
            </template>
          </Column>
        </DataTable>
        <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Product Details" :modal="true" class="p-fluid">
          <img :src="'demo/images/product/' + product.image" :alt="product.image" v-if="product.image" width="150" class="mt-0 mx-auto mb-5 block shadow-2" />
          <div class="field" v-if="currentP.key==='Repartidores'">
            <label for="nombres">Name</label>
            <InputText id="nombres" v-model.trim="product.nombres" required="true" autofocus :class="{ 'p-invalid': submitted && !product.nombres }" />
            <small class="p-invalid" v-if="submitted && !product.nombres">Name is required.</small>
          </div>
          <div class="field" v-if="currentP.key==='Repartidores'">
            <label for="nombre">Name</label>
            <InputText id="nombre" v-model.trim="product.nombre" required="true" autofocus :class="{ 'p-invalid': submitted && !product.nombre }" />
            <small class="p-invalid" v-if="submitted && !product.nombre">Name is required.</small>
          </div>
          <div class="field" v-if="['Rutas', 'factores_de_conversión', 'unidades_de_medida', 'grupos', 'familias'].includes(currentP.key)">
            <label for="descripcion">Description</label>
            <Textarea id="descripcion" v-model="product.descripcion" required="true" rows="3" cols="20" />
          </div>
          <div class="field" v-if="['Productos'].includes(currentP.key)">
            <label for="description">Description</label>
            <Textarea id="description" v-model="product.description" required="true" rows="3" cols="20" />
          </div>
          <div class="field" v-if="['Productos'].includes(currentP.key)">
            <label for="code">Codigo</label>
            <Textarea id="code" v-model="product.code" required="true" rows="3" cols="20" />
          </div>
          <div class="field"  v-if="['Productos'].includes(currentP.key)">
            <label for="code">Code</label>
            <InputText id="code" v-model.trim="product.code" required="true" autofocus :class="{ 'p-invalid': submitted && !product.code }" />
            <small class="p-invalid" v-if="submitted && !product.code">Name is required.</small>
          </div>
          <div class="field"  v-if="['unidades_de_medida','familias'].includes(currentP.key)">
            <label for="codigo">Codigo</label>
            <InputText id="codigo" v-model.trim="product.codigo" required="true" autofocus :class="{ 'p-invalid': submitted && !product.codigo }" />
            <small class="p-invalid" v-if="submitted && !product.codigo">Name is required.</small>
          </div>
          <div class="field" v-if="['grupos'].includes(currentP.key)">
            <label for="familia">Familia</label>
            <Textarea id="familia" v-model="product.familia" required="true" rows="3" cols="20" />
          </div>
          <div class="field" v-if="['Productos'].includes(currentP.key)">
            <label for="grupo">grupo</label>
            <Textarea id="grupo" v-model="product.grupo" required="true" rows="3" cols="20" />
          </div>


          <div class="field">
            <label for="inventoryStatus" class="mb-3">Inventory Status</label>
            <Dropdown id="inventoryStatus" v-model="product.inventoryStatus" :options="statuses" optionLabel="label" placeholder="Select a Status">
              <template #value="slotProps">
                <div v-if="slotProps.value && slotProps.value.value">
                  <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                </div>
                <div v-else-if="slotProps.value && !slotProps.value.value">
                  <span :class="'product-badge status-' + slotProps.value.toLowerCase()">{{ slotProps.value }}</span>
                </div>
                <span v-else>
                                    {{ slotProps.placeholder }}
                                </span>
              </template>
            </Dropdown>
          </div>

          <div class="field">
            <label class="mb-3">Category</label>
            <div class="formgrid grid">
              <div class="field-radiobutton col-6">
                <RadioButton id="category1" name="category" value="Accessories" v-model="product.category" />
                <label for="category1">Accessories</label>
              </div>
              <div class="field-radiobutton col-6">
                <RadioButton id="category2" name="category" value="Clothing" v-model="product.category" />
                <label for="category2">Clothing</label>
              </div>
              <div class="field-radiobutton col-6">
                <RadioButton id="category3" name="category" value="Electronics" v-model="product.category" />
                <label for="category3">Electronics</label>
              </div>
              <div class="field-radiobutton col-6">
                <RadioButton id="category4" name="category" value="Fitness" v-model="product.category" />
                <label for="category4">Fitness</label>
              </div>
            </div>
          </div>

          <div class="formgrid grid">
            <div class="field col">
              <label for="precio">Price</label>
              <InputNumber id="precio" v-model="product.precio" mode="currency" currency="USD" locale="en-US" :class="{ 'p-invalid': submitted && !product.precio }" :required="true" />
              <small class="p-invalid" v-if="submitted && !product.precio">Price is required.</small>
            </div>
            <div class="field col">
              <label for="costo">Cost</label>
              <InputNumber id="costo" v-model="product.costo" mode="currency" currency="USD" locale="en-US" :class="{ 'p-invalid': submitted && !product.costo }" :required="true" />
              <small class="p-invalid" v-if="submitted && !product.costo">Price is required.</small>
            </div>
            <div class="field col">
              <label for="caja">Caja</label>
              <InputNumber id="caja" v-model="product.caja" integeronly />
            </div>
          </div>
          <div class="formgrid grid">
            <div class="field col">
              <label for="cont">Cont</label>
              <InputNumber id="cont" v-model="product.cont" mode="currency" currency="USD" locale="en-US" :class="{ 'p-invalid': submitted && !product.cont }" :required="true" />
              <small class="p-invalid" v-if="submitted && !product.cont">Price is required.</small>
            </div>
            <div class="field col">
              <label for="um">um</label>
              <InputNumber id="um" v-model="product.um" mode="currency" currency="USD" locale="en-US" :class="{ 'p-invalid': submitted && !product.um }" :required="true" />
              <small class="p-invalid" v-if="submitted && !product.um">Price is required.</small>
            </div>
          </div>
          <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
            <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveProduct" />
          </template>
        </Dialog>
        <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
            <span v-if="product"
            >Are you sure you want to delete <b>{{ product.name }}</b
            >?</span
            >
          </div>
          <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductDialog = false"/>
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteProduct"/>
          </template>
        </Dialog>

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

<style scoped lang="scss"></style>
