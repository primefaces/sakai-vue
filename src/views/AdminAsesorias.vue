<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { getAsesorias } from '../firebase/db/asesorias';

const asesorias = ref([]);
const startDate = ref(null);
const endDate = ref(null);
const loading = ref(true);

const filters = ref({
    id: { value: null, matchMode: FilterMatchMode.CONTAINS },
    date: { value: null, matchMode: FilterMatchMode.BETWEEN },
    comment: { value: null, matchMode: FilterMatchMode.CONTAINS },
    location: { value: null, matchMode: FilterMatchMode.CONTAINS },
    subjects: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const fetchAsesorias = async () => {
    try {
        loading.value = true;
        const asesoriasData = await getAsesorias(startDate.value, endDate.value);
        asesorias.value = asesoriasData;
    } catch (error) {
        console.error("Error fetching asesorias: ", error);
        asesorias.value = [];
    } finally {
        loading.value = false;
    }
};

const filterByDate = () => {
    fetchAsesorias();
};

onMounted(() => {
    fetchAsesorias(); // Fetch asesorias when component mounts
});
</script>

<template>
    <div class="sm:flex sm:justify-content-between mb-2 sm:mb-5">
        <h1 class="text-black text-6xl font-bold text-center m-0 sm:text-left">Asesorías</h1>
    </div>
    <div class="card mb-0">
        <div class="flex justify-between mb-4">
            <Calendar v-model="startDate" placeholder="Fecha de Inicio" dateFormat="yy-mm-dd" />
            <Calendar v-model="endDate" placeholder="Fecha de Fin" dateFormat="yy-mm-dd" />
            <Button label="Filtrar" @click="filterByDate" />
        </div>

        <DataTable :value="asesorias" paginator :rows="10" dataKey="id" :loading="loading" 
            v-model:filters="filters" filterDisplay="row" removableSort responsiveLayout="scroll">
            <template #empty>No se encontraron asesorías.</template>
            <template #loading>Cargando información. Por favor espera.</template>

            <Column header="ID" field="id" hidden>
                <template #body="{ data }">
                    <p class="text-lg font-semibold">{{ data.id }}</p>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="ID" />
                </template>
            </Column>
            
            <Column header="Fecha" field="date">
                <template #body="{ data }">
                    <p class="text-lg font-semibold">{{ new Date(data.date.seconds * 1000).toLocaleDateString() }}</p>
                </template>
               
            </Column>
 <Column header="Mae" field="maeInfo">
                <template #body="{ data }">
                    <span>
                        <p class="text-lg font-semibold">{{ data.peerInfo.name  }}  </p>
                        <p class="text-lg font-semibold">{{ data.peerInfo.uid }}</p>
                    </span>
                    
                </template>           
            </Column>
           

            

            <Column header="Alumno" field="alumnoInfo">
                <template #body="{ data }">
                    <span>
                        <p class="text-lg font-semibold">{{ data.userInfo.name  }}  </p>
                        <p class="text-lg font-semibold">{{ data.userInfo.uid }}</p>
                    </span>
                    
                </template>           
            </Column>
            
            
            
            <Column header="Comentario" field="comment">
                <template #body="{ data }">
                    <p class="text-lg font-semibold">{{ data.comment }}</p>
                </template>
              
            </Column>
            
            
            <Column header="Materias" field="subjects">
                <template #body="{ data }">
                    <p class="text-lg font-semibold">{{ data.subject.name }}</p>
                </template>
               
            </Column>
        </DataTable>
    </div>
</template>
