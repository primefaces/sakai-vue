<script setup>
import { ref, onMounted } from 'vue';
import TituloAdmin from "../components/TituloAdmin.vue";
import { FilterMatchMode, FilterService } from 'primevue/api';
import { MateriasInfoService } from "../service/MateriasInfoService";


const usuarios = ref();
const loading = ref(true);
const ARRAY_CONTAINS = ref('ARRAY_CONTAINS');
const ARRAY_CONTAINS_ANY = ref('ARRAY_CONTAINS_ANY');
const isDialogVisible = ref(false);


const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    materia: { value: null, matchMode: FilterMatchMode.CONTAINS },
    abreviacion: { value: null, matchMode: FilterMatchMode.CONTAINS},
    cantidad: { value: null, matchMode: FilterMatchMode.EQUALS },
});


onMounted(() => {
    const data = MateriasInfoService.getMaterias();
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


// Implementar cuando se junte con la base de datos
const getAbreviacion = (abreviacion) => {

  switch (abreviacion) {
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

const verIntensiva = (userId) => {
    console.log(userId)
  isDialogVisible.value = true;
};

</script>

<template>
    <div class="overflow-hidden font-lato px-4">
        <TituloAdmin></TituloAdmin>
        <DataTable v-model:filters="filters" :value="usuarios" paginator :rows="5"  dataKey="id" filterDisplay="row"
            :loading="loading" :globalFilterFields="['materia', 'abreviacion', 'cantidad', ]" class="border-round-xl text-lg font-bold">

            <template #empty>No se encontraron Materias. </template>
            <template #loading>Cargando información. Por favor espera.</template>

            <Column field="id" style="min-width: 5rem">
                <template #body="{ data }">
                    <Button icon="pi pi-pencil" @click="editarUsuario(data.id)"></Button> 
                </template>
            </Column>

            <Column field="materia" header="Materia" :showFilterMenu="false" style="min-width: 35rem">
                <template #body="{ data }">
                    <p class="text-lg font-semibold">{{ data.materia}}</p>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" 
                    class="p-column-filter w-full" placeholder="Materia" />
                </template>
            </Column>
            
            <Column field="abreviacion" header="Abreviaciones" style="min-width:8rem">
                <template #body="{ data }">
                    <Tag rounded class="w-10 h-4 text-lg font-semibold" :value="data.abreviacion" :class="getAbreviacion(data.abreviacion)" v-tooltip.top="data.abreviacion" style="color: white;"></Tag>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" 
                    class="p-column-filter w-full" placeholder="Abreviacion" />
                </template>
            </Column>

            <Column  field="cantidad" header="Cantidad" style="min-width:5rem">
                <template #body="{ data }">
                    <p class="text-lg font-semibold">{{ data.cantidad}}</p>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" 
                    class="p-column-filter w-full" placeholder="Cantidad" />
                </template>
            </Column>
            
            <Column style="min-width: 5rem" header="Usuarios">
                <template #body="data">
                    <Button icon="pi pi-chevron-right" class="p-button-success" @click="verIntensiva(data.id)"></Button>
                    <Dialog v-model="isDialogVisible">
                        <MateriasIntensivas />
                    </Dialog>
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
