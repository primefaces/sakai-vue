<script setup>
import { ref, onMounted } from 'vue';
import { getExperience } from '@/firebase/db/users';

const users = ref([]);

onMounted(async () => {
    users.value = await getExperience();
});
</script>

<template>
   <div class="flex md:flex-row flex-column sm:flex sm:justify-content-between mb-2 sm:mb-5">
        <div class="flex flex-column">
            <h1 class="text-black text-5xl font-bold text-center m-0 sm:text-left mb-3">Leaderboard</h1>
            <div class="bg-white border-round-3xl p-1 flex flex-row justify-content-center">
                <img src="/assets/mundo.svg" class="mr-3 mt-1" alt="world icon" style="width: 1.5rem; height: 1.5rem;" />
                <p class="text-xl "> División general</p>
            </div>
        </div>
    </div>

    <div>
        <ul class="list-none p-0">
            <li 
                v-for="(user, index) in users" 
                :key="user.uid" 
                :class="[
                    'flex justify-between items-center p-2',
                    index === 0 ? 'border-2 border-yellow-500' : '',
                    'bg-white my-1 rounded-lg'
                ]"
            >
                <div class="flex items-center">
                    
                    <span class="font-semibold">{{ user.name }}</span>
                </div>
                <div class="flex items-center">
                    <span class="mr-2">{{ user.points }} puntos</span>
                    <span v-if="index === 0" class="text-yellow-500"><i class="pi pi-fw pi-gold" /></span>
                    <span v-if="index === 1" class="text-silver"><i class="pi pi-fw pi-silver" /></span>
                    <span v-if="index === 2" class="text-bronze"><i class="pi pi-fw pi-bronze" /></span>
                </div>
            </li>
        </ul>
    </div>
</template>

<style scoped>
/* Agrega estilos para medallas si es necesario */
.text-silver {
    color: silver;
}

.text-bronze {
    color: #cd7f32; /* Color para bronce */
}

.border-yellow-500 {
    border-color: #FFD700; /* Color dorado */
}
</style>
