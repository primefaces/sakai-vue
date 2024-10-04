<script setup>
import { ref, onMounted } from 'vue';
import { getExperience } from '@/firebase/db/users';

const users = ref([]);

onMounted(async () => {
    const fetchedUsers = await getExperience();
    users.value = assignRanks(fetchedUsers);
});

const assignRanks = (fetchedUsers) => {
    // Ordenar usuarios por puntos de mayor a menor
    const sortedUsers = fetchedUsers.sort((a, b) => b.points - a.points);
    
    let rankedUsers = [];
    let lastPoints = null;
    let rank = 0;

    for (const user of sortedUsers) {
        // Incrementar el rango solo si los puntos son diferentes
        if (user.points !== lastPoints) {
            rank++;
            lastPoints = user.points;
        }
        // Asignar el rango al usuario
        rankedUsers.push({ ...user, rank });
    }
    
    return rankedUsers;
};
</script>

<template>
    <div class="flex md:flex-row flex-column sm:flex sm:justify-content-between mb-2 sm:mb-5">
        <div class="flex flex-column align-items-center">
            <h1 class="text-black text-5xl font-bold text-center m-0 sm:text-left mb-3">Leaderboard</h1>
            <div class="bg-white border-round-3xl p-2 px-4 flex flex-row justify-content-center">
                <img src="/assets/mundo.svg" class="mr-3 mt-1" alt="world icon" style="width: 1.5rem; height: 1.5rem;" />
                <p class="text-xl">División general</p>
            </div>
        </div>
    </div>

    <div class="bg-white border-round-3xl p-3">
        <ul class="list-none p-0">
            <li 
                v-for="(user, index) in users" 
                :key="user.uid" 
                :class="[ 
                    'flex justify-between items-center p-2', 
                    index === 0 ? 'border-2 border-yellow-500 border-round-3xl' : '',  
                    'bg-white m-1 rounded-3xl' 
                ]"
            >
                <div class="flex justify-content-center align-items-center">
                    <img v-if="index === 0" src="/assets/gold.svg" class="font-semibold mr-3" alt="gold icon" style="width: 2.5rem; height: 2.5rem;" />
                    <img v-if="index === 1" src="/assets/silver.svg" class="font-semibold mr-3" alt="gold icon" style="width: 2.5rem; height: 2.5rem;" />
                    <img v-if="index === 2" src="/assets/bronze.svg" class="font-semibold mr-3" alt="gold icon" style="width: 2.5rem; height: 2.5rem;" />
                    <span class="font-semibold mr-4 ml-3 " v-if="index !== 0 && index !== 1 && index !== 2">
                        {{ user.rank }}. 
                    </span>
                    <img v-if="user.photoURL" 
                         :src="user.photoURL" 
                         alt="Foto de perfil"
                         :class="['border-circle h-4rem w-4rem', { 'border-gold': index === 0, 'border-silver': index === 1, 'border-bronze': index === 2 }]">
                    <img v-else src="/assets/lego.jpg" :class="['border-circle h-4rem w-4rem', { 'border-gold': index === 0, 'border-silver': index === 1, 'border-bronze': index === 2 }]" alt="default profile" style="width: 4rem; height: 4rem;" />
                    <div class="flex flex-column ml-3">
                        <span class="font-bold">{{ user.name }} </span>
                        <span>{{ user.career }} </span>
                    </div>
                </div>
                <div class="flex items-center ml-auto md:mt-4 mr-3">
                    <span class="mr-2">{{ user.points }} EXP</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.border-yellow-500 {
    border-color: #FFD700;
}
.border-gold {
    border: 3px solid #FFD700;
}
.border-silver {
    border: 3px solid silver; 
}
.border-bronze {
    border: 3px solid #cd7f32;    
}
</style>
