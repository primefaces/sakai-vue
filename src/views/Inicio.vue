<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'; 
import { getCurrentUser, getUser, startActiveSession, stopActiveSession,updatePoints } from '../firebase/db/users';
import { useToast } from 'primevue/usetoast';
import { getSubjects } from '../firebase/db/subjects';
import { addAsesoria,getAsesoriasByUidAndRating,
  updateAsesoria} from '../firebase/db/asesorias';
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
const router = useRouter(); 
const showDialogAsesoria = ref(false);
const ratingAsesoria = ref(null);
const comentarioAsesoria = ref('');
const materiaAsesoria = ref(null)
const maeAsesoria = ref(null)
const subjects = ref([]);
const anuncios = ref([]);
const currentAnuncio = ref({});
const currentIndex = ref(-1);
const isSavingAsesoria = ref(false);
const evalInfo = ref(null);
const showDialogEvaluacion = ref(false);

onMounted(async () => {
  userInfo.value = await getCurrentUser();
  maeInfo.value = await getMaes()
  subjects.value = await getSubjects();
  anuncios.value  = await  getAnnouncements()
  evalInfo.value = await getAsesoriasByUidAndRating(  userInfo.value.uid,);
  nextAnuncio()
  autoAdvance();
});

const startSession = async () => {
  try {
    await startActiveSession(userInfo.value.uid, userInfo.value, location.value);
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
      toast.add({ severity: 'success', summary: 'Se ha cerrado el turno con éxito', detail: `${res.differenceInMinutes} minutos registrados`, life: 3000 });
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
  } else {
    currentIndex.value = 0;
  }
  currentAnuncio.value = anuncios.value[currentIndex.value];
};

const prevAnuncio = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  } else {
    currentIndex.value = anuncios.value.length - 1; // Regresa al último anuncio
  }
  currentAnuncio.value = anuncios.value[currentIndex.value];
};

const autoAdvance = () => {
  setInterval(() => {
    nextAnuncio();
  }, 5000);
};

