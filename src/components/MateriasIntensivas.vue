<script setup>

const materia = " Modelación Matemática Intermedia"
const intensiva = "Si"

import { ref, onMounted } from 'vue';
import { IntensivasInfoService } from "../service/IntensivasInfoService";


const usuarios = ref();
const loading = ref(true);
onMounted(() => {
    const data = IntensivasInfoService.getIntensivas();
    usuarios.value = data;
    loading.value = false;
});


// Implementar cuando se junte con la base de datos, si desea que se vea por area
const getAsesor = (asesor) => {

switch (asesor) {
      case 'ING':
          return 'bg-cyan-600';
      case 'NEG':
          return 'bg-blue-600';
      case 'SLD':
          return 'bg-teal-600';
      case 'CIS':
          return 'bg-red-600';
      case 'AMC':
          return 'bg-green-600';
      case 'ART':
          return 'bg-purple-600';
      default:
          return 'bg-blue-600';
  }
}

</script>

<template>
    <div class="overflow-hidden font-lato px-4">
        <div class="text-black text-4xl mt-3">
           {{ materia }}
        </div>
        <div class="flex relative mt-3">
            <div class="flex-1">

            </div>
            <div class="justify-end">
                {{ intensiva }}
            </div>
        </div>
        <DataTable  :value="usuarios" paginator :rows="5"  dataKey="id" 
            :loading="loading"  class="border-round-xl text-lg font-bold">

            <template #empty>No se encontraron Materias. </template>
            <template #loading>Cargando información. Por favor espera.</template>

            <Column field="id" style="min-width: 5rem">
                <template #body="{ data }">
                    <Button icon="pi pi-pencil" @click="editarUsuario(data.id)"></Button> 
                </template>
            </Column>

            <Column field="fecha" header="Fecha" :showFilterMenu="false" style="min-width: 20rem">
                <template #body="{ data }">
                    <p class="text-lg font-semibold">{{ data.fecha}}</p>
                </template>
            </Column>

            <Column field="asesor" header="Asesores" style="min-width:8rem">
                <template #body="{ data }">
                    <Tag rounded class="w-10 h-4 text-lg font-semibold" :value="data.asesor" 
                        :class="getAsesor(data.asesor)" v-tooltip.top="data.asesor" style="color: white;">
                    </Tag>
                </template>
            </Column>

            <Column  field="hora" header="Hora" style="min-width:5rem">
                <template #body="{ data }">
                    <p class="text-lg font-semibold">{{ data.hora}}</p>
                </template>
            </Column>

            <Column  field="salon" header="Salón" style="min-width:5rem">
                <template #body="{ data }">
                    <p class="text-lg font-semibold">{{ data.salon}}</p>
                </template>
            </Column>
        
        </DataTable>
        
    </div>
</template>