<script setup>
import { ref, onMounted } from 'vue';
import { getAsesorias } from '../firebase/db/asesorias';
import * as XLSX from 'xlsx';
const asesorias = ref([]);
const startDate = ref(null);
const endDate = ref(null);
const loading = ref(true);
const showDialog = ref(false);
const isFiltered = ref(false); 

const fetchAsesorias = async () => {
    try {
        loading.value = true;

        if (startDate.value && endDate.value) {
            const asesoriasData = await getAsesorias(startDate.value, endDate.value);
            asesorias.value = asesoriasData;
            isFiltered.value = true; 
        } else {
            asesorias.value = await getAsesorias();
            isFiltered.value = false; 
        }
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

const exportToExcel = () => {
    if (!isFiltered.value) {
        showDialog.value = true; 
        return;
    }
    exportData(); 
};

const exportData = () => {
    const formattedData = asesorias.value.map(asesoria => ({
        'ID': asesoria.id || '',
        'Matricula MAE': asesoria.peerInfo?.uid || '',
        'Nombre MAE': asesoria.peerInfo?.name || '',
        'Carrera MAE': asesoria.peerInfo?.career || '',
        'Area MAE': asesoria.peerInfo?.area || '',
        'Modelo MAE': 'TEC21',
        'Campus MAE': asesoria.peerInfo?.campus || '',
        'Matricula Alumno': asesoria.userInfo?.id || asesoria.userInfo?.uid || '',
        'Nombre Alumno': asesoria.userInfo?.name || '',
        'Carrera Alumno': asesoria.userInfo?.career || '',
        'Area Alumno': asesoria.userInfo?.area || '',
        'Modelo Alumno': 'TEC21', 
        'Campus Alumno': asesoria.userInfo?.campus || '',
        'Fecha': asesoria.date 
    ? new Date(asesoria.date.seconds * 1000) 
    : null,

        'Clave Materia': asesoria.subject?.id || '',
        'Materia': asesoria.subject?.name || '',
        'Modalidad': asesoria.modalidad || 'Presencial',
        'Tipo': asesoria.type || 'Normal',
        'Formato': asesoria.formato || 'Individual',
        'Rating': asesoria.rating || 'N/A',
        'Comentario': asesoria.comment || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Asesorías");
    XLSX.writeFile(workbook, "asesorias.xlsx");
};

const confirmExportAction = () => {
    showDialog.value = false;
    exportData();
};

onMounted(() => {
    fetchAsesorias();
});
</script>

<template>
    <div class="sm:flex sm:justify-content-between mb-2 sm:mb-5">
        <h1 class="text-black text-6xl font-bold text-center m-0 sm:text-left">Asesorías</h1>
    </div>
    <div>
        <div class="flex md:flex-row flex-column mb-4">
            <Calendar v-model="startDate" placeholder="Fecha de Inicio" dateFormat="yy-mm-dd" showIcon class="mb-2 mr-3 w-3" />
            <span class="mx-3 text-4xl text-black font-bold">-</span>
            <Calendar v-model="endDate" placeholder="Fecha de Fin" dateFormat="yy-mm-dd" showIcon class="mb-2 mx-3 w-3" />
            <Button label="Filtrar" @click="filterByDate" class="mb-2 mx-3 w-2" />
            <Button label="Exportar a Excel" @click="exportToExcel" class="mb-2 mx-3 w-3" :disabled="!isFiltered" />
        </div>

        <DataTable :value="asesorias" paginator :rows="10" dataKey="id" :loading="loading" responsiveLayout="scroll" class="custom-table">
            <template #empty>No se encontraron asesorías.</template>
            <template #loading>Cargando información. Por favor espera.</template>

            <Column header="ID" field="id" hidden>
                <template #body="{ data }">
                    <p class="text-sm">{{ data.id }}</p>
                </template>
            </Column>

            <Column header="Fecha" field="date">
                <template #body="{ data }">
                    <p class="text-sm">{{ new Date(data.date.seconds * 1000).toLocaleDateString() }}</p>
                </template>
            </Column>

            <Column header="Mae" field="maeInfo">
                <template #body="{ data }">
                    <div class="flex flex-row">
                        <img v-if="data.peerInfo.profilePictureUrl" :src="data.peerInfo.profilePictureUrl" alt="Foto de perfil" class="border-circle h-3rem w-3rem" />
                        <Skeleton v-else shape="circle" size="3rem"></Skeleton>
                        <span class="flex flex-column ml-4">
                            <p class="text-sm font-bold">{{ data.peerInfo.name }}</p>
                            <p class="text-sm">{{ data.peerInfo.uid }}</p>
                        </span>
                    </div>
                </template>
            </Column>

            <Column header="Carrera" field="maeInfo">
                <template #body="{ data }">
                    <p class="text-sm">{{ data.peerInfo.career }}</p>
                </template>
            </Column>

            <Column header="Alumno" field="alumnoInfo">
                <template #body="{ data }">
                    <span class="flex flex-column ml-4">
                            <p class="text-sm font-bold">{{ data.userInfo.name }}</p>
                            <p class="text-sm">{{ data.userInfo.uid }}</p>
                        </span>
                </template>
            </Column>

            <Column header="Carrera" field="alumnoInfo">
                <template #body="{ data }">
                    <p class="text-sm">{{ data.userInfo.career }}</p>
                </template>
            </Column>

            <Column header="Materias" field="subjects">
                <template #body="{ data }">
                    <p class="text-sm">{{ data.subject?.name }}</p>
                </template>
            </Column>
        </DataTable>
    </div>

    <Dialog v-model:visible="showDialog" header="Confirmar Exportación" modal>
        <p>¿Estás seguro de que deseas exportar todas las asesorías sin aplicar filtros?</p>
        <div class="flex justify-content-end mt-3">
            <Button label="Cancelar" icon="pi pi-times" @click="showDialog = false" class="p-button-text" />
            <Button label="Aceptar" icon="pi pi-check" @click="confirmExportAction" auto-focus />
        </div>
    </Dialog>
</template>




<style>


.custom-table .p-datatable-tbody > tr:nth-child(even) {
    background-color: #ffffff;
}

.custom-table .p-datatable-tbody > tr:nth-child(odd) {
    background-color: #f2f2f2 ;
}

.custom-table {
    border-radius: 12px; 
    overflow: hidden; 
    border: 1px solid #e4e7e6; 
}


.custom-table .p-datatable-tbody > tr > td span p {
    margin: 0;
}

.custom-table .p-datatable-tbody > tr > td {
    border-bottom: 1px solid #e4e7e6;
    padding: 1rem 1.5rem;
    text-align: left;
}


.p-dialog .p-dialog-footer {
    background:  #EFF2F7 ;
    border-bottom-right-radius: 20px;
    border-bottom-left-radius: 20px;
}

.p-dialog .p-dialog-content {
    background:  #EFF2F7 ;
}

.p-dialog .p-dialog-header {
    background:  #EFF2F7 ;
    border-top-right-radius: 20px;
    border-top-left-radius: 20px;
}

</style>