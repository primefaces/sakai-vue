<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import {useCaptuaraStore, useOperacionStore, useReportStore} from "@/stores";

import {onMounted, ref} from 'vue';
moment.locale('es-mx');

const store = useOperacionStore();
const repstore = useReportStore();
const selectedCustomer = ref('')
const rutaSeleccionada = ref();

onMounted(() => {
  fetchCatalogos()
});


const fetchCatalogos = () => {
  store.getAll();
  repstore.setRepartidores()
}

const menuRef = ref(null);
const formatDate = (d) => moment(d).format('D [de] MMMM')
const formatCurrency = (value) => {
  return value?.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
};

</script>

<template>
  <div class="grid">

    <div class="col-12">
      <div class="card p-2">
        <h3 class="d-inline p-0 m-0 ml-3">Registros realizados</h3>
        <span class="d-inline text-muted mb-3 ml-3">Selecciona una operacion para ver los detalles</span>

        <div class="d-flex mt-3 align-items-stretch">

          <div class="flex-0 mr-2 border-1 border-bluegray-100 border-round">
            <div class="d-flex w-100 justify-content-between border-bottom-1 align-items-center px-2 py-1 border-bluegray-100">
              <h5 class="py-1 px-2 my-1">Operaciones</h5>
              <span class="p-float-label">
                       <Dropdown v-model="rutaSeleccionada" inputId="ruta" :options="repstore.getRepartidores"
                                 showClear  @change="(e)=>{console.log(e); store.setFilter(e.value?.ruta || '')}" optionLabel="ruta" class="w-full md:w-9rem"
                                 placeholder="Selecciona una"></Dropdown>
                    <label for="ruta">Ruta</label>
            </span>
            </div>


            <DataView :value="store.getOpFiltered" :layout="'list'" :paginator="false" :rows="9">
              <template #list="slotProps">
                <div class="row border-bottom-1 border-bluegray-200 px-3 hover:bg-primary-100 transition-duration-300">
                  <div class="flex flex-row align-items-center hoverable" role="button"
                       @click="store.getItemsById(slotProps.data)">
                    <div class="flex-1 text-left">
                      <div class="text-l">{{ formatDate(slotProps.data.date) }} - <strong class="text-gray-700">
                        R-{{ slotProps.data.repartidor }} </strong></div>
                      <!--                          <div class="mb-0">{{slotProps.data.date }} {{ formatDate(slotProps.data.date) }}</div>-->
                    </div>
                    <div
                        class="flex flex-column justify-content-between w-auto align-items-center md:align-items-end mt-4 md:mt-0">
                      <Button text icon="pi pi-chevron-right text-gray-50" size="small"  class="m-0 p-1"></Button>
                    </div>
                  </div>
                </div>
              </template>
            </DataView>
          </div>
          <div class="flex-1 min-w-60 border-1 border-bluegray-100 border-round">
            <div class="d-flex w-100 justify-content-between border-bottom-1 align-items-center px-2 py-1 border-bluegray-100">

            <h5 class="py-1 px-2 my-1">Detalle de operacion</h5>
            </div>
            <div class="d-flex bg-gray-50">


              <div class='col-3 text-center'>utilidad <p class="text-cant">
                {{ formatCurrency(store.operacion.utilidad) || '--' }}</p></div>
              <div class='col-3 text-center'>costos <p class="text-cant">
                {{ formatCurrency(store.operacion.costos) || '--' }}</p></div>
              <div class='col-3 text-center'>comision <p class="text-cant">
                {{ formatCurrency(store.operacion.comision) || '--' }}</p></div>
              <div class='col-3 text-center'>Cobro <p class="text-cant">{{
                  formatCurrency(store.operacion.cobro) || '--'
                }}</p></div>
            </div>


            <DataTable class="border-top-1 border-bluegray-100" :value="store.itemsOperacion" scrollable scrollHeight="40vh" :class="`p-datatable-sm px-2`"
                       tableStyle="min-width: 20rem">
              <Column field="nombreProducto" header="Producto"></Column>
              <Column field="precio_lista" header="Precio $">
                <template #body="{ data }">
                  {{ data.precio_lista }}
                </template>
              </Column>
              <Column field="ventaPz" header="Venta pz.">
                <template #body="{ data }">
                  {{ data.ventaPz }}
                </template>
              </Column>
              <Column field="saldo" header="Pesos"></Column>
              <Column field="mls" header="KlLts">
                <template #body="{ data }">
                  {{ (data.mls * data.ventaPz) / 1000 }}
                </template>
              </Column>
            </DataTable>
          </div>
        </div>

        <!--                <Splitter style="height: 70vh" class="mb-5">-->
        <!--                    <SplitterPanel :size="40" :minSize="50" style="overflow: scroll">-->
        <!--                      <h5 class="py-1 px-2">Operaciones registradas</h5>-->

        <!--                      <DataTable selectionMode="single" scrollHeight="55vh" dataKey="id" v-model:selection="selectedCustomer" @update:selection="(e)=>{-->
        <!--                        console.log(e)-->
        <!--                        store.getItemsById(e)-->
        <!--                      }" :value="store.operacions" scrollable :class="`p-datatable-sm`" tableStyle="min-width: 20rem">-->
        <!--                        <Column field="id" frozen header="No."></Column>-->
        <!--                        <Column field="date" frozen header="Fecha">-->
        <!--                          <template #body="{ data }">-->
        <!--                            {{ formatDate(data.date) }}-->
        <!--                          </template>-->
        <!--                        </Column>-->
        <!--                        <Column field="repartidor" header="No. Ruta"></Column>-->
        <!--&lt;!&ndash;                        <Column field="utilidad" header="Utilidad"></Column>&ndash;&gt;-->
        <!--&lt;!&ndash;                        <Column field="costos"   header="Costos"></Column>&ndash;&gt;-->
        <!--                        <Column field="cobro" frozen header="Cobrado $"></Column>-->
        <!--                      </DataTable>-->
        <!--                    </SplitterPanel>-->
        <!--                    <SplitterPanel :size="60" style="overflow: scroll">-->
        <!--                     -->
        <!--                    </SplitterPanel>-->
        <!--                </Splitter>-->
      </div>
    </div>
  </div>
</template>
<style>

.min-w-60 {
  min-width: 60%;
}

.d-flex {
  display: flex;

}

.row {
  width: 100%;
}

.p-dataview-content > div {
  width: 20rem;
  background: #FAFAFA;
  flex-direction: row;
  max-height: 58vh;
  overflow: auto;
}

.text-cant {
  font-size: 1.3rem;
  color: darkgray;
}
.d-inline{
  display: inline-block;
}


</style>
