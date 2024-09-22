<script setup>
import { onMounted, ref } from 'vue';
import { getCurrentUser, getUser, startActiveSession, stopActiveSession } from '../firebase/db/users';
import { useToast } from 'primevue/usetoast';

const userInfo = ref(null);
const maeInfo = ref(null);

const toast = useToast();

const showDialogSession = ref(false);
const location = ref('Biblioteca Piso 3')

onMounted(async () => {
    userInfo.value = await getCurrentUser();
    console.log(userInfo.value.uid);
    maeInfo.value = await getUser(userInfo.value.uid);

})

const startSession = async () => {
  // Crea field de activeSession con id, location, peerInfo, startTime, status
  try {
    const res = await startActiveSession(userInfo.value.uid, userInfo.value, location.value);
    toast.add({ severity: 'success', summary: 'Inicio de sesión exitoso', life: 3000 });
    userInfo.value = await getCurrentUser();
    maeInfo.value = await getUser(userInfo.value.uid);
    showDialogSession.value = false;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Ocurrió un error al tratar de iniciar sesión', detail: 'Consulta con un administrador de la página', life: 3000 });
  }
}

const stopSession = async () => {
  try {
    const res = await stopActiveSession(userInfo.value.uid);
    if (!res.activeSessionDeleted) {
      if (res.timeLimitExceded) {
        toast.add({ severity: 'error', summary: `Excediste el limite de tiempo de tu sesión (${ Math.round((res.differenceInMinutes / 60) * 100) / 100 } horas)`, detail: 'Consulta a un coordi para reponer las horas' });
      }
      else {
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
}

</script>

<style scoped>
@media (min-width: 768px){
    .clip-diagonal {
        clip-path: polygon(0 0, 80% 0, 100% 100%, 0 100%);
    }
}
</style>


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
        <Button 
            label="Registrar Asesoria" 
            icon="pi pi-pencil"
            class="p-button-info p-button-lg py-4 w-full md:w-5"
            :style="{ borderRadius: '15px', background: 'linear-gradient(to right, #3a7bd5, #00d2ff)', color: '#fff', border: 'none' }"
            iconPos="right"
        />

        <Button 
            label="Evaluar Asesoria" 
            icon="pi pi-star" 
            class="p-button-success p-button-lg py-4 w-full md:w-5"
            :style="{ borderRadius: '15px', background: 'linear-gradient(to right, #00b09b, #96c93d)', color: '#fff', border: 'none' }"
            iconPos="right"
        />

        <Button 
            label="Solicitar Asistencia" 
            icon="pi pi-question-circle" 
            class="p-button-warn p-button-lg py-4 w-full md:w-5"
            :style="{borderRadius: '15px',background: 'linear-gradient(to right, #CC7722, #DAA520)',color: '#fff', border: 'none'}"
            iconPos="right"
        />

        <Button 
            v-if="userInfo && userInfo['activeSession']"
            label="Cerrar Sesión"
            icon="pi pi-pause" 
            class="p-button-help p-button-lg py-4 w-full md:w-5"
            :style="{ borderRadius: '15px', background: 'linear-gradient(to right, #9F2B68, #BF40BF)', color: '#fff', border: 'none' }"
            iconPos="right"
            @click="stopSession"
        />

        <Button
            v-else
            label="Iniciar Sesión"
            icon="pi pi-play" 
            class="p-button-help p-button-lg py-4 w-full md:w-5"
            :style="{ borderRadius: '15px', background: 'linear-gradient(to right, #9F2B68, #BF40BF)', color: '#fff', border: 'none' }"
            iconPos="right"
            @click="showDialogSession = true"
        />
    </div>

    <div class="flex w-12 md:w-9 flex-wrap" :style="{ borderRadius: '15px', background: 'linear-gradient(to right, #4466A7, #088F8F)', color: '#fff', border: 'none' }">
        <div class="w-full md:w-4">
            <img class="w-full h-full object-cover clip-diagonal" src="https://i.imgur.com/C6psSY1.png">
        </div>
        <div class="w-full md:w-8 text-center p-4 flex gap-5">
            <div class="w-1 grid grid-cols-1 place-content-center">
                <Button 
                    label="◀" 
                    class="m-0 p-0 text-xl border-none bg-transparent"
                />
            </div>
            <div>
                <h2 class="text-white text-2xl font-bold">
                    Asesorías Grupales
                </h2>
                <p class="font-medium">
                    ¿Tienes dudas? ¡Únete a nuestras asesorías grupales! Ofrecemos sesiones cada semana de las materias más populares. ¡No te quedes atrás!
                </p>
                <div class="text-right">
                    <Button 
                        label="Ver más" 
                        icon="pi pi-arrow-right"
                        class="m-0 p-0 text-xl border-none bg-transparent"
                        iconPos="right"
                    />
                </div>
            </div>
            <div class="grid grid-cols-1 place-content-center mr-2">
                <Button 
                    label="▶" 
                    class="m-0 p-0 text-xl border-none bg-transparent"
                />
            </div>
        </div>
    </div>
</template>