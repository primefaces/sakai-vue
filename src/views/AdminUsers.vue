<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { getMaes } from '../firebase/db/users';

const toast = useToast();

const loading = ref(true);
const maes = ref(null);

const filters = ref({
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    uid: { value: null, matchMode: FilterMatchMode.CONTAINS },
    role: { value: null, matchMode: FilterMatchMode.IN },
});

const roles = ref(["mae", "coordi", "subjectCoordi", "admin","publi","tec"])

onMounted(() => {
  getMaes()
    .then((data) => {
      maes.value = data;
      loading.value =false;
    })
    .catch(() => {
      maes.value = [];
    })
});

</script>


<template>
    <div class="sm:flex sm:justify-content-between mb-2 sm:mb-5">
        <h1 class="text-black text-6xl font-bold text-center m-0 sm:text-left">Usuarios</h1>
        <!-- <Button @click="showDialogRegister = true" label="Crear registro" icon="pi pi-pencil" size="large" class="max-h-full w-full sm:w-fit" /> -->
    </div>
    <div class="card mb-0">

    <!-- TODO: Adjust row sizing -->
    <!-- TODO: implement responsive resizing -->
        <DataTable :value="maes" paginator :rows="50" dataKey="id" 
            :loading="loading" class="border-round-xl"
            v-model:filters="filters" filterDisplay="row" removableSort
            responsiveLayout="stack" breakpoint="640px"
            >
            <template #empty>No se encontraron Maes. </template>
            <template #loading>Cargando información. Por favor espera.</template>
            <Column header="Matrícula" field="uid">
                <template #body="{ data }">
                    <a :href="`#/mae/${data.uid}`" class="text-lg uppercase cursor-pointer font-semibold underline text-primary">{{ data.uid }}</a>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Matrícula" />
                </template>
            </Column>
            <Column header="Nombre" field="name">
                <template #body="{ data }">
                    <p class="text-lg font-semibold">{{ data.name }}</p>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Nombre" />
                </template>
            </Column>
            <Column header="Rol" field="role">
                <template #body="{ data }">
                    <p class="text-lg font-semibold uppercase">{{ data.role }}</p>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <MultiSelect v-model="filterModel.value" @change="filterCallback()" :options="roles" placeholder="Cualquiera" class="p-column-filter" style="min-width: 14rem" :maxSelectedLabels="1">
                        <template #option="slotProps">
                            <div class="flex align-items-center gap-2">
                                <span class="uppercase"> {{ slotProps.option }}</span>
                            </div>
                        </template>
                    </MultiSelect>
                </template>
            </Column>
            <Column header="Asesorías" field="asesorias" sortable>
                <template #body="{ data }">
                    <p class="text-lg font-semibold">{{ Math.floor(Math.random() * 21) + 10 }}</p>
                </template>
            </Column>
            <Column header="Horas" field="totalTime" sortable>
                <template #body="{ data }">
                    <p class="text-lg font-semibold">{{ Math.round(((data.totalTime ?? 0) / 60) * 100) / 100 }}</p>
                </template>
            </Column>
            <Column header="Horario" field="totalTime">
              <template #body="{ data }">
                <i v-if="data.weekSchedule && typeof data.weekSchedule === 'object' && Object.keys(data.weekSchedule).length > 0" class="pi pi-check-circle text-green-500"></i>
                <i v-else class="pi pi-times-circle text-red-500"></i>
              </template>
            </Column>
            <Column header="Materias" field="totalTime">
                <template #body="{ data }">
                    <p class="text-lg font-semibold">{{ data.subjects ? data.subjects.length : 0 }}</p>
                </template>
            </Column>
        </DataTable>
    </div>
</template>
