<script setup lang="ts">
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import InputSwitch from 'primevue/inputswitch';
import { ref } from 'vue';
import Dialog from 'primevue/dialog';

const isReceivingSMS = ref(false);
const isKYCVisible = ref(false);
const isPhotosVisible = ref(false);
</script>

<template>
  <div class="col-12">
    <div class="card">
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

      <TabView>
        <TabPanel header="Datos del cliente">
          <div class="p-fluid formgrid grid">
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
        </TabPanel>

        <TabPanel header="Socios">
          <p class="line-height-3 m-0">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam
            voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
          </p>
        </TabPanel>

        <TabPanel header="Configuracion de la cuenta">
          <p class="line-height-3 m-0">
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia
            deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
          </p>
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>