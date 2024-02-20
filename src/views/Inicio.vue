<script setup>
import { getUsersWithActiveSession } from '../firebase/db/users';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const activeMAEs = ref([])

onMounted( async () => {
    activeMAEs.value = await getUsersWithActiveSession();
})
</script>

<template>
    <h1 class="text-black text-6xl font-bold mb-5">Inicio</h1>
    <div class="grid" v-if="activeMAEs.length > 0">
        <span v-for="mae in activeMAEs" :key="mae.uid" class="md:col-4 col-12" @click="router.push(`/mae/${mae.uid}`);">
            <div class="p-0 w-full md:h-11rem border-round-xl bg-white shadow-1 hover:shadow-3 translate">
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
                        <p class="font-semibold text-xl white-space-nowrap overflow-hidden text-overflow-ellipsis" style="max-width: 75%;"> {{ mae.name }} </p>
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