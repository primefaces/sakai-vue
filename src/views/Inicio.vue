<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'; // Importa el router
import { getCurrentUser, getUser, startActiveSession, stopActiveSession } from '../firebase/db/users';
import { useToast } from 'primevue/usetoast';
import { getSubjects } from '../firebase/db/subjects';
import { addAsesoria} from '../firebase/db/asesorias';
import { getMaes} from '@/firebase/db/users';
import { getAnnouncements } from '@/firebase/db/annoucement'; 
import {
  formatDate,
  formatTime
} from '@/utils/AnunciosUtils';

const userInfo = ref(null);
const maeInfo = ref(null);
const toast = useToast();
const showDialogSession = ref(false);
const location = ref('Biblioteca Piso 3');
const router = useRouter(); // Accede al router
const showDialogAsesoria = ref(false);
const ratingAsesoria = ref(null);
const comentarioAsesoria = ref('');
const materiaAsesoria = ref(null)
const maeAsesoria = ref(null)
const subjects = ref([]);
const anuncios = ref([]);
const currentAnuncio = ref({});
const currentIndex = ref(-1);


onMounted(async () => {
  userInfo.value = await getCurrentUser();
  maeInfo.value = await getMaes()
  subjects.value = await getSubjects();
  anuncios.value  = await  getAnnouncements()
  nextAnuncio()
  
  if (userInfo.value.role === 'user' || userInfo.value.status === 'estudiante') {
    router.push('maesActivos' ); // Redirige a la página 'maesActivos'
  }
});

const startSession = async () => {
  try {
    const res = await startActiveSession(userInfo.value.uid, userInfo.value, location.value);
    toast.add({ severity: 'success', summary: 'Inicio de sesión exitoso', life: 3000 });
    userInfo.value = await getCurrentUser();
    maeInfo.value = await getUser(userInfo.value.uid);
    showDialogSession.value = false;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Ocurrió un error al tratar de iniciar sesión', detail: 'Consulta con un administrador de la página', life: 3000 });
  }
};

const stopSession = async () => {
  try {
    const res = await stopActiveSession(userInfo.value.uid);
    if (!res.activeSessionDeleted) {
      if (res.timeLimitExceded) {
        toast.add({ severity: 'error', summary: `Excediste el límite de tiempo de tu sesión (${Math.round((res.differenceInMinutes / 60) * 100) / 100} horas)`, detail: 'Consulta a un coordinador para reponer las horas' });
      } else {
        throw new Error("Active session was not deleted");
      }
    } else {
      toast.add({ severity: 'success', summary: 'Sesión cerrada con éxito', detail: `${res.differenceInMinutes} minutos registrados`, life: 3000 });
    }
    userInfo.value = await getCurrentUser();
    maeInfo.value = await getUser(userInfo.value.uid);
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Ocurrió un error al tratar de cerrar sesión', detail: 'Consulta con un administrador de la página', life: 3000 });
  }
};


const nextAnuncio = () => {
  if (currentIndex.value < anuncios.value.length - 1) {
    currentIndex.value++;
    currentAnuncio.value = anuncios.value[currentIndex.value];
  }
};

