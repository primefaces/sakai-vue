<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'; // Importa el router
import { getCurrentUser, getUser, startActiveSession, stopActiveSession } from '../firebase/db/users';
import { useToast } from 'primevue/usetoast';

const userInfo = ref(null);
const maeInfo = ref(null);

const toast = useToast();
const showDialogSession = ref(false);
const location = ref('Biblioteca Piso 3');
const router = useRouter(); // Accede al router

onMounted(async () => {
  userInfo.value = await getCurrentUser();
  maeInfo.value = await getUser(userInfo.value.uid);

  // Verifica el rol o el estado del usuario y redirige si es necesario
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


// Agregar estos metodos mas adelante 
// const nextSlide() {
//       if (this.currentIndex < this.items.length - 1) {
//         this.currentIndex++;
//       }
//     }
// const   prevSlide() {
//       if (this.currentIndex > 0) {
//         this.currentIndex--;
//       }
</script>


<template>
    <Dialog v-model:visible="showDialogSession" modal header="Iniciar sesión" class="md:w-4">
    <label for="location">Por favor indica donde te encuentras</label>
    <InputText id="text" v-model="location" placeholder="Biblioteca Piso 3" class="w-full mb-4"/>
    <div class="flex justify-content-end gap-2">
      <Button type="button" label="Cerrar" severity="secondary" @click="showDialogSession = false"></Button>
      <Button type="button" label="Iniciar sesión" :disabled="location === ''" @click="startSession"></Button>
    </div>
  </Dialog>

    <div v-if="userInfo">
        <h1 class="text-black text-6xl font-bold mb-5 text-center sm:text-left">¡Bienvenid@, {{ userInfo.firstname }}!</h1>
    </div>

    <div class="flex flex-wrap gap-4 mb-4 w-full md:w-9">
        <!-- <Button 
            label="Registrar Asesoria" 
            icon="pi pi-pencil"
            class="p-button-info p-button-lg py-4 w-full md:w-5"
            :style="{ borderRadius: '15px', background: 'linear-gradient(to right, #3a7bd5, #00d2ff)', color: '#fff', border: 'none' }"
            iconPos="right"
        /> -->

        <!-- <Button 
            label="Evaluar Asesoria" 
            icon="pi pi-star" 
            class="p-button-success p-button-lg py-4 w-full md:w-5"
            :style="{ borderRadius: '15px', background: 'linear-gradient(to right, #00b09b, #96c93d)', color: '#fff', border: 'none' }"
            iconPos="right"
        /> -->
        <div v-if="userInfo && userInfo.role !== 'user' " class="flex flex-wrap gap-4 mb-4 w-full md:w-9">
          <!-- <Button
            v-if="maeInfo"
            label="Solicitar Asistencia" 
            icon="pi pi-question-circle" 
            class="p-button-warn p-button-lg py-4 w-full md:w-5"
            :style="{borderRadius: '15px',background: 'linear-gradient(to right, #CC7722, #DAA520)',color: '#fff', border: 'none'}"
            iconPos="right"
          /> -->

          <Button 
              v-if="maeInfo && userInfo && userInfo['activeSession']"
              label="Cerrar Sesión"
              icon="pi pi-pause" 
              class="p-button-help p-button-lg py-4 w-full md:w-5"
              :style="{ borderRadius: '15px', background: 'linear-gradient(to right, #9F2B68, #BF40BF)', color: '#fff', border: 'none' }"
              iconPos="right"
              @click="stopSession"
          />

          <Button
              v-else-if="maeInfo"
              label="Iniciar Sesión"
              icon="pi pi-play" 
              class="p-button-help p-button-lg py-4 w-full md:w-5"
              :style="{ borderRadius: '15px', background: 'linear-gradient(to right, #9F2B68, #BF40BF)', color: '#fff', border: 'none' }"
              iconPos="right"
              @click="showDialogSession = true"
          />

        </div>
        
    </div>

    <div class="flex flex-wrap border-round-3xl text-white h-full" :style="{ background: 'linear-gradient(to right, #779AC4, #29AB93)'}">
    <div class="relative w-full md:w-4 border-round-left-3xl">
      <span class="overlay">
        <Button
          label="◀"
          class="text-xl border-none bg-transparent btn-left hidden lg:block"
        />
        <img class="w-full h-full clip-diagonal border-round-top-3xl md:border-round-left-3xl arrow" src="../../assets/img/fotos/espacio-mae.png" />
      </span>
    </div>
    <div class="w-full md:w-8 text-center p-4 flex gap-5" >
      <div class="w-1 grid grid-cols-1 place-content-center lg:hidden mt-1  ">
        <Button
          label="◀"
          class="m-0 p-0 text-xl border-none bg-transparent mt-1 ml-2"
        />
      </div>
      <div>
        <h2 class="text-white text-3xl font-bold">
          Asesorías Grupales
        </h2>
        <p class="font-medium text-left ml-5 text-xl">
          ¿Tienes dudas? ¡Únete a nuestras asesorías grupales! Ofrecemos sesiones cada semana de las materias más populares. ¡No te quedes atrás!
        </p>
        <p class="text-white text-2xl font-bold text-right">
          Saber más <i class="pi pi-arrow-right text-2xl font-bold"></i>
        </p>
      </div>
      <div class="mt-1 grid grid-cols-1 place-content-center mr-2">
        <Button
          label="▶"
          class="m-0 p-0 text-xl border-none bg-transparent"
        />
      </div>
    </div>
  </div>

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