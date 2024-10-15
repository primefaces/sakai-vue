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

const formatName = (name) => {
  if (!name) return '';
  const words = name.split(' ');
  return words.slice(0, 2).join(' '); // Limita a dos palabras
};
</script>

<template>
    <div class="flex md:flex-row flex-column  md:mb-2">
        <div class="flex flex-column align-items-start">
            <h1 class="text-black text-5xl font-bold text-center m-0 sm:text-left mb-3">Leaderboard</h1>
            <div class="bg-white border-round-3xl p-2 px-4 flex flex-row justify-content-center">
                <img src="/assets/mundo.svg" class="mr-3 mt-1" alt="world icon" style="width: 1.5rem; height: 1.5rem;" />
                <p class="text-xl">División general</p>
            </div>
        </div>


        <div class="flex justify-content-center align-items-center	mt-6 md:mt-0 lg:flex-row gap-8 mb-6 md:mb-0  podium-container">
            <div class="podium-background"></div>

            <!-- Segundo lugar (Izquierda) -->
            <div v-if="users[1]" class="flex flex-column items-center" style="transform: translateY(20%);">
                <div class="relative">
                <img v-if="users[1].photoURL"
                    :src="users[1].photoURL"
                    alt="Foto perfil"
                    class="border-circle h-5rem w-5rem border-silver" />
                <img v-else
                    src="/assets/lego.jpg"
                    alt="default profile"
                    class="border-circle h-5rem w-5rem border-silver" />
                <div class="circle-number border-silver bg-silver ">
                    2
                </div>
                </div>
                <span class="font-bold mt-3 text-center">{{ formatName(users[1].name) }}</span>
                <span class="text-gray-500 text-center">{{ users[1].points }} EXP</span>
            </div>

            <!-- Primer lugar (Centro) -->
            <div v-if="userGold" class="flex flex-column items-center relative" >
                <div class="relative">
                <img src="/assets/crown.svg"
                    alt="crown icon"
                    class="absolute crown-icon"
                    style="width: 2.5rem; height: 2.5rem; top: -20px;" />
                <img v-if="userGold.photoURL"
                    :src="userGold.photoURL"
                    alt="Foto perfil"
                    class="border-circle h-6rem w-6rem border-gold" />
                <img v-else
                    src="/assets/lego.jpg"
                    alt="default profile"
                    class="border-circle h-6rem w-6rem border-gold" />
                <div class="circle-numberCenter border-gold bg-gold">
                    1
                </div>
                </div>
                <span class="font-bold mt-3 text-center">{{ formatName(userGold.name) }}</span>
                <span class="text-gray-500 text-center">{{ userGold.points }} EXP</span>
            </div>

            <!-- Tercer lugar (Derecha) -->
            <div v-if="users[2]" class="flex flex-column items-center" style="transform: translateY(20%);">
                <div class="relative">
                <img v-if="users[2].photoURL"
                    :src="users[2].photoURL"
                    alt="Foto perfil"
                    class="border-circle h-5rem w-5rem border-bronze" />
                <img v-else
                    src="/assets/lego.jpg"
                    alt="default profile"
                    class="border-circle h-5rem w-5rem border-bronze" />
                <div class="circle-number border-bronze bg-bronze">
                    3
                </div>
                </div>
                <span class="font-bold mt-3 text-center">{{ formatName(users[2].name) }}</span>
                <span class="text-gray-500 text-center">{{ users[2].points }} EXP</span>
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
                    <span class="font-semibold mr-4 ml-5" v-if="index !== 0 && index !== 1 && index !== 2">
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
    background-color: #FFD700;
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
.circle-number {
  border-radius: 50%; 
  width: 2rem; 
  height: 2rem; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  font-size: 1rem; 
  font-weight: bold; 
  color: black;
  position: absolute;
  bottom: -10px;
  left: 20px; 
}

.circle-numberCenter {
  border-radius: 50%; 
  width: 2rem; 
  height: 2rem; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  font-size: 1rem; 
  font-weight: bold; 
  color: black;
  position: absolute;
  bottom: -10px;
  left: 26px; 
}

.bg-silver {
  background-color: #C0C0C0; 
}

.bg-bronze {
  background-color: #CD7F32; 
}

.podium-background {
  background-image: url('/assets/Podium.svg'); 
  mix-blend-mode: screen; 
  background-position: bottom center; 
  background-repeat: no-repeat; 
  background-size: contain; 
  position: absolute;
  inset: 0;
  z-index: -1;

}

.podium-container {
    padding-top: 38px;
  padding-bottom: 38px;
  position: relative; 
  margin-left: 0%;
}

@media (min-width: 768px) {
  .podium-container {
    margin-left: 5%;
  }
}

</style>

