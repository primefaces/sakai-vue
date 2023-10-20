<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import {useCaptuaraStore, useOperacionStore} from "@/stores";

import {onMounted, ref} from 'vue';
import moment from "moment";

const store = useOperacionStore();
const selectedCustomer = ref('')

onMounted(() => {
  fetchCatalogos()
});


const fetchCatalogos = () => {
  store.getAll();
}

const menuRef = ref(null);
const formatDate = (d) => moment(d).format('L')

</script>

<template>
    <div class="grid">

        <div class="col-12">
            <div class="card p-2">
                <h3 class="p-0 m-0 ml-3">Registros realizados</h3>
                <p class="text-muted mb-3 ml-3">Selecciona una operacion para ver los detalles</p>
                <Splitter style="height: 70vh" class="mb-5">
                    <SplitterPanel :size="40" :minSize="50" style="overflow: scroll">
                      <h5 class="py-1 px-2">Operaciones registradas</h5>

                      <DataTable selectionMode="single" scrollHeight="55vh" dataKey="id" v-model:selection="selectedCustomer" @update:selection="(e)=>{
                        console.log(e)
                        store.getItemsById(e)
                      }" :value="store.operacions" scrollable :class="`p-datatable-sm`" tableStyle="min-width: 20rem">
                        <Column field="id" frozen header="No."></Column>
                        <Column field="date" frozen header="Fecha">
                          <template #body="{ data }">
                            {{ formatDate(data.date) }}
                          </template>
                        </Column>
                        <Column field="repartidor" header="No. Ruta"></Column>
<!--                        <Column field="utilidad" header="Utilidad"></Column>-->
<!--                        <Column field="costos"   header="Costos"></Column>-->
                        <Column field="cobro" frozen header="Cobrado $"></Column>
                      </DataTable>
                    </SplitterPanel>
                    <SplitterPanel :size="60" style="overflow: scroll">
                      <h5 class="py-1 px-2">Detalle de operacion</h5>

                      <p>utilidad $ <strong>{{ store.operacion.utilidad || '--' }}</strong></p>
                      <p>costos $ <strong>{{ store.operacion.costos || '--' }}</strong></p>
                      <p>comision $ <strong>{{ store.operacion.comision || '--' }}</strong></p>


                      <DataTable  :value="store.itemsOperacion" scrollable  scrollHeight="16rem" :class="`p-datatable-sm px-2`" tableStyle="min-width: 20rem">
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
                    </SplitterPanel>
                </Splitter>
            </div>
        </div>
    </div>
</template>
