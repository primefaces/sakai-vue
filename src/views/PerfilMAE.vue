<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getUser, updateUserSubjects, updateUserSchedule } from '../firebase/db/users';
import { getSubjects } from '../firebase/db/subjects';
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const route = useRoute();

const userInfo = ref(null);

const showMoreTags = ref(false);

const filteredSubjects = computed(() => {
  console.log(userInfo.value.subjects)
  if (userInfo.value) {
    return userInfo.value.subjects.filter(
      subject => 
      subject.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      || subject.id.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  return []
});

const searchQuery = ref('');
const horario = [
  ["11:00", "11:00", "11:00", "11:00", "11:00"],
  ["12:00", "12:00", "12:00", "12:00", "12:00"],
];

const showExtraTime = ref(false)

const showDialogHorarios = ref(false);

const showDialogMaterias = ref(false);
const subjects = ref([]);
const selectedSubjects = ref([]);
const subjectTableFilter = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const saveSubjectChanges = async () => {
  toast.add({ severity: 'info', summary: 'Guardando cambios', detail: 'Se están guardando los cambios en tus materias', life: 3000 });
  try {
   await updateUserSubjects(userInfo.value.uid, selectedSubjects.value); 
   userInfo.value = await getUser(route.params.id);
   toast.add({ severity: 'success', summary: 'Guardado exitoso', detail: 'Los cambios en tus materias se guardaron con éxito', life: 3000 });
  } catch (error) {
    console.log(error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al tratar de guardar los cambios' });
  }
  showDialogMaterias.value = false;  
  
}

const newSchedule = ref({});

const daysArray = [
  { en: 'monday', es: 'Lunes' },
  { en: 'tuesday', es: 'Martes' },
  { en: 'wednesday', es: 'Miércoles' },
  { en: 'thursday', es: 'Jueves' },
  { en: 'friday', es: 'Viernes' }
];

const timeSlots = [
  { name: '09:00 AM', code: '09:00' },
  { name: '09:30 AM', code: '09:30' },
  { name: '10:00 AM', code: '10:00' },
  { name: '10:30 AM', code: '10:30' },
  { name: '11:00 AM', code: '11:00' },
  { name: '11:30 AM', code: '11:30' },
  { name: '12:00 PM', code: '12:00' },
  { name: '12:30 PM', code: '12:30' },
  { name: '01:00 PM', code: '13:00' },
  { name: '01:30 PM', code: '13:30' },
  { name: '02:00 PM', code: '14:00' },
  { name: '02:30 PM', code: '14:30' },
  { name: '03:00 PM', code: '15:00' },
  { name: '03:30 PM', code: '15:30' },
  { name: '04:00 PM', code: '16:00' },
  { name: '04:30 PM', code: '16:30' },
  { name: '05:00 PM', code: '17:00' },
  { name: '05:30 PM', code: '17:30' },
  { name: '06:00 PM', code: '18:00' }
];

const showExtraSlots = ref({
  'monday': false,
  'tuesday': false,
  'wednesday': false,
  'thursday': false,
  'friday': false
})

const addTimeSlot = (day, start, end) => {
  if (!newSchedule.value[day]) {
    newSchedule.value[day] = [{ start, end }]
  } else {
    newSchedule.value[day].push({ start, end })
  }
}

const saveScheduleChanges = async () => {
  toast.add({ severity: 'info', summary: 'Guardando cambios', detail: 'Se están guardando los cambios en tu horario', life: 3000 });
  try {
   await updateUserSchedule(userInfo.value.uid, newSchedule.value); 
   userInfo.value = await getUser(route.params.id);
   toast.add({ severity: 'success', summary: 'Guardado exitoso', detail: 'Los cambios en tus materias se guardaron con éxito', life: 3000 });
  } catch (error) {
    console.log(error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al tratar de guardar los cambios' });
  }
  showDialogHorarios.value = false;  
  
}

onMounted(async () => {
  userInfo.value = await getUser(route.params.id);
  selectedSubjects.value = userInfo.value.subjects
  subjects.value = await getSubjects();

  // JSON Parse es para que pase por valor en lugar de referencia
  newSchedule.value = JSON.parse(JSON.stringify(userInfo.value.weekSchedule));
})

</script>

<template>
  <div class="flex relative">
    <div class="flex-1">
      <h1 class="text-black text-6xl font-bold mb-5">Perfil</h1>
    </div>
    <div class="justify-end hidden md:block">
      <!-- <i class="pi pi-bell text-4xl"></i> -->
    </div>
  </div>

  <div v-if="userInfo" class="card mb-0">
    <div class="flex">
      <div class="flex flex-1">
        <img src="https://i.pinimg.com/originals/b1/44/f5/b144f535fb1878b7bdc57aedc14dfc24.jpg" alt="Foto de perfil" class="border-circle h-11rem w-11rem mr-5">
        <div>
          <p class="text-3xl font-bold"> {{ userInfo.name }} </p>
          <p class="text-lg font-medium"> <i class="pi pi-envelope font-medium"></i> {{ userInfo.email }} </p>
          <p class="text-lg font-medium"> <i class="pi pi-book font-medium"></i> {{ userInfo.career }} </p>
          <p class="text-lg font-medium"> <i class="pi pi-building font-medium"></i> Campus {{ userInfo.campus }} </p>
        </div>
      </div>
      <div class="justify-end space-x">
        <Button label="Materias" icon="pi pi-pencil" size="large"
          @click="showDialogMaterias = true" />
        <Button label="Horario" icon="pi pi-pencil" size="large"
          @click="showDialogHorarios = true" />
      </div>
    </div>
    <h2 class="font-bold"> Materias </h2>
    <div class="mb-2">
      <InputText v-model="searchQuery" placeholder="Buscar materia" class="p-mr-2 w-full" />
    </div>
    <div class="flex flex-wrap">
      <!-- Mostrar las primeras dos filas de etiquetas -->
        <Tag v-for="(subject, index) in filteredSubjects.slice(0, showMoreTags ? Infinity : 12)" v-tooltip.top="subject.name" :key="index" rounded class="text-lg font-semibold text-white mx-2 my-1 p-3">
          {{ subject.id }}
        </Tag>
        <Button v-if="userInfo.subjects.length > 12" @click="showMoreTags = !showMoreTags" :label="showMoreTags ? 'Mostrar menos' : 'Mostrar más'" 
          severity="secondary" rounded class="text-lg font-semibold text-white mx-2 my-1" :icon="showMoreTags ? 'pi pi-chevron-left' : 'pi pi-chevron-right'" iconPos="right" />
    </div>

    <hr />
    <h2 class="font-bold"> Horario </h2>

    <div>
      <div class="grid">
        <div v-for="day in daysArray" class="col">
          <div class="text-center p-3 border-round-sm bg-gray-200 text-xl font-bold">{{ day['es'] }} <Button v-if="userInfo.weekSchedule[day['en']] && userInfo.weekSchedule[day['en']].length > 1" @click="showExtraSlots[day['en']] = !showExtraSlots[day['en']]" :icon="showExtraSlots['wednesday'] ? 'pi pi-chevron-up' : 'pi pi-chevron-down'" class="text-sm h-1rem w-1rem ml-2"  severity="secondary" text rounded/></div>
            <div v-if="userInfo.weekSchedule[day['en']]" class="text-center p-3 border-round-sm bg-green-500 text-white text-xl font-bold mt-2"> {{ `${userInfo.weekSchedule[day['en']][0]['start']} - ${userInfo.weekSchedule[day['en']][0]['end']}` }} </div>
            <div v-else class="text-center p-3 border-round-sm bg-gray-100 text-black text-xl font-bold mt-2"> N/A </div>
            <div v-if="showExtraSlots[day['en']]" v-for="(slot, index) in userInfo.weekSchedule[day['en']].slice(1)" :key="`${day['en']}-${index}`" class="text-center p-3 border-round-sm bg-green-500 text-white text-xl font-bold mt-2">{{ `${slot['start']} - ${slot['end']}` }}</div>
        </div>
    </div>
    </div>
  </div>

  <!-- Dialogos -->

  <Dialog v-model:visible="showDialogHorarios" modal header="Editar horario" class="w-9">
    <div class="grid">
      <div v-for="day in daysArray" class="col-4">
        <div class="text-center p-3 border-round-sm bg-gray-200 text-xl font-bold mb-2">{{day['es']}} <Button @click="addTimeSlot(day['en'], '09:00', '10:00')" icon="pi pi-plus" class="text-sm h-1rem w-1rem ml-2"  severity="secondary" text rounded/></div>
        <span v-for="(slot, index) in newSchedule[day['en']]" :key="`editor-${day['en']}-${index}`" class="flex justify-content-around flex-wrap">
          <Dropdown v-model="newSchedule[day['en']][index]['start']" optionValue="code" :options="timeSlots" optionLabel="name" placeholder="Entrada" checkmark :highlightOnSelect="false" class="w-5 mb-2" />
          <Dropdown v-model="newSchedule[day['en']][index]['end']" optionValue="code" :options="timeSlots" optionLabel="name" placeholder="Salida" checkmark :highlightOnSelect="false" class="w-5 mb-2" />
          <Button @click="newSchedule[day['en']].splice(index, 1); newSchedule[day['en']] = newSchedule[day['en']] ?? []; console.log(newSchedule[day['en']])" icon="pi pi-times" severity="danger" text rounded aria-label="Cancel"  />
        </span>
      </div>
  </div>
    <div class="flex justify-content-end gap-2">
      <Button type="button" label="Cerrar" severity="secondary" @click="showDialogHorarios = false"></Button>
      <Button type="button" label="Guardar cambios " @click="saveScheduleChanges"></Button>
    </div>
  </Dialog>

  <Dialog v-model:visible="showDialogMaterias" modal header="Editar materias" class="w-9">
    <DataTable :value="subjects" tableStyle="min-width: 50rem" paginator :rows="10" :rowsPerPageOptions="[10, 25, 50, 100]"
    v-model:filters="subjectTableFilter"  :globalFilterFields="['id', 'name']"
    v-model:selection="selectedSubjects">
      <template #header>
        <InputText v-model="subjectTableFilter['global'].value" placeholder="Buscar materia" class="w-full" />
      </template>
      <template #empty> No se encontraron resultados. </template>
      <Column selectionMode="multiple" headerStyle="visibility:hidden"></Column>
      <Column field="id" header="Código"></Column>
      <Column field="name" header="Nombre"></Column>
      <Column field="semester" header="Semestre"></Column>
      <Column field="area" header="Area"></Column>
      <Column field="top" header="Top"></Column>
    </DataTable>
    <div class="flex justify-content-end gap-2">
      <Button type="button" label="Cerrar" severity="secondary" @click="showDialogMaterias = false"></Button>
      <Button type="button" label="Guardar cambios " @click="saveSubjectChanges"></Button>
    </div>
  </Dialog>
</template>

<style scoped>

/* Horizontal spacing utility class */
.space-x > * {
  margin-left: 1rem;
}

/* Vertical spacing utility class */
.space-y > * {
  margin-bottom: 1rem; 
}
</style>
