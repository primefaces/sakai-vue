<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable no-unused-vars -->
<!-- eslint-disable prettier/prettier -->
<!-- eslint-disable prettier/prettier -->
<script setup>
import {onMounted, reactive, ref, watch} from 'vue';
import ProductService from '@/service/ProductService';
import {useLayout} from '@/layout/composables/layout';
import { useToast } from "primevue/usetoast";
import {useDashboardStore} from '@/stores'
import {getCurrentColumns} from "@/shared/control";

const store = useDashboardStore()
const toast = useToast();

let documentStyle = getComputedStyle(document.documentElement);

let textColor = documentStyle.getPropertyValue('--text-color');
const {isDarkTheme} = useLayout();

const products = ref(null);



// moment.locale('es-mx')
moment.updateLocale("es-mx", { week: {
    dow: 6, // First day of week is Saturday
    doy: 8 // First week of year must contain 1 January (7 + 6 - 1)
  }});

const setData = (param) => {
  store.setOperationsVentas()
  store.setOperationsCierres()
  store.setProductsTOP()
  store.getAll();
  console.log('setCurrentP-> ', store.getOperations)
}
onMounted(() => {
  console.log(moment().startOf('week').format('LLLL'))
  // chartData.value = setChartData();
  // chartOptions.value = setChartOptions();

  setData()

});

const formatCurrency = (value) => {
  return value?.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
};



</script>

<template>
<!--  {{store.getDataFor}}-->
  <div  class="grid">
    <Toast />

    <div class="col-6  lg:col-6 xl:col-3">
      <div class="card mb-0 px-3 py-3 ">
        <div class="flex  justify-content-between">

          <div class="px-3">
            <div>
              <div class="text-900 font-medium text-xl">{{formatCurrency( store.getCobrosDia | 0)}}</div>
            </div>
            <span class="text-600 font-medium mb-3">Cobros</span>
            <span class="text-500"> del día</span>
          </div>
          <div class="flex ms-4 align-items-center justify-content-center bg-red-100 border-round"
               style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-shopping-cart text-red-500 text-xl"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="col-6  lg:col-6 xl:col-3">
      <div class="card mb-0 px-3 py-3 ">
        <div class="flex  justify-content-between">

          <div class="px-3">
            <div>
              <div class="text-900 font-medium text-xl">{{formatCurrency( store.getUtilidadDia | 0)}}</div>
            </div>
            <span class="text-600 font-medium mb-3">Utilidad</span>
            <span class="text-500"> del día</span>
          </div>
          <div class="flex ms-4 align-items-center justify-content-center bg-cyan-100 border-round"
               style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-shopping-cart text-cyan-500 text-xl"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="col-6  lg:col-6 xl:col-3">
      <div class="card mb-0 px-3 py-3 ">
        <div class="flex  justify-content-between">

          <div class="px-3">
            <div>
              <div class="text-900 font-medium text-xl">{{formatCurrency( store.getComisionDia | 0)}}</div>
            </div>
            <span class="text-600 font-medium mb-3">Comisiones</span>
            <span class="text-500"> del día</span>
          </div>
          <div class="flex ms-4 align-items-center justify-content-center bg-green-100 border-round"
               style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-shopping-cart text-green-500 text-xl"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="col-6  lg:col-6 xl:col-3">
      <div class="card mb-0 px-3 py-3 ">
        <div class="flex  justify-content-between">

          <div class="px-3">
            <div>
              <div class="text-900 font-medium text-xl">{{formatCurrency( store.getKltsDia | 0)}}</div>
            </div>
            <span class="text-600 font-medium mb-3">Kilolitros</span>
            <span class="text-500"> del día</span>
          </div>
          <div class="flex ms-4 align-items-center justify-content-center bg-orange-100 border-round"
               style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-shopping-cart text-orange-500 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 xl:col-6">
      <div class="card">
        <h5>Ventas</h5>
        <small class="text-primary"> Kilo-Litros</small>
        <template v-if="store.getLoading === true">
          <div class="card flex bg-light justify-content-center">

            <Image src="demo/images/Vanilla-1s-234px.gif" alt="Image" width="250" />
          </div>
        </template>
        <template v-else>
          <Chart  type="line" :data="store.getLineData" :options="store.getLineOptions" class="h-20rem"/>
        </template>
      </div>
    </div>
    <div class="col-12 xl:col-6">
      <div class="card">
          <h5>Cierres</h5>
        <small class="text-primary">cobrado $</small>

        <template v-if="store.getLoading === true">
          <div class="card flex bg-light justify-content-center">
            <img :src="'demo/images/Vanilla-1s-234px.gif'" :alt="'Cargando'" class="product-image" />

          </div>
        </template>
        <template v-else>
          <Chart  type="bar" :data="store.getBarData" :options="store.getBarOptions" class="h-20rem" />
        </template>
      </div>
    </div>

    <div class="col-12 xl:col-6">
      <!-- <div class="card">
          <h5>Recent Sales</h5>
          <DataTable :value="products" :rows="5" :paginator="true" responsiveLayout="scroll">
              <Column style="width: 15%">
                  <template #header> Image </template>
                  <template #body="slotProps">
                      <img :src="'demo/images/product/' + slotProps.data.image" :alt="slotProps.data.image" width="50" class="shadow-2" />
                  </template>
              </Column>
              <Column field="name" header="Name" :sortable="true" style="width: 35%"></Column>
              <Column field="price" header="Price" :sortable="true" style="width: 35%">
                  <template #body="slotProps">
                      {{ formatCurrency(slotProps.data.price) }}
                  </template>
              </Column>
              <Column style="width: 15%">
                  <template #header> View </template>
                  <template #body>
                      <Button icon="pi pi-search" type="button" class="p-button-text"></Button>
                  </template>
              </Column>
          </DataTable>
      </div> -->
      <div class="card">
        <div class="flex justify-content-between align-items-center mb-2">
          <h5>Productos más vendidos</h5>
          <div>
            <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded"
                    @click="$refs.menu2.toggle($event)"></Button>
