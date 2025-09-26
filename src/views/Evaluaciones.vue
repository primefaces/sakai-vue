<script setup>
import { ref, onMounted } from 'vue';
import { getCurrentUser } from '../firebase/db/users';
import { getCommentsByUid } from '../firebase/db/asesorias';
import { getSubjectColor } from '@/utils/HorarioUtils';

const userInfo = ref(null);
const asesorias = ref([]);
const isLoading = ref(true);

const emojiList = [
  "Astonished Face.svg",
  "Beaming Face with Smiling Eyes.svg",
  "Cowboy Hat Face.svg",
  "Face Savoring Food.svg",
  "Face with Tongue-1.svg",
  "Face with Tongue.svg",
  "Grinning Face with Big Eyes.svg",
  "Grinning Face with Smiling Eyes.svg",
  "Grinning Face.svg",
  "Grinning Squinting Face.svg",
  "Nerd Face.svg",
  "Relieved Face.svg",
  "Slightly Smiling Face.svg",
  "Smiling Face with Halo.svg",
  "Smiling Face with Heart-Eyes.svg",
  "Smiling Face with Hearts.svg",
  "Smiling Face with Smiling Eyes-1.svg",
  "Smiling Face with Smiling Eyes.svg",
  "Smiling Face with Sunglasses.svg",
  "Star-Struck.svg",
  "Winking Face with Tongue.svg"
];

const getRandomEmoji = () => {
  const randomIndex = Math.floor(Math.random() * emojiList.length);
  return `/assets/emojis/${emojiList[randomIndex]}`;
};

onMounted(async () => {
  userInfo.value = await getCurrentUser();
  asesorias.value = await getCommentsByUid(userInfo.value.uid);
  isLoading.value = false;
});
</script>

<template>
  <div>
    <h1 class="text-black text-6xl font-bold mb-5 text-center sm:text-left">Mis evaluaciones</h1>

    <div v-if="isLoading" class="text-center">
      <ProgressSpinner style="width: 60px; height: 60px; animation: spin-fast 0.5s linear infinite;" strokeWidth="6" fill="var(--surface-ground)" />
    </div>

    <div v-else-if="!asesorias.length" class="text-center">
      <p class="text-lg">Sin evaluaciones</p>
    </div>

    <div v-else class="flex flex-wrap gap-4">
      <div
        v-for="asesoria in asesorias"
        :key="asesoria.id"
        class="flex bg-white border-round-3xl w-full md:w-5 border-gray"
        style="height: 145px;"
      >
        <div class="flex border-round-left-3xl" :class="getSubjectColor(asesoria.subject.area)" style="width: 1rem; height: 100%;"></div>

        <div class="flex w-full items-center p-3">
          <div class="flex justify-center items-center centrado" style="width: 5rem; height: 100%;">
            <img :src="getRandomEmoji()" alt="mentoring icon" style="width: 5rem; height: 5rem;" />
          </div>

          <div class="ml-4 flex-1 centrado">
            <p class="font-bold text-md comentario text-center  centrado">
              "{{ asesoria.comment || 'No hay comentarios' }}"
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.boder-gray {
  border: 2px solid #e0e0e0;
}

.comentario {
  max-height: 110px;
  overflow-y: auto; 
  padding-right: 0.5rem; 
  
}

.centrado{
  justify-content: center;
  align-items: center;
  margin: auto;
}
</style>
