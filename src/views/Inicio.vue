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
    toast.add({ severity: 'success', summary: 'Inicio de turno exitoso', life: 3000 });
    userInfo.value = await getCurrentUser();
    maeInfo.value = await getUser(userInfo.value.uid);
    showDialogSession.value = false;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Ocurrió un error al tratar de iniciar turno', detail: 'Consulta con un administrador de la página', life: 3000 });
  }
};

const stopSession = async () => {
  try {
    const res = await stopActiveSession(userInfo.value.uid);
    if (!res.activeSessionDeleted) {
      if (res.timeLimitExceded) {
        toast.add({ severity: 'error', summary: `Excediste el límite de tiempo de tu turno (${Math.round((res.differenceInMinutes / 60) * 100) / 100} horas)`, detail: 'Consulta a un coordinador para reponer las horas' });
      } else {
        throw new Error("Active session was not deleted");
      }
    } else {
      toast.add({ severity: 'success', summary: 'turno cerrada con éxito', detail: `${res.differenceInMinutes} minutos registrados`, life: 3000 });
    }
    userInfo.value = await getCurrentUser();
    maeInfo.value = await getUser(userInfo.value.uid);
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Ocurrió un error al tratar de cerrar turno', detail: 'Consulta con un administrador de la página', life: 3000 });
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
          class="p-button-help p-button-lg py-4 w-full md:w-5 text-white  border-round-3xl  mb-4 text-2xl font-bold flex justify-content-center align-items-center"
          :style="{ background: 'linear-gradient(to right, #4466A7, #51A3AC)' }"
          @click="showDialogAsesoria = true"
        >
            Registrar asesoría
            <img src="/assets/mentoring.svg" class="ml-2" alt="mentoring icon" style="width: 2.5rem; height: 2.5rem;" />
        </Button>

          <!-- <Button 
              label="Evaluar asesoria" 
              icon="pi pi-star" 
              class="p-button-success p-button-lg py-4 w-full md:w-5  mb-4 text-2xl"
              :style="{ borderRadius: '15px', background: 'linear-gradient(to right, #00b09b, #96c93d)', color: '#fff', border: 'none' }"
              iconPos="right"
          /> -->
        
            <!-- <Button
              v-if="maeInfo  && userInfo && userInfo.role !== 'user'"
              label="Solicitar asistencia" 
              icon="pi pi-question-circle" 
              class="p-button-warn p-button-lg py-4 w-full md:w-5   mb-4 text-2xl"
              :style="{borderRadius: '15px',background: 'linear-gradient(to right, #CC7722, #DAA520)',color: '#fff', border: 'none'}"
              iconPos="right"
            /> -->
            
            <Button 
                v-if="maeInfo && userInfo && userInfo['activeSession']  && userInfo && userInfo.role !== 'user'"
                class="p-button-help p-button-lg py-4 w-full md:w-5 text-white  border-round-3xl  mb-4 text-2xl font-bold flex justify-content-center align-items-center"
                :style="{ background: 'linear-gradient(to right, #4466A7, #A073BB)' }"
                @click="stopSession"
            >
                Finalizar turno
                <img src="/assets/end.svg" class="ml-2" alt="mentoring icon" style="width: 2.5rem; height: 2.5rem;" />
            </Button>


            <Button 
                v-else-if="maeInfo && userInfo && userInfo.role !== 'user'"
                class="p-button-help p-button-lg py-4 w-full md:w-5 text-white  border-round-3xl  mb-4 text-2xl font-bold flex justify-content-center align-items-center"
                :style="{ background: 'linear-gradient(to right, #A74497, #D8899C)',  }"
                @click="showDialogSession = true"
            >
                Iniciar turno
                <img src="/assets/start.svg" class="ml-2" alt="mentoring icon" style="width: 2.5rem; height: 2.5rem;" />
            </Button>

      </div>
    
      <div class="flex flex-wrap border-round-3xl text-white md:h-16rem" :style="{ background: 'linear-gradient(to right, #779AC4, #29AB93)' }">
        <div class="relative w-full md:w-4 border-round-left-3xl">
          <span class="overlay">
            <Button
              label="◀"
              class="text-xl border-none bg-transparent btn-left hidden lg:block absolute top-1/2 transform -translate-y-1/2"
              @click="prevAnuncio"
            />
            <span v-if="currentAnuncio.imageUrl">
              <img
                class="w-full h-16rem clip-diagonal border-round-top-3xl md:border-round-left-3xl"
                :src="currentAnuncio.imageUrl"
              />
            </span>
          </span>
        </div>

        <div class="w-full md:w-8 text-center p-4 flex justify-between items-center">
          <div class="grid place-content-center lg:hidden">
            <Button
              label="◀"
              class="m-0 p-0 text-xl border-none bg-transparent"
              @click="prevAnuncio"
            />
          </div>

          <div class="flex-1 text-left">
            <!-- Contenido del anuncio -->
            <h2 v-if="currentAnuncio.type === 'Asesoría'" class="text-white text-3xl font-bold text-center m-auto mb-2">Asesorías Grupales</h2>
            <p v-if="currentAnuncio.type === 'Asesoría'" class="font-medium ml-5 text-xl mb-1">
              Materia: {{ currentAnuncio.subject.name }}
            </p>
            <p v-if="currentAnuncio.type === 'Asesoría'" class="font-medium ml-5 text-xl mb-1">
              Fecha: {{ formatDate(currentAnuncio.dateTime) }}, {{ formatTime(currentAnuncio.startTime, false) }} - {{ formatTime(currentAnuncio.endTime, true) }}
            </p>
            <p v-if="currentAnuncio.type === 'Asesoría'" class="font-medium ml-5 text-xl mb-1">
              Ubicación: {{ currentAnuncio.location }}
            </p>

            <!-- Otros tipos de anuncios -->
            <h2 v-if="currentAnuncio.type !== 'Asesoría'" class="text-white text-3xl font-bold m-auto text-center mb-2">
              {{ currentAnuncio.title }}
            </h2>
            <p v-if="currentAnuncio.type !== 'Asesoría'" class="font-medium ml-5 text-xl">
              {{ currentAnuncio.description }}
            </p>

            <!-- Pre-registro -->
            <!-- <p v-if="currentAnuncio.type === 'Asesoría'" class="text-white text-2xl font-bold ml-5 text-right mr-5">
              Pre-registro <i class="pi pi-arrow-right text-2xl font-bold"></i>
            </p>

            <p v-if="currentAnuncio.type === 'Especial'" class="text-white text-2xl font-bold ml-5 text-right mr-5">
              Saber más <i class="pi pi-arrow-right text-2xl font-bold"></i>
            </p> -->
          </div>

          <!-- Botón derecho alineado al fondo -->
          <div class="grid place-content-center md:mr-2 ml-2">
            <Button
              label="▶"
              class="m-0 p-0 text-xl border-none bg-transparent"
              @click="nextAnuncio"
            />
          </div>
        </div>
</div>

  </div>

  <Dialog v-model:visible="showDialogSession" modal header="Iniciar turno" class="md:w-4">
    <label for="location">Por favor indica donde te encuentras</label>
    <InputText id="text" v-model="location" placeholder="Biblioteca Piso 3" class="w-full mb-4"/>
    <div class="flex justify-content-end gap-2">
      <Button type="button" label="Cerrar" severity="secondary" @click="showDialogSession = false"></Button>
      <Button type="button" label="Iniciar turno" :disabled="location === ''" @click="startSession"></Button>
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