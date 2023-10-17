<script setup lang="ts">
import { ref } from 'vue';
import Dialog from 'primevue/dialog';
import InputSwitch from 'primevue/inputswitch';

const isReceivingSMS = ref(false);
const isKYCVisible = ref(false);
const isPhotosVisible = ref(false);
</script>

<template>
  <div class="p-fluid formgrid grid">
    <!-- KYC -->
    <Dialog v-model:visible="isKYCVisible" modal header="Información de la cuenta" :style="{ width: '50vw' }">
      <p>CIP/AML</p>
      <p>KYC ACTIONS</p>

      <template #footer>
        <Button label="Cerrar" @click="isKYCVisible = false" />
      </template>
    </Dialog>

    <!--  Fotos -->
    <Dialog v-model:visible="isPhotosVisible" modal header="Imagenes de los documentos" :style="{ width: '50vw' }">
      <p></p>

      <template #footer>
        <Button label="Cerrar" @click="isPhotosVisible = false" />
      </template>
    </Dialog>

    <div class="field col-12 md:col-8">
      <h4>Datos personales</h4>
    </div>
    <div class="field col-12 md:col-2">
      <Button @click="isKYCVisible = true" label="KYC" outlined size="small" />
    </div>
    <div class="field col-12 md:col-2">
      <Button @click="isPhotosVisible = true" label="FOTOS" outlined size="small" />
    </div>

    <div class="field col-12 md:col-2">
      <label for="state">ID: </label>
      <p>data</p>
    </div>

    <div class="field col-12 md:col-2">
      <label for="state">Nombre: </label>
      <p>data</p>
    </div>

    <div class="field col-12 md:col-2">
      <label for="state">Nro documento: </label>
      <p>data</p>
    </div>

    <div class="field col-12 md:col-2">
      <label for="state">Pais del documento: </label>
      <p>data</p>
    </div>

    <div class="field col-12 md:col-2">
      <label for="state">Nro telefono: </label>
      <p>data</p>
    </div>

    <div class="field col-12 md:col-2">
      <label for="state">recibe sms: </label>
      <InputSwitch disabled v-model="isReceivingSMS" />
    </div>

    <div class="field col-12 md:col-2">
      <label for="state">Email: </label>
      <p>data</p>
    </div>
    <!--            -->

    <div class="field col-12 md:col-12">
      <h4>Domicilio fiscal</h4>
    </div>

    <div class="field col-12 md:col-2">
      <label for="state">Pais: </label>
      <p>data</p>
    </div>

    <div class="field col-12 md:col-2">
      <label for="state">Estado: </label>
      <p>data</p>
    </div>

    <div class="field col-12 md:col-2">
      <label for="state">Ciudad: </label>
      <p>data</p>
    </div>

    <div class="field col-12 md:col-2">
      <label for="state">Direccion 1: </label>
      <p>data</p>
    </div>

    <div class="field col-12 md:col-2">
      <label for="state">Direccion 2: </label>
      <p>data</p>
    </div>

    <div class="field col-12 md:col-2">
      <label for="state">Codigo postal: </label>
      <p>data</p>
    </div>
  </div>
</template>
