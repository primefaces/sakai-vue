<script setup lang="ts"></script>

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
</template>
