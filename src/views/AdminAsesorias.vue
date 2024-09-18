<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { getAsesorias } from '../firebase/db/asesorias';
import * as XLSX from 'xlsx'; // Importa la biblioteca xlsx

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

// Función para exportar los datos a Excel
const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(asesorias.value);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Asesorías");
    
    XLSX.writeFile(workbook, "asesorias.xlsx");
};

onMounted(() => {
    fetchAsesorias(); // Fetch asesorias when component mounts
});
</script>

<template>
    <div class="sm:flex sm:justify-content-between mb-2 sm:mb-5">
        <h1 class="text-black text-6xl font-bold text-center m-0 sm:text-left">Asesorías</h1>
    </div>
    <div >
        <div class="flex justify-between mb-4">
            <Calendar v-model="startDate" placeholder="Fecha de Inicio" dateFormat="yy-mm-dd" />
            <Calendar v-model="endDate" placeholder="Fecha de Fin" dateFormat="yy-mm-dd" />
            <Button label="Filtrar" @click="filterByDate" />
            <Button label="Exportar a Excel" @click="exportToExcel" /> <!-- Botón para exportar -->
        </div>

        <DataTable :value="asesorias"   paginator :rows="10" dataKey="id" :loading="loading" 
            v-model:filters="filters" filterDisplay="row" removableSort responsiveLayout="scroll" class="custom-table" >
            <template #empty>No se encontraron asesorías.</template>
            <template #loading>Cargando información. Por favor espera.</template>

            <Column header="ID" field="id" hidden>
                <template #body="{ data }">
                    <p class="text-sm ">{{ data.id }}</p>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="ID" />
                </template>
            </Column>
            
            <Column header="Fecha" field="date">
                <template #body="{ data }">
                    <p class="text-sm ">{{ new Date(data.date.seconds * 1000).toLocaleDateString() }}</p>
                </template>
            </Column>
            
            <Column header="Mae" field="maeInfo">
                <template #body="{ data }">
                    <div class= "flex flex-row"> 
                        <img v-if="data.peerInfo.profilePictureUrl" :src="data.peerInfo.profilePictureUrl" alt="Foto de perfil"
                            class="border-circle h-3rem w-3rem">
                            <Skeleton v-else shape="circle" size="3rem"></Skeleton>
                        <span class="flex flex-column ml-4 ">
                            <p class="text-sm font-bold">{{ data.peerInfo.name  }}  </p>
                            <p class="text-sm ">{{ data.peerInfo.uid }}</p>
                        </span>
                    </div>
                </template>           
            </Column>

            <Column header="Carrera" field="maeInfo">
                <template #body="{ data }">
                    <span>
                        <p class="text-sm ">{{ data.peerInfo.career }}  </p>
                        <p class="text-sm ">{{ data.peerInfo.area}}  </p>
                    </span>
                </template>           
            </Column>

            <Column header="Alumno" field="alumnoInfo">
                <template #body="{ data }">
                    <span>
                        <p class="text-sm  font-bold">{{ data.userInfo.name  }}  </p>
                        <p class="text-sm ">{{ data.userInfo.uid }}</p>
                    </span>
                </template>           
            </Column>
            
            <Column header="Carrera" field="alumnoInfo">
                <template #body="{ data }">
                    <span>
                        <p class="text-sm  ">{{ data.peerInfo.career }}  </p>
                        <p class="text-sm ">{{ data.peerInfo.area}}  </p>
                    </span>
                </template>           
            </Column>

            <Column header="Materias" field="subjects">
                <template #body="{ data }">
                    <p class="text-sm ">{{ data.subject.name }}</p>
                </template>
            </Column>
            
            <Column header="Materias" field="clave" hidden >
                <template #body="{ data }">
                    <p class="text-sm ">{{ data.subject.id }}</p>
                </template>
            </Column>
            
            <Column header="Comentario" field="comment" hidden>
                <template #body="{ data }">
                    <p class="text-sm ">{{ data.comment }}</p>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style>


.custom-table .p-datatable-tbody > tr:nth-child(even) {
    background-color: #ffffff; /* Color de fondo para filas pares */
}

.custom-table .p-datatable-tbody > tr:nth-child(odd) {
    background-color: #f2f2f2 ; /* Color de fondo para filas impares */
}

.custom-table {
    border-radius: 12px; /* Bordes redondeados para la tabla */
    overflow: hidden; /* Para asegurar que los bordes redondeados funcionen bien */
    border: 1px solid #e4e7e6; /* Color del borde de la tabla */
}


.custom-table .p-datatable-tbody > tr > td span p {
    margin: 0; /* Elimina el margen por defecto */
}

.custom-table .p-datatable-tbody > tr > td {
    border-bottom: 1px solid #e4e7e6; /* Cambia el color y el grosor del borde */
    padding: 1rem 1.5rem; /* Ajusta el padding si es necesario */
    text-align: left;
}

</style>