const prevAnuncio = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    currentAnuncio.value = anuncios.value[currentIndex.value];
  }
};
const saveAsesoria = async () => {
  toast.add({ severity: 'info', summary: 'Guardando cambios', detail: 'Se está registrando la asesoría', life: 3000 });
  try {
    console.log(maeAsesoria.value, userInfo.value, materiaAsesoria.value, comentarioAsesoria.value, ratingAsesoria.value,"Papa")
    if(maeAsesoria.value.name === userInfo.value.name){
      return toast.add({ severity: 'error', summary: 'Error', detail: 'No puedes registrarte una asesoría a ti mismo' });
    }
    await addAsesoria(maeAsesoria.value, userInfo.value, materiaAsesoria.value, comentarioAsesoria.value, ratingAsesoria.value); 
    toast.add({ severity: 'success', summary: 'Guardado exitoso', detail: 'La asesoría se registró con éxito', life: 3000 });
    ratingAsesoria.value = null;
    comentarioAsesoria.value = '';
    materiaAsesoria.value = null;
    maeAsesoria.value = null
  } catch (error) {
    console.log(error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al tratar de registrar la asesoría' });
  }
  showDialogAsesoria.value = false;  
  
}

</script>


<template>
    
  <div> 
      <div v-if="userInfo">
          <h1 class="text-black text-6xl font-bold mb-5 text-center sm:text-left">¡Bienvenid@, {{ userInfo.firstname }}!</h1>
      </div>

      <div class="flex flex-column md:flex-row md:gap-4   w-full  ">
          <Button 
              label="Registrar Asesoria" 
              icon="pi pi-pencil"
              class="p-button-help p-button-lg py-4 w-full md:w-5 text-white  border-round-3xl  mb-4"
              :style="{ background: 'linear-gradient(to right, #4466A7, #51A3AC)' }"
              iconPos="right"
              @click="showDialogAsesoria = true" 
          />

          <!-- <Button 
              label="Evaluar Asesoria" 
              icon="pi pi-star" 
              class="p-button-success p-button-lg py-4 w-full md:w-5  mb-4"
              :style="{ borderRadius: '15px', background: 'linear-gradient(to right, #00b09b, #96c93d)', color: '#fff', border: 'none' }"
              iconPos="right"
          /> -->
        
            <!-- <Button
              v-if="maeInfo  && userInfo && userInfo.role !== 'user'"
              label="Solicitar Asistencia" 
              icon="pi pi-question-circle" 
              class="p-button-warn p-button-lg py-4 w-full md:w-5   mb-4"
              :style="{borderRadius: '15px',background: 'linear-gradient(to right, #CC7722, #DAA520)',color: '#fff', border: 'none'}"
              iconPos="right"
            /> -->

            <Button 
                v-if="maeInfo && userInfo && userInfo['activeSession']  && userInfo && userInfo.role !== 'user'"
                label="Finalizar turno"
                icon="pi pi-pause" 
                class="p-button-help p-button-lg py-4 w-full md:w-5 text-white  border-round-3xl  mb-4"
                :style="{ background: 'linear-gradient(to right, #4466A7, #A073BB)' }"
                iconPos="right"
                @click="stopSession"
            />
          
            <Button
                v-else-if="maeInfo && userInfo && userInfo.role !== 'user'"
                label="Iniciar turno"
                icon="pi pi-send"
                class="p-button-help p-button-lg py-4 w-full md:w-5 text-white  border-round-3xl  mb-4"
                :style="{ background: 'linear-gradient(to right, #A74497, #D8899C)',  }"
                iconPos="right"
                @click="showDialogSession = true"
            />

      </div>
    
      <div class="flex flex-wrap border-round-3xl text-white h-16rem" :style="{ background: 'linear-gradient(to right, #779AC4, #29AB93)' }">
      <div class="relative w-full md:w-4 border-round-left-3xl">
        <span class="overlay">
          <Button
            label="◀"
            class="text-xl border-none bg-transparent btn-left hidden lg:block"
            @click="prevAnuncio"
          />
          <img
            class="w-full h-16rem clip-diagonal border-round-top-3xl md:border-round-left-3xl arrow"
            :src="currentAnuncio.imageUrl"
          />
        </span>
      </div>

      <div class="w-full md:w-8 text-center p-4 flex gap-5">
        <div class="w-1 grid grid-cols-1 place-content-center lg:hidden mt-1">
          <Button
            label="◀"
            class="m-0 p-0 text-xl border-none bg-transparent mt-1 ml-2"
            @click="prevAnuncio"
          />
        </div>

        <div>
          <h2 v-if="currentAnuncio.type === 'Asesoría'" class="text-white text-3xl font-bold">
            Asesorías Grupales
          </h2>
          <p v-if="currentAnuncio.type === 'Asesoría'" class="font-medium text-left ml-5 text-xl">
            Materia: {{ currentAnuncio.subject.name }}
          </p>
          <p v-if="currentAnuncio.type === 'Asesoría'" class="font-medium text-left ml-5 text-xl">
            Fecha: {{ formatDate(currentAnuncio.dateTime) }}, {{ formatTime(currentAnuncio.startTime, false) }} - {{ formatTime(currentAnuncio.endTime, true) }}
          </p>
          <p v-if="currentAnuncio.type === 'Asesoría'" class="font-medium text-left ml-5 text-xl">
            Ubicación: {{ currentAnuncio.location }}
          </p>

          <h2 v-if="currentAnuncio.type === 'Otro'" class="text-white text-3xl font-bold">
            {{ currentAnuncio.title }}
          </h2>
          <p v-if="currentAnuncio.type === 'Otro'" class="font-medium text-left ml-5 text-xl">
            {{ currentAnuncio.description }}
          </p>
          <h2 v-if="currentAnuncio.type === 'Especial'" class="text-white text-3xl font-bold">
            {{ currentAnuncio.title }}
          </h2>
          <p v-if="currentAnuncio.type === 'Especial'" class="font-medium text-left ml-5 text-xl">
            {{ currentAnuncio.description }}
          </p>
          <!-- <p v-if="currentAnuncio.type === 'Asesoría'" class="text-white text-2xl font-bold text-right text-left ml-5">
            Pre-registro <i class="pi pi-arrow-right text-2xl font-bold"></i>
          </p> -->
          <!-- <p v-if="currentAnuncio.type === 'Especial'" class="text-white text-2xl font-bold text-right text-left ml-5">
            Saber más <i class="pi pi-arrow-right text-2xl font-bold"></i>
          </p> -->
        </div>
        <div class="mt-1 grid grid-cols-1 place-content-center mr-2">
          <Button
            label="▶"
            class="m-0 p-0 text-xl border-none bg-transparent"
            @click="nextAnuncio"
          />
        </div>

      </div>
    </div>
  </div>

  <Dialog v-model:visible="showDialogSession" modal header="Iniciar sesión" class="md:w-4">
    <label for="location">Por favor indica donde te encuentras</label>
    <InputText id="text" v-model="location" placeholder="Biblioteca Piso 3" class="w-full mb-4"/>
    <div class="flex justify-content-end gap-2">
      <Button type="button" label="Cerrar" severity="secondary" @click="showDialogSession = false"></Button>
      <Button type="button" label="Iniciar sesión" :disabled="location === ''" @click="startSession"></Button>
    </div>
  </Dialog>
  
  <Dialog v-model:visible="showDialogAsesoria" modal header="Registrar asesoría" class="md:w-4">
    
    <p class="font-bold">Mae</p>
    <Dropdown v-model="maeAsesoria" :options="maeInfo" filter optionLabel="name" placeholder="Mae" checkmark :highlightOnSelect="false" class="w-12 mb-2" />

    <p class="font-bold">Materia</p>
    <Dropdown v-model="materiaAsesoria" :options="subjects" filter optionLabel="name" placeholder="Materia" checkmark :highlightOnSelect="false" class="w-12 mb-2" />

    <div class="flex justify-content-end gap-2">
      <Button type="button" label="Cerrar" severity="secondary" @click="showDialogAsesoria = false"></Button>
      <Button type="button" label="Confirmar registro" :disabled="!(materiaAsesoria !== null)" @click="saveAsesoria"></Button>
    </div>
  </Dialog>

</template>



<style scoped>
@media (min-width: 968px) {
  .btn-left {
    position: absolute;
    top: 40%;
    left: 0;
    z-index: 10; 
    color: white; 
    
  }
  .arrow{
    filter: brightness(0.8);
  }

  .clip-diagonal {
    clip-path: polygon(0 0, 85% 0, 100% 100%, 0 100%);
    
  }
}
</style>