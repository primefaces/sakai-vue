<script setup>
import { ref, onMounted } from 'vue';
import { getExperience } from '@/firebase/db/users';

const users = ref([]);
const userGold = ref(null);

onMounted(async () => {
    const fetchedUsers = await getExperience();
    users.value = assignRanks(fetchedUsers);
    userGold.value = users.value[0]; // Usar .value para reasignar
    console.log(userGold.value, "Esto es"); // Usar .value para acceder al valor
});
const assignRanks = (fetchedUsers) => {
    const sortedUsers = fetchedUsers.sort((a, b) => b.points - a.points);
    
    let rankedUsers = [];
    let lastPoints = null;
    let rank = 0;

    for (const user of sortedUsers) {
        if (user.points !== lastPoints) {
            rank++;
            lastPoints = user.points;
        }
        rankedUsers.push({ ...user, rank });
    }
    
    return rankedUsers;
};
</script>

<template>
    <div class="flex md:flex-row flex-column   sm:mb-3">
        <div class="flex flex-column align-items-start">
            <h1 class="text-black text-5xl font-bold text-center m-0 sm:text-left mb-3">Leaderboard</h1>
            <div class="bg-white border-round-3xl p-2 px-4 flex flex-row justify-content-center">
                <img src="/assets/mundo.svg" class="mr-3 mt-1" alt="world icon" style="width: 1.5rem; height: 1.5rem;" />
                <p class="text-xl">División general</p>
            </div>
        </div>


        <div class=" justify-content-center align-items-center hidden lg:block ml-8">
            <div v-if="userGold" class="border-round-3xl flex flex-row bg-white p-3 px-5 align-items-center border-photo" style="position: relative; width: fit-content;">
                <div class="flex flex-column mr-3">
                    <img src="/assets/crown.svg" alt="crown icon" 
                        class="crown-icon -mt-2" 
                        style="width: 2rem; height: 2rem;" />
                    <img v-if="userGold.photoURL" 
                        :src="userGold.photoURL" 
                        alt="Foto de perfil"
                        class="border-circle h-4rem w-4rem border-gold -mt-2">
                    <img v-else 
                        src="/assets/lego.jpg" 
                        alt="default profile" 
                        class="border-circle h-4rem w-4rem border-gold">
                </div>
                <span class="flex flex-column mt-2">
                    <span class="font-bold mb-1">{{ userGold.name }}</span>
                    <span class="border-round-3xl border-gold bg-gold flex flex-row mt-1 px-3 py-1 w-full">
                        <i class="pi pi-star-fill text-lg pr-2 mt-1" style="color: #FFCB04;"></i>
                        <p class="m-0 text-center font-semibold text-md">Top MAE</p>
                    </span>
                </span>
            </div>
        </div>
    </div>

    <div class="bg-white border-round-3xl p-3">
        <ul class="list-none p-0">
            <li 
                v-for="(user, index) in users" 
                :key="user.uid" 
                :class="[ 
                    'flex justify-between items-center p-2 py-4', 
                    index === 0 ? 'border-2 border-yellow-500 border-round-3xl' : '',  
                    'bg-white m-1 rounded-3xl' 
                ]"
            >
                <div class="flex justify-content-center align-items-center">
                    <img v-if="index === 0" src="/assets/gold.svg" class="font-semibold mr-3 ml-4" alt="gold icon" style="width: 2.5rem; height: 2.5rem;" />
                    <img v-if="index === 1" src="/assets/silver.svg" class="font-semibold mr-3 ml-4" alt="gold icon" style="width: 2.5rem; height: 2.5rem;" />
                    <img v-if="index === 2" src="/assets/bronze.svg" class="font-semibold mr-3 ml-4" alt="gold icon" style="width: 2.5rem; height: 2.5rem;" />
                    <span class="font-semibold mr-4 ml-7E" v-if="index !== 0 && index !== 1 && index !== 2">
                        {{ user.rank }}. 
                    </span>
                    <img v-if="user.photoURL" 
                         :src="user.photoURL" 
                         alt="Foto de perfil"
                         :class="['border-circle h-4rem w-4rem', { 'border-gold': index === 0, 'border-silver': index === 1, 'border-bronze': index === 2 }]">
                    <img v-else src="/assets/lego.jpg" :class="['border-circle h-4rem w-4rem', { 'border-gold': index === 0, 'border-silver': index === 1, 'border-bronze': index === 2 }]" alt="default profile" 
                    style="width: 4rem; height: 4rem;" />
                    <div class="flex flex-column ml-3">
                        <span class="font-bold">{{ user.name }} </span>
                        <span>{{ user.career }} </span>
                    </div>
                </div>
                <div class="flex items-center ml-auto md:mt-4 mr-3">
                    <span class="mr-6">{{ user.points }} EXP</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.border-yellow-500 {
    border-color: #FFD700;
}
.bg-gold{
    background-color: #FFF5D1;
}
.border-gold {
    border: 3px solid #FFD700;
}
.border-silver {
    border: 3px solid silver; 
}
.border-photo {
    border: 1px solid #c8c8c8; 
}
.border-bronze {
    border: 3px solid #cd7f32;    
}
</style>
