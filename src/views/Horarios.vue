
<script setup>
import { ref, onMounted, computed } from 'vue';
import { FilterMatchMode, FilterService } from 'primevue/api';
import { MaeInfoService } from '@/service/MaeInfoService';

const customers = ref();
const ARRAY_CONTAINS = ref('ARRAY_CONTAINS');
const ARRAY_CONTAINS_ANY = ref('ARRAY_CONTAINS_ANY');
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    horario: { value: null, matchMode: ARRAY_CONTAINS_ANY.value },
    "materias": { value: null, matchMode: ARRAY_CONTAINS.value },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    modalidad: { value: null, matchMode: FilterMatchMode.EQUALS }
});

const horario = ref([
    "Lunes", "Martes", "Miercoles", "Jueves", "Viernes"
]);

const statuses = ref(['Remota', 'Presencial', 'Híbrida']);
const loading = ref(true);

onMounted(() => {
    MaeInfoService.getCustomersMedium().then((data) => {
        customers.value = getCustomers(data);
        loading.value = false;
    });

    // Custom filter for mae subjects. Returns true if the filter value is contained within any of the values of the array.
    FilterService.register(ARRAY_CONTAINS.value, (value, filter) => {
        // Filter -> value entered by user
        // Value -> array of objects, where each object represents a subject given by a mae

        if (filter === undefined || filter === null || filter.trim() === '') {
            return true;
        }

        if (value === undefined || value === null) {
            return false;
        }

        // Remove accents and special characters from filter 
        const filterNormalized = filter.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

        for (let i = 0; i < value.length; i++) {
            for (const property in value[i]) {
                // Remove accents and special characters from property of value
                const propertyNormalized = value[i][property].toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                if (propertyNormalized.indexOf(filterNormalized) !== -1) {
                    // window.console.log("TRUE:", propertyNormalized, "contains", filterNormalized);
                    return true;
                }
            }
        }

        return false;
    });

    // Custom filter for mae schedules. Returns true if any of the filter values in found within value.
    FilterService.register(ARRAY_CONTAINS_ANY.value, (value, filter) => {
        // Filter -> value entered by user
        // Value -> array of strings, where each string represents a day selected by the user from the dropwdown menu

        if (filter === undefined || filter === null || filter.length === 0) {
            return true;
        }

        if (value === undefined || value === null) {
            return false;
        }

        window.console.log("value:", value);
        window.console.log("filter:", filter);

        for (let i = 0; i < filter.length; i++) {
            window.console.log("filter:", filter[i]);
            for (let j = 0; j < value.length; j++) {
                const dayNorm = value[j][0].normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                const filterNorm = filter[i].normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

                if (dayNorm === filterNorm) {
                    window.console.log("TRUE:", dayNorm, "is", filterNorm);
                    return true;
                }
            }

        }

        return false;
    });
});

const getCustomers = (data) => {
    return [...(data || [])].map((d) => {
        d.date = new Date(d.date);

        return d;
    });
};

const getSeverity = (status) => {
    switch (status) {
        case 'Remota':
            return 'success';
        case 'Presencial':
            return 'info';
        case 'Hibrido':
            return 'warning';
        case 'renewal':
            return null;
    }
}

// TODO: adjust colors to figma design
const getDayColor = (day) => {
    const dayLC = day.toLowerCase();
    switch (dayLC) {
        case 'lunes':
            return 'bg-blue-300';
        case 'martes':
            return 'bg-green-300';
        case 'miercoles':
            return 'bg-yellow-300';
        case 'jueves':
            return 'bg-red-300';
        case 'viernes':
            return 'bg-purple-300';
    }
}


</script>


<template>
    <div class="flex flex-col flex-wrap">

        <h1 class="w-full text-blue-800 h-fit">Horario</h1>
        <div class="card">
            <!-- TODO: Adjust row sizing -->
            <!-- TODO: implement responsive resizing -->
            <DataTable v-model:filters="filters" :value="customers" paginator :rows="10" dataKey="id" filterDisplay="row"
                :loading="loading" :globalFilterFields="['name', 'horario', 'materias', 'modalidad']">
                <template #header>
                    <div class="flex justify-content-end">
                        <span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                        </span>
                    </div>
                </template>
                <template #empty>No se encontraron Maes. </template>
                <template #loading>Cargando información. Por favor espera.</template>
                <Column header="Nombre" field="name" style="min-width: 12rem">
                    <template #body="{ data }">
                        {{ data.name }}
                    </template>
                    <template #filter="{ filterModel, filterCallback }">
                        <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter"
                            placeholder="Busca por nombre" />
                    </template>
                </Column>
                <Column header="Materias" filterField="materias" :showFilterMenu="false" style="min-width: 12rem">
                    <template #body="{ data }">
                        <div class="flex align-items-center flex-column">
                            <!-- TODO: ask for handling when data.materias.length > x -->
                            <p class="m-0 p-1 bg-blue-300 text-black-alpha-90 font-semibold border-round-3xl my-1"
                                v-for="item in data.materias">
                                {{ item.id }}
                            </p>
                        </div>
                    </template>
                    <template #filter="{ filterModel, filterCallback }">
                        <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter"
                            placeholder="Busca por materia" />
                    </template>
                </Column>
                <Column header="Horario" filterField="horario" :showFilterMenu="false" :filterMenuStyle="{ width: '14rem' }"
                    style="min-width: 14rem">
                    <template #body="{ data }">
                        <div class="flex align-items-center gap-2">
                            <!-- TODO: ask for hour display implementation -->
                            <div class="flex flex-row flex-wrap column-gap-3">

                                <p class=" h-fit w-fit py-2 px-3 bg-blue-300 border-round-3xl font-semibold"
                                    v-for="item in data.horario" :class="getDayColor(item[0])">
                                    {{ item[0] }}
                                </p>

                            </div>
                        </div>
                    </template>
                    <template #filter="{ filterModel, filterCallback }">
                        <MultiSelect v-model="filterModel.value" @change="filterCallback()" :options="horario"
                            placeholder="Cualquiera" class="p-column-filter" style="min-width: 14rem"
                            :maxSelectedLabels="1">
                            <template #option="slotProps">
                                <div class="flex align-items-center gap-2">
                                    <span>{{ slotProps.option }}</span>
                                </div>
                            </template>
                        </MultiSelect>
                    </template>
                </Column>
                <Column field="modalidad" header="Modalidad" :showFilterMenu="false" :filterMenuStyle="{ width: '14rem' }"
                    style="min-width: 12rem">
                    <template #body="{ data }">
                        <div class="flex justify-content-center">
                            <Tag :value="data.modalidad" class="text-2xl text-center"
                                :severity="getSeverity(data.modalidad)" />
                        </div>
                    </template>
                    <template #filter="{ filterModel, filterCallback }">
                        <Dropdown v-model="filterModel.value" @change="filterCallback()" :options="statuses"
                            placeholder="Cualquiera" class="p-column-filter" style="min-width: 12rem" :showClear="true">
                            <template #option="slotProps">
                                <Tag :value="slotProps.option" :severity="getSeverity(slotProps.option)" />
                            </template>
                        </Dropdown>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>
