<script setup>
import { ref, onMounted } from 'vue';
import TituloAdmin from "../components/TituloAdmin.vue";

import { UsuariosInfoService } from "../service/UsuariosInfoService";

const usuarios = ref();
const loading = ref(true);

onMounted(() => {
   //Llamamos a la funcion para obtener los datos
  const data = UsuariosInfoService.getUsuarios();
  
  usuarios.value = data;
  loading.value = false;
});



const getTipo = (rol) => {
  console.log(rol);
  switch (rol) {
    case 'Mae':
      return 'bg-blue-600'; 
    case 'Estudiante':
      return 'bg-green-600';
    case 'Coordinador':
      return 'bg-orange-600';
    case 'Administrador':
      return 'bg-yellow-400';
    default:
      return 'bg-gray-600'; 
  }
}

</script>


<template>
  <div class="overflow-hidden font-lato px-4">
    <TituloAdmin></TituloAdmin>

    <DataTable :value="usuarios" paginator :rows="5">
      
      <Column field="id">
        <template #body="{ data }">
          <Button icon="pi pi-pencil" @click="editarUsuario(data.id)"></Button> 
        </template>
      </Column>
       
      <Column field="rol" header="Roles">
        <template #body="{ data }">
            <Tag rounded class="w-8 h-4 text-lg font-semibold" :value="data.rol" :class="getTipo(data.rol)" v-tooltip.top="data.rol" style="color: white;"></Tag>
        </template>
      </Column>
      
      <Column field="matricula" header="Matrícula">
        <template #body="{ data }">
          <p class="text-lg font-semibold">{{ data.matricula}}</p>
        </template>
      </Column>

      <Column field="nombre" header="Nombre">
        <template #body="{ data }">
          <p class="text-lg font-semibold">{{ data.nombre}}</p>
        </template>
      </Column>

      <Column  field="asesorias" header="Asesorías">
        <template #body="{ data }">
          <p class="text-lg font-semibold">{{ data.asesorias}}</p>
        </template>
      </Column>

      <Column  field="horas" header="Horas">
        <template #body="{ data }">
          <p class="text-lg font-semibold">{{ data.horas}}</p>
        </template>
      </Column>

      <Column field="actHorario" header="Act. Horario">
        <template #body="{ data }">
          <div class="p-d-flex p-jc-center p-ai-center">
            <Button v-if="data.actHorario == true" @click="checked = false" icon="pi pi-check" class="p-button-rounded p-button-success ml-auto" />
            <Button v-if="data.actHorario == false" @click="checked = true" icon="pi pi-times" class="p-button-rounded p-button-danger ml-auto" />
          </div>
        </template>
      </Column>


      
      <Column>
        <template #body="data">
          <Button icon="pi pi-chevron-right" class="p-button-success" @click="verPerfil(data.id)"></Button>
        </template>
      </Column> 
    </DataTable>
  </div>
</template>
