
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { FilterMatchMode, FilterService } from 'primevue/api';
import { getMaes } from '@/firebase/db/users';

const router = useRouter();

const maes = ref();
const ARRAY_CONTAINS = ref('ARRAY_CONTAINS');
const ARRAY_CONTAINS_ANY = ref('ARRAY_CONTAINS_ANY');
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    weekSchedule: { value: null, matchMode: ARRAY_CONTAINS_ANY.value },
    subjects: { value: null, matchMode: ARRAY_CONTAINS.value },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    // modalidad: { value: null, matchMode: FilterMatchMode.EQUALS }
});

const horario = ref([
    "Lunes", "Martes", "Miercoles", "Jueves", "Viernes"
]);

const statuses = ref(['Remota', 'Presencial', 'Híbrida']);
const loading = ref(true);

onMounted(() => {

    getMaes().then((data) => {
        maes.value = data;
        loading.value = false;
    })

    
    // Custom filter for mae subjects. Returns true if the filter value is contained within any of the values of the array.
    // Custom filter for mae subjects. Returns true if the filter value is contained within any of the values of the array.
    FilterService.register(ARRAY_CONTAINS.value, (value, filter) => {
        // Filter -> valor ingresado por el usuario
        // Value -> array de objetos, donde cada objeto representa una materia dada por un mae;
        
        if (filter === undefined || filter === null || filter.trim() === '') {
            return true;
        }

        if (value === undefined || value === null) {
            return false;
        }
    
        // Normalizar el filtro para comparación sin distinción entre mayúsculas y minúsculas y considerando los acentos
        const filterNormalized = filter.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        for (let i = 0; i < value.length; i++) {
            const id = value[i].id.toString();
            const name = value[i].name.toString(); 
            
            // Normalizar el ID y el nombre para comparación sin distinción entre mayúsculas y minúsculas y considerando los acentos
            const idNormalized = id.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const nameNormalized = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            
            // Verificar si el filtro coincide con el ID o el nombre
            if (idNormalized.toLowerCase().includes(filterNormalized.toLowerCase()) || nameNormalized.toLowerCase().includes(filterNormalized.toLowerCase())) {
                return true;
            }
        }

        return false; // Ninguna coincidencia encontrada
    });



    // Función para normalizar días
    function normalizeDay(day) {
        return day.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    // Función de filtrado
    FilterService.register(ARRAY_CONTAINS_ANY.value, (value, filter) => {
        
        if (!filter || filter.length === 0) {
            return true; // Si no hay filtro, mostrar todos
        }
        if (!value || value.length === 0) {
            return false; // No hay valores para comparar
        }

        // Normalizar y traducir los días del filtro
        const normalizedFilter = filter.map(day => translateDayToEnglish(day));
        
        // Checar las llaves
        // const numDias = Object.keys(value).length;
        // Comprobar si algún día del filtro coincide con los días en los valores
        
        for (let i = 0; i < normalizedFilter.length; i++) {
            const filterDay = normalizedFilter[i];
            for (let j = 0; j < Object.keys(value).length; j++) {
                const dayArrays = Object.keys(value); // Obtener los nombres de los arrays (días)
                for (let k = 0; k < dayArrays.length; k++) {
                    const dayArray = dayArrays[k];
                    const dayNorm = normalizeDay(dayArray);
                    if (dayNorm === filterDay) {
                        return true; // Al menos un día coincide, mostrar este valor
                    }
                }
            }
        }

        return false; // Ningún día coincide
    });
});

// const getSeverity = (status) => {
//     switch (status) {
//         case 'Remota':
//             return 'success';
//         case 'Presencial':
//             return 'info';
//         case 'Hibrido':
//             return 'warning';
//         case 'renewal':
//             return null;
//     }
// }

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

const onRowSelect = (event) => {
    router.push(`/mae/${event.data.uid}`);
}

</script>


<template>
    <h1 class="text-black text-6xl font-bold mb-5 text-center sm:text-left">Horarios</h1>
    <div class="card mb-0">
        <Tag icon="pi pi-info-circle" severity="warning" value="Cambia al modo horizontal para usar los filtros" class="sm:hidden text-center"></Tag>
    <!-- TODO: Adjust row sizing -->
    <!-- TODO: implement responsive resizing -->
        <DataTable v-model:filters="filters" :value="maes" paginator :rows="10" dataKey="id" filterDisplay="row"
            :loading="loading" :globalFilterFields="['name', 'horario', 'subjects'/*, 'modalidad'*/]" class="border-round-xl"
            @rowSelect="onRowSelect" selectionMode="single" responsiveLayout="stack" breakpoint="640px">
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
            <Column header="Nombre" field="name" :showFilterMenu="false" style="min-width: 15rem">
                <template #body="{ data }">
                    <p class="md:text-lg md:font-semibold md:text-left text-right">{{ data.name }}</p>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter w-full"
                        placeholder="Nombre" />
                </template>
            </Column>
            <Column header="Materias" filterField="subjects" :showFilterMenu="false" style="min-width: 14rem">
                <template #body="{ data }">
                    <div class="flex flex-wrap justify-content-evenly column-gap-2 row-gap-2 ml-2 md:ml-0">
                        <Tag class="md:text-md text-xs text-center w-full md:w-fit" :class="getSubjectColor(item.area)"
                            :value="item.name" v-tooltip.top="item.id" rounded v-for="item in data.subjects"/>
                    </div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" @input="filterCallback()" 
                        class="p-column-filter" placeholder="Materia " />
                </template>
            </Column>


            <Column header="Horario" filterField="weekSchedule" :showFilterMenu="false" :filterMenuStyle="{ width: '2rem' }"
                style="min-width: 6rem">
                <template #body="{ data }">
                    <!-- TODO: ask for hour display implementation -->
                    <div class="flex flex-wrap justify-content-evenly column-gap-2 row-gap- ml-2 md:ml-0">
                        <Tag v-for="(value, key) in data.weekSchedule" class="text-md mx-auto"
                         :class="getDayColor(key)" :value="translateDayToSpanish(key)" v-tooltip.top="
                          value[0].start ? `${value[0].start} - ${value[0].end}` : value.toString()"
                           rounded style="min-width: 3rem"/>
                       
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
            <!-- <Column field="modalidad" header="Modalidad" :showFilterMenu="false" :filterMenuStyle="{ width: '6rem' }"
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
            </Column> -->
        </DataTable>
    </div>
</template>
