<script setup>
import { ref, onMounted } from 'vue';
import TituloAdmin from "../components/TituloAdmin.vue";
import { FilterMatchMode, FilterService } from 'primevue/api';
import { UsuariosInfoService } from "../service/UsuariosInfoService";


const usuarios = ref();
const loading = ref(true);
const ARRAY_CONTAINS = ref('ARRAY_CONTAINS');
const ARRAY_CONTAINS_ANY = ref('ARRAY_CONTAINS_ANY');
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    rol: { value: null, matchMode: FilterMatchMode.CONTAINS },
    matricula: { value: null, matchMode: FilterMatchMode.CONTAINS},
    nombre: { value: null, matchMode: FilterMatchMode.CONTAINS },
    asesorias: { value: null, matchMode: FilterMatchMode.EQUALS },
    horas: { value: null, matchMode: FilterMatchMode.EQUALS },
    actHorario: { value: null, matchMode: FilterMatchMode.EQUALS }
});

const roles = ref(['Mae', 'Estudiante', 'Coordinador', 'Administrador']);
const actHorarioOptions = ref(['true', 'false']);

onMounted(() => {
    const data = UsuariosInfoService.getUsuarios();
    usuarios.value = data;
    loading.value = false;

    FilterService.register(ARRAY_CONTAINS.value, (value, filter) => {
        if (filter === undefined || filter === null || filter.trim() === '') {
            return true;
        }

        if (value === undefined || value === null) {
            return false;
        }

        const filterNormalized = filter.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

        for (let i = 0; i < value.length; i++) {
            for (const property in value[i]) {
                const propertyNormalized = value[i][property].toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                if (propertyNormalized.indexOf(filterNormalized) !== -1) {
                    return true;
                }
            }
        }

        return false;
    });

    FilterService.register(ARRAY_CONTAINS_ANY.value, (value, filter) => {
        if (filter === undefined || filter === null || filter.length === 0) {
            return true;
        }

        if (value === undefined || value === null) {
            return false;
        }

        return false;
    });
});

const getTipo = (rol) => {

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

    <DataTable v-model:filters="filters" :value="usuarios" paginator :rows="5"  dataKey="id" filterDisplay="row"
            :loading="loading" :globalFilterFields="['rol', 'matricula', 'nombre', 
            'asesorias','horas','actHorario']" class="border-round-xl text-lg font-bold">

      <template #empty>No se encontraron Usuarios. </template>
      <template #loading>Cargando información. Por favor espera.</template>
      
      <Column field="id" style="min-width: 1rem">
        <template #body="{ data }">
          <Button icon="pi pi-pencil" @click="editarUsuario(data.id)"></Button> 
        </template>
      </Column>
       
      <Column field="rol" header="Roles" style="min-width: 8rem">
        <template #body="{ data }">
            <Tag rounded class="w-10 h-4 text-lg font-semibold" :value="data.rol" :class="getTipo(data.rol)" v-tooltip.top="data.rol" style="color: white;"></Tag>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Dropdown v-model="filterModel.value" @change="filterCallback()" :options="roles" placeholder="Rol" class="p-column-filter" />
        </template>
      </Column>
      
      <Column field="matricula" header="Matrícula" style="min-width: 15rem">
        <template #body="{ data }">
          <p class="text-lg font-semibold">{{ data.matricula}}</p>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" @input="filterCallback()" 
          class="p-column-filter w-full" placeholder="Matricula" />
        </template>
      </Column>

      <Column field="nombre" header="Nombre" :showFilterMenu="false" style="min-width: 18rem">
        <template #body="{ data }">
          <p class="text-lg font-semibold">{{ data.nombre}}</p>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" @input="filterCallback()" 
          class="p-column-filter w-full" placeholder="Nombre" />
        </template>
      </Column>

      <Column  field="asesorias" header="Asesorías" style="min-width: 15rem" >
        <template #body="{ data }">
          <p class="text-lg font-semibold">{{ data.asesorias}}</p>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" @input="filterCallback()" 
          class="p-column-filter w-full" placeholder="Asesorías" />
        </template>
      </Column>

      <Column  field="horas" header="Horas" style="min-width: 13rem">
        <template #body="{ data }">
          <p class="text-lg font-semibold">{{ data.horas}}</p>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" @input="filterCallback()" 
          class="p-column-filter w-full" placeholder="Horas" />
        </template>
      </Column>

      <Column field="actHorario" header="Act. Horario"  style="min-width: 2rem">
        <template #body="{ data }">
          <div class="p-d-flex p-jc-center p-ai-center">
            <Button v-if="data.actHorario == true" @click="checked = false" icon="pi pi-check" class="p-button-rounded p-button-success ml-auto" />
            <Button v-if="data.actHorario == false" @click="checked = true" icon="pi pi-times" class="p-button-rounded p-button-danger ml-auto" />
          </div>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Dropdown v-model="filterModel.value" @change="filterCallback()" :options="actHorarioOptions" placeholder="Estatus" class="p-column-filter" />
        </template>
        
      </Column>

      <Column style="min-width: 1rem">
        <template #body="data">
          <Button icon="pi pi-chevron-right" class="p-button-success" @click="verPerfil(data.id)"></Button>
        </template>
      </Column> 

    </DataTable>
  </div>

  <div class="flex relative mt-3">
    <div class="flex-1"></div>
    <div class="justify-end">
      <Button label="Agregar Usuario" icon="pi pi-plus-circle" severity="info" size="large" class="ml-5 bg-0D294C" />
    </div>
  </div>
  
</template>