const saveAsesoria = async () => {
  if (isSavingAsesoria.value) return; 
  isSavingAsesoria.value = true; 
  toast.add({ severity: 'info', summary: 'Guardando cambios', detail: 'Se está registrando la asesoría', life: 3000 });

  try {
    if (maeAsesoria.value.name === userInfo.value.name) {
      isSavingAsesoria.value = false;
      return toast.add({ severity: 'error', summary: 'Error', detail: 'No puedes registrarte una asesoría a ti mismo' });
    }
    await addAsesoria(maeAsesoria.value, userInfo.value, materiaAsesoria.value, comentarioAsesoria.value, ratingAsesoria.value);
    toast.add({ severity: 'success', summary: 'Guardado exitoso', detail: 'La asesoría se registró con éxito', life: 3000 });
    ratingAsesoria.value = null;
    comentarioAsesoria.value = '';
    materiaAsesoria.value = null;
    maeAsesoria.value = null;
  } catch (error) {
    console.log(error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al tratar de registrar la asesoría' });
  } finally {
    isSavingAsesoria.value = false; 
    showDialogAsesoria.value = false;
  }
};

const goToAsesoria = async (asesoria) => {
  if (!asesoria || !asesoria.id) return; 

  try {
    toast.add({ severity: 'info', summary: 'Navegando', detail: 'Dirigiendo a la asesoría grupales ', life: 3000 });
    
    await router.push({ 
      name: 'asesoriasGrupales', 
      query: { asesoriaId: asesoria.id }
    });
    
    toast.add({ severity: 'success', summary: 'Navegación exitosa', detail: 'Has sido dirigido a la asesoría grupales', life: 3000 });
  } catch (error) {
    console.log(error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al intentar navegar a la asesoría' });
  }
};

const formattedEvaluations = () => {
  return evalInfo.value.map(asesoria => {
    const peerName = asesoria.peerInfo && asesoria.peerInfo.name ? asesoria.peerInfo.name : 'Desconocido';
    const formattedDate = asesoria.date ? formatDate(asesoria.date) : 'Fecha no disponible';

    return {
      id: asesoria.id,
      label: `${formattedDate} - ${peerName}`,
    };
  });
};

const selectedAsesoria = ref(null); 

const guardarEvaluacion = async () => {
  if (!selectedAsesoria.value) {
    toast.add({ severity: 'warn', summary: 'Asesoría no seleccionada', detail: 'Selecciona una asesoría antes de guardar', life: 3000 });
    return;
  }
  if (ratingAsesoria.value === null ) {
    toast.add({ severity: 'warn', summary: 'Debes llenar la evaluación', detail: 'Selecciona una asesoría antes de guardar', life: 3000 });
    return;
  }
  
    await updateAsesoria(selectedAsesoria.value, {
      comment: comentarioAsesoria.value,
      rating: ratingAsesoria.value,
    });
    if(ratingAsesoria.value > 3){
      await updatePoints(maeInfo.value.uid, ratingAsesoria.value * 5)
      if(comentarioAsesoria.value !== ""){
        await updatePoints(maeInfo.value.uid, 25)
      }
    }

    ratingAsesoria.value = null;
    comentarioAsesoria.value = '';
    selectedAsesoria.value = null;
    evalInfo.value = await getAsesoriasByUidAndRating(userInfo.value.uid);
    toast.add({
      severity: 'success',
      summary: 'Guardado exitoso',
      detail: 'La evaluación se registró con éxito',
      life: 3000,
    });
  
};

</script>


<template>
    
  <div> 
      <div v-if="userInfo">
          <h1 class="text-black text-6xl font-bold mb-5 text-center sm:text-left">¡Bienvenid@, {{ userInfo.firstname }}!</h1>
      </div>

      <div class="flex flex-column md:flex-row md:gap-4   w-full  ">
        <Button
          class="p-button-help p-button-lg py-4 w-full md:w-5 text-white  border-round-3xl  mb-3 text-2xl font-bold flex justify-content-center align-items-center border-none	"
          :style="{ background: 'linear-gradient(to right, #4466A7, #51A3AC)' }"
          @click="showDialogAsesoria = true"
          :disabled=" isSavingAsesoria" 
        >
            Registrar asesoría
            <img src="/assets/mentoring.svg" class="ml-4" alt="mentoring icon" style="width: 3.0rem; height: 3.0rem;" />
        </Button>

        
          <Button
            class="p-button-help p-button-lg py-4 w-full md:w-5 text-white  border-round-3xl  mb-3 text-2xl font-bold flex justify-content-center align-items-center border-none	"
            :style="{ background: 'linear-gradient(to right, #44A79b, #69ac51)' }"
            @click="showDialogEvaluacion = true"
            :disabled=" isSavingAsesoria" 
          >
              Evaluar asesoría
              <img src="/assets/evaluate.svg" class="ml-4" alt="mentoring icon" style="width: 2.0rem; height: 2.0rem;" />
          </Button>

      </div>
      <div class="flex flex-column md:flex-row md:gap-4   w-full  ">
        <!-- <Button
              v-if="maeInfo  && userInfo && userInfo.role !== 'user'"
              label="Solicitar asistencia" 
              icon="pi pi-question-circle" 
              class="border-none p-button-warn p-button-lg py-4 w-full md:w-5   mb-3 text-2xl"
              :style="{borderRadius: '15px',background: 'linear-gradient(to right, #CC7722, #DAA520)',color: '#fff', border: 'none'}"
              iconPos="right"
            /> -->
            
            <Button 
                v-if="maeInfo && userInfo && userInfo['activeSession']  && userInfo && userInfo.role !== 'user'"
                class="p-button-help p-button-lg py-4 w-full md:w-5 text-white  border-round-3xl  mb-5 text-2xl font-bold flex justify-content-center align-items-center border-none	"
                :style="{ background: 'linear-gradient(to right, #4466A7, #A073BB)' }"
                @click="stopSession"
            >
                Finalizar turno
                <img src="/assets/end.svg" class="ml-4" alt="mentoring icon" style="width: 3.0rem; height: 3.0rem;" />
            </Button>

            <Button 
                v-else-if="maeInfo && userInfo && userInfo.role !== 'user'"
                class="p-button-help p-button-lg py-4 w-full md:w-5 text-white  border-round-3xl  mb-5 text-2xl font-bold flex justify-content-center align-items-center border-none	"
                :style="{ background: 'linear-gradient(to right, #A74497, #D8899C)',  }"
                @click="showDialogSession = true"
            >
                Iniciar turno
                <img src="/assets/start.svg" class="ml-4" alt="mentoring icon" style="width: 3.0rem; height: 3.0rem;" />
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
            <h2 v-if="currentAnuncio.type === 'Asesoría'" class="text-white text-3xl font-bold text-center m-auto mb-2">Asesorías grupales</h2>
            <p v-if="currentAnuncio.type === 'Asesoría'" class="font-medium ml-5 text-xl mb-1" >
              Materia: {{ currentAnuncio.subject.name }}
            </p>
            <p v-if="currentAnuncio.type === 'Asesoría'" class="font-medium ml-5 text-xl mb-1">
              Fecha: {{ formatDate(currentAnuncio.dateTime) }}, {{ formatTime(currentAnuncio.startTime, false) }} - {{ formatTime(currentAnuncio.endTime, true) }}
            </p>
            <p v-if="currentAnuncio.type === 'Asesoría'" class="font-medium ml-5 text-xl mb-1">
              Ubicación: {{ currentAnuncio.location }}
            </p>

            <h2 v-if="currentAnuncio.type !== 'Asesoría' " class="text-white text-3xl font-bold m-auto text-center mb-2">
              {{ currentAnuncio.title }}
            </h2>
            <p v-if="currentAnuncio.type !== 'Asesoría'" class="font-medium ml-5 text-xl">
              {{ currentAnuncio.description }}
            </p>

            <p v-if="currentAnuncio.type === 'Asesoría'" 
              class="text-white text-2xl font-bold ml-5 text-right mr-5 cursor-pointer"
              @click="goToAsesoria(currentAnuncio)">
              Pre-registro <i class="pi pi-arrow-right text-3xl font-bold"></i>
            </p>
            
            <a :href="`#/asesoriasGrupales`" class="no-blue-link">
              <p v-if="currentAnuncio.type !== 'Asesoría' && currentAnuncio.type !== 'otro'"  class="text-white text-2xl font-bold ml-5 text-right mr-5 ">
                Saber más <i class="pi pi-arrow-right text-3xl font-bold "></i>
              </p>  
            </a>
           
          </div>

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


  <Dialog v-model:visible="showDialogEvaluacion" modal class="md:w-4 border-round-lg shadow-2">
  <template #header>
    <div class="flex align-items-center justify-content-center text-center h-0.5rem m-auto">
      <p class="text-2xl font-bold mr-2 mt-3">Evaluar Mae </p>
    </div>
  </template>
    <div v-if="evalInfo && evalInfo.length">
      <p class="font-bold text-2xl">Asesoría</p>

      <Dropdown 
        v-model="selectedAsesoria" 
        :options="formattedEvaluations()"
        optionLabel="label"
        optionValue="id"
        placeholder="Selecciona una asesoría"
        class="w-full mb-3"
      />

      <p class="font-bold mt-3 text-2xl">Comentarios</p>
      <Textarea 
        v-model="comentarioAsesoria" 
        placeholder="Agrega un comentario" 
        autoResize 
        rows="5" 
        class="w-full border-round-lg p-inputtext-lg" 
      />

      <p class="font-bold mt-3 text-2xl">Evaluación</p>
      <div class="flex justify-content-center  ">
        <Rating 
          v-model="ratingAsesoria" 
          :cancel="false" 
        />
      </div>
    </div>
    
    <div v-else class="text-center p-4">
      <p class="text-gray-600 font-bold">Sin asesorías para evaluar</p>
    </div>
    <template #footer v-if="evalInfo && evalInfo.length">
      <div class="flex justify-content-end mt-4">
        <Button 
          label="Confirmar" 
          @click="guardarEvaluacion" 
           :style="{ background: 'linear-gradient(to right, #44a79b, #69ac51)' }"
        />
        <Button 
          label="Cancelar" 
          class="p-button-text mr-2" 
          @click="showDialogEvaluacion = false"
        />
       
      </div>
    </template>
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
  .botones{
    margin-top: auto;
  }
}

.no-blue-link {
    color: inherit;
    text-decoration: none;
}

.no-blue-link:visited {
    color: inherit;
}

.no-blue-link:hover {
    color: inherit;
}

.no-blue-link:active {
    color: inherit;
}
</style>