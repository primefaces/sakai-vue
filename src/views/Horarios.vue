
<script setup>
import { ref, onMounted, computed } from 'vue';
import { FilterMatchMode, FilterService } from 'primevue/api';
import { getMaes } from '@/firebase/db/users';

const customers = ref();
const ARRAY_CONTAINS = ref('ARRAY_CONTAINS');
const ARRAY_CONTAINS_ANY = ref('ARRAY_CONTAINS_ANY');
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    weekSchedule: { value: null, matchMode: ARRAY_CONTAINS_ANY.value },
    materias: { value: null, matchMode: ARRAY_CONTAINS.value },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    modalidad: { value: null, matchMode: FilterMatchMode.EQUALS }
});

const horario = ref([
    "Lunes", "Martes", "Miercoles", "Jueves", "Viernes"
]);

const statuses = ref(['Remota', 'Presencial', 'Híbrida']);
const loading = ref(true);

onMounted(() => {

    getMaes().then((data) => {
        console.log(data[0]['weekSchedule'])
        customers.value = data;
        loading.value = false;
    })

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

        value = translateDayToEnglish(value);

        console.log("value:", value);
        console.log("filter:", filter);

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

function translateDayToSpanish(day) {
  const daysMapping = {
    'monday': 'Lunes',
    'tuesday': 'Martes',
    'wednesday': 'Miércoles',
    'thursday': 'Jueves',
    'friday': 'Viernes',
    'saturday': 'Sábado',
    'sunday': 'Domingo'
  };

  // Check if the provided day is in the mapping
  if (day in daysMapping) {
    return daysMapping[day];
  } else {
    // If the day is not found in the mapping, return an error message
    return 'Invalid day';
  }
}

function translateDayToEnglish(day) {
  const daysMapping = {
    'Lunes': 'monday',
    'Martes': 'tuesday',
    'Miércoles': 'wednesday',
    'Jueves': 'thursday',
    'Viernes': 'friday',
    'Sábado': 'saturday',
    'Domingo': 'sunday'
  };

  // Check if the provided day is in the mapping
  if (day in daysMapping) {
    return daysMapping[day];
  } else {
    // If the day is not found in the mapping, return an error message
    return 'Invalid day';
  }
}

// TODO: adjust colors to figma design
const getDayColor = (day) => {
    const dayLC = day.toLowerCase();
    switch (dayLC) {
        case 'monday':
            return 'bg-blue-600';
        case 'tuesday':
            return 'bg-green-600';
        case 'wednesday':
            return 'bg-yellow-600';
        case 'thursday':
            return 'bg-red-600';
        case 'friday':
            return 'bg-purple-600';
    }
}

const getSubjectColor = (area) => {
    switch (area) {
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
            return 'bg-yellow-600';
    }
}

</script>


<template>
    <h1 class="text-black text-6xl font-bold mb-5">Horarios</h1>
    <div class="card mb-0">

    <!-- TODO: Adjust row sizing -->
    <!-- TODO: implement responsive resizing -->
        <DataTable v-model:filters="filters" :value="customers" paginator :rows="10" dataKey="id" filterDisplay="row"
            :loading="loading" :globalFilterFields="['name', 'horario', 'materias', 'modalidad']" class="border-round-xl">
            <!-- <template #header>
                <div class="flex justify-content-end">
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="filters['global'].value" placeholder="Busqueda general" />
                    </span>
                </div>
            </template> -->
            <template #empty>No se encontraron Maes. </template>
            <template #loading>Cargando información. Por favor espera.</template>
            <Column header="Nombre" field="name" :showFilterMenu="false" style="min-width: 20rem">
                <template #body="{ data }">
                    <p class="text-lg font-semibold">{{ data.name }}</p>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter w-full"
                        placeholder="Busca por nombre" />
                </template>
            </Column>
            <Column header="Materias" filterField="materias" :showFilterMenu="false" style="min-width: 14rem">
                <template #body="{ data }">
                    <!-- TODO: ask for handling when data.materias.length > x -->
                    <div class="flex flex-wrap justify-content-evenly column-gap-2 row-gap-2">
                        <Tag class="text-md" :class="getSubjectColor(item.area)" :value="item.id" v-tooltip.top="item.name" rounded v-for="item in data.subjects"/>
                    </div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter"
                        placeholder="Busca por materia" />
                </template>
            </Column>
            <Column header="Horario" filterField="weekSchedule" :showFilterMenu="false" :filterMenuStyle="{ width: '6rem' }"
                style="min-width: 6rem">
                <template #body="{ data }">
                    <!-- TODO: ask for hour display implementation -->
                    <div class="flex flex-wrap justify-content-evenly column-gap-2 row-gap-2">
                        <Tag class="text-md mx-auto" :class="getDayColor(key)" :value="translateDayToSpanish(key)" v-tooltip.top="value.toString()" rounded v-for="(value, key) in data.weekSchedule" style="min-width: 3rem"/>
                    </div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <MultiSelect v-model="filterModel.value" @change="filterCallback()" :options="horario"
                        placeholder="Cualquiera" class="p-column-filter" style="min-width: 6rem" :maxSelectedLabels="1">
                        <template #option="slotProps">
                            <div class="flex align-items-center gap-2">
                                <span>{{ slotProps.option }}</span>
                            </div>
                        </template>
                    </MultiSelect>
                </template>
            </Column>
            <Column field="modalidad" header="Modalidad" :showFilterMenu="false" :filterMenuStyle="{ width: '6rem' }"
                style="min-width: 6rem">
                <template #body="{ data }">
                    <div class="flex justify-content-center">
                        <Tag :value="data.modalidad ?? 'Híbrida'" class="text-lg text-center" :severity="getSeverity(data.modalidad)" />
                    </div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <Dropdown v-model="filterModel.value" @change="filterCallback()" :options="statuses"
                        placeholder="Cualquiera" class="p-column-filter" style="min-width: 6rem" :showClear="true">
                        <template #option="slotProps">
                            <Tag :value="slotProps.option" :severity="getSeverity(slotProps.option)" />
                        </template>
                    </Dropdown>
                </template>
            </Column>
        </DataTable>
    </div>
</template>
