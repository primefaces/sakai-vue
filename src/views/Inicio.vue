<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getUsersWithActiveSession } from '../firebase/db/users';
import { getCurrentUser } from '../firebase/db/users';

const router = useRouter();
const userInfo = ref(null);
const activeMAEs = ref([]);

onMounted( async () => {
    activeMAEs.value = await getUsersWithActiveSession();
    userInfo.value = await getCurrentUser();
})
</script>

<template>
    <h1 class="text-black text-6xl font-bold">Bienvenid@</h1>
    <div v-if="userInfo">
        <h2 class="text-black text-4xl font-semibold">{{userInfo.name}}</h2>
        <div class="md:flex md:justify-content-between">
            <p class="text-lg font-medium vertical-align-middle md:mb-0 md:pt-3"> 
                <i class="pi pi-envelope font-medium"/> 
                {{ userInfo.email }} 
                <i class="pi pi-book font-medium ml-5"/> 
                {{ userInfo.career }} @ {{ userInfo.campus }}
            </p>
            <Button icon="pi pi-pencil" label="Editar perfil" class="mb-0 w-full md:w-fit text-center"/>
        </div>
    </div>
    <hr>
    <div class="grid" v-if="activeMAEs.length > 0">
        <span v-for="mae in activeMAEs" :key="mae.uid" class="md:col-4 col-12">
            <div class="p-0 w-full md:h-11rem border-round-xl bg-white shadow-1 hover:shadow-3 transition-duration-300 transition-ease-out">
                <div class="flex border-round-top-xl bg-primary">
                    <div class="pl-4 p-2">
                        <p class="text-2xl font-semibold uppercase">{{ mae.uid }}</p>
                    </div>
                    <div class="ml-auto pr-4 p-2">
                        <p class="text-2xl font-semibold text-end uppercase">{{ mae.career }}</p>
                    </div>
                </div>
    
                <div class="flex p-3 gap-3">
                    <img v-if="true" src="https://randomuser.me/api/portraits/lego/5.jpg" alt="Foto de perfil" class="border-circle h-6rem w-6rem">
                    <Skeleton v-else shape="circle" size="5rem"></Skeleton>
                    <div class="relative w-full">
                        <!-- TODO: Arreglar el problema con el overflow (abrir consola de desarrollador y jalarla para ver a que me refiero) -->
                        <a :href="`/#/mae/${mae.uid}`" class="font-semibold text-xl text-black-alpha-90 hover:underline hover:text-primary" style="max-width: 75%;"> {{ mae.name }} </a>
                        <div class="md:absolute md:bottom-0 w-full">
                            <p v-if="mae.activeSession.location" class="mb-0"> {{ mae.activeSession.location }} </p>
                            <Tag class="text-md w-6rem" severity="success" :value="`${'11:00'} - ${'13:00'}`" />
                            <!-- <Tag v-if="mae.activeSession.location" class="white-space-nowrap overflow-hidden text-overflow-elipsis" style="max-width: 50%;" :value="mae.activeSession.location"/> -->
                        </div>
                    </div>
                </div>
            </div>
        </span>
    </div>
    <div v-else class="flex align-content-center h-full" style="min-height: 300px">
        <h1 class="flex align-items-center justify-content-center w-full text-center"> <span>No hay MAEs conectados por ahora 😔 <br> Consulta los <router-link to="horarios">horarios</router-link> para saber cuando podemos ayudarte ❤️</span></h1>
    </div>

</template>

<style>


.translate {
  transition: transform 0.3s ease-in-out; /* Apply a 0.3s transition with ease-in-out timing function */
  cursor: pointer;
}

.translate:hover {
  transform: translateY(-10px); /* Moves the element up by 1 pixel on hover */
}

</style>