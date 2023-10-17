<script setup lang="ts">
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import ClientPersonalDataTab from '@/views/clients/components/ClientPersonalDataTab.vue';
import { ref } from 'vue';
import Slider from 'primevue/slider';
import InputSwitch from 'primevue/inputswitch';

const swapFeeAsset = ref(50);
const swapFeeFiat = ref(50);
const isSwapEnable = ref(false);
</script>

<template>
  <div class="col-12">
    <div class="card">
      <TabView>
        <TabPanel header="Datos del cliente">
          <ClientPersonalDataTab></ClientPersonalDataTab>
        </TabPanel>

        <TabPanel header="Socios">
          <!--          todo -->
          <!--    iterate each partner      -->
          <ClientPersonalDataTab></ClientPersonalDataTab>
          <ClientPersonalDataTab></ClientPersonalDataTab>
        </TabPanel>

        <TabPanel header="Configuracion de la cuenta">
          <div class="p-fluid formgrid grid">
            <div class="field col-12 md:col-12">
              <h4>Configuracion de fee</h4>
            </div>

            <div class="field col-12 md:col-2">
              <label for="state">Wire domestico (IN): </label>
              <InputText type="text" placeholder=""></InputText>
            </div>

            <div class="field col-12 md:col-2">
              <label for="state">Wire domestico (OUT): </label>
              <InputText type="text" placeholder=""></InputText>
            </div>

            <div class="field col-12 md:col-2">
              <label for="state">Wire Internacional (IN): </label>
              <InputText type="text" placeholder=""></InputText>
            </div>

            <div class="field col-12 md:col-2">
              <label for="state">Wire Internacional (OUT): </label>
              <InputText type="text" placeholder=""></InputText>
            </div>

            <div class="field col-12 md:col-2">
              <label for="state">Fee Swap Fiat - Asset: </label>
              <InputText :value="swapFeeAsset" disabled />
              <Slider v-model="swapFeeAsset" />
            </div>

            <div class="field col-12 md:col-2">
              <label for="state">Fee Swap Asset - Fiat : </label>
              <InputText :value="swapFeeFiat" disabled />
              <Slider v-model="swapFeeFiat" />
            </div>

            <div class="field col-12 md:col-2">
              <label for="state">Módulo de swap habilitado?: </label>
              <InputSwitch v-model="isSwapEnable" />
            </div>
          </div>
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>