<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

const route = useRoute();

onMounted(() => {
  console.log('client detail client id', route.params.clientId);
});
</script>

<template>
  <div class="col-12">
    <div class="card">
      <h5>Nombre del cliente</h5>
      <div class="p-fluid formgrid grid">
        <div class="field col-12 md:col-10">
          <label for="state">ID de cuenta: </label>
        </div>

        <div class="field col-12 md:col-2">
          <Button label="Approved" size="small" />
          <!--          <Button label="Warning" severity="warning" size="small" />-->
          <!--          <Button label="Danger" severity="danger" size="small" />-->
        </div>

        <div class="field col-12 md:col-12">
          <label for="state">Numero de cuenta: </label>
        </div>

        <div class="field col-12 md:col-12">
          <label for="state">Tipo de cuenta: </label>
        </div>
      </div>
    </div>
  </div>

  <div class="col-12">
    <div class="card">
      <TabView>
        <TabPanel header="Datos del cliente">
          <div class="p-fluid formgrid grid">
            <div class="field col-12 md:col-2">
              <label for="state">ID de cuenta: </label>
            </div>

            <div class="field col-12 md:col-2">
              <label for="state">ID de cuenta: </label>
            </div>

            <div class="field col-12 md:col-2">
              <label for="state">ID de cuenta: </label>
            </div>

            <div class="field col-12 md:col-2">
              <label for="state">ID de cuenta: </label>
            </div>

            <div class="field col-12 md:col-2">
              <label for="state">ID de cuenta: </label>
            </div>

            <div class="field col-12 md:col-2">
              <Button label="Approved" size="small" />
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