<!--            <Menu ref="menu2" :popup="true" :model="items"></Menu>-->
          </div>
        </div>
        <ul class="list-none p-0 m-0">
          <li v-for="item in store.getProdTop" class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
            <div>
              <span class="text-900 font-medium mr-2 mb-1 md:mb-0">

                {{item.code}} </span>
              <div class="mt-1 text-600">{{ item.description }}</div>
            </div>
            <div class="mt-2 md:mt-0 flex align-items-center">
              <span class="text-400 ml-3 font-light"><small>x {{item.vendido}}</small></span>
              <span class="text-red-600 ml-3 font-medium">{{formatCurrency( item.vendido * item.precio_lista)}}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
<!--    <div class="col-12 xl:col-6">-->
<!--      <div class="card">-->
<!--        <div class="flex align-items-center justify-content-between mb-4">-->
<!--          <h5>Notifications</h5>-->
<!--          <div>-->
<!--            <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded"-->
<!--                    @click="$refs.menu1.toggle($event)"></Button>-->
<!--            <Menu ref="menu1" :popup="true" :model="items"></Menu>-->
<!--          </div>-->
<!--        </div>-->

<!--        <span class="block text-600 font-medium mb-3">TODAY</span>-->
<!--        <ul class="p-0 mx-0 mt-0 mb-4 list-none">-->
<!--          <li class="flex align-items-center py-2 border-bottom-1 surface-border">-->
<!--            <div-->
<!--                class="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">-->
<!--              <i class="pi pi-dollar text-xl text-blue-500"></i>-->
<!--            </div>-->
<!--            <span class="text-900 line-height-3"-->
<!--            >Richard Jones-->
<!--                            <span class="text-700">has purchased a blue t-shirt for <span-->
<!--                                class="text-blue-500">79$</span></span>-->
<!--                        </span>-->
<!--          </li>-->
<!--          <li class="flex align-items-center py-2">-->
<!--            <div-->
<!--                class="w-3rem h-3rem flex align-items-center justify-content-center bg-orange-100 border-circle mr-3 flex-shrink-0">-->
<!--              <i class="pi pi-download text-xl text-orange-500"></i>-->
<!--            </div>-->
<!--            <span class="text-700 line-height-3">Your request for withdrawal of <span class="text-blue-500 font-medium">2500$</span> has been initiated.</span>-->
<!--          </li>-->
<!--        </ul>-->

<!--        <span class="block text-600 font-medium mb-3">YESTERDAY</span>-->
<!--        <ul class="p-0 m-0 list-none">-->
<!--          <li class="flex align-items-center py-2 border-bottom-1 surface-border">-->
<!--            <div-->
<!--                class="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">-->
<!--              <i class="pi pi-dollar text-xl text-blue-500"></i>-->
<!--            </div>-->
<!--            <span class="text-900 line-height-3"-->
<!--            >Keyser Wick-->
<!--                            <span class="text-700">has purchased a black jacket for <span-->
<!--                                class="text-blue-500">59$</span></span>-->
<!--                        </span>-->
<!--          </li>-->
<!--          <li class="flex align-items-center py-2 border-bottom-1 surface-border">-->
<!--            <div-->
<!--                class="w-3rem h-3rem flex align-items-center justify-content-center bg-pink-100 border-circle mr-3 flex-shrink-0">-->
<!--              <i class="pi pi-question text-xl text-pink-500"></i>-->
<!--            </div>-->
<!--            <span class="text-900 line-height-3"-->
<!--            >Jane Davis-->
<!--                            <span class="text-700">has posted a new questions about your product.</span>-->
<!--                        </span>-->
<!--          </li>-->
<!--        </ul>-->
<!--      </div>-->
<!--    </div>-->

  </div>
</template>

<style >
.w-50{
  width: 50%;
}

</style>