<script setup>
import { ref } from 'vue';

// Props para recibir del padre
const props = defineProps(['user']);

const checked = ref(null)
</script>

<template>
    <div class="w-full p-0 border-round-xl bg-white shadow-1 col-4">
        <div class="flex border-round-top-xl bg-primary">
            <div class="pl-4 p-2">
                <p class="text-2xl font-semibold uppercase">{{ user.uid }}</p>
            </div>
            <div class="ml-auto pr-4 p-2">
                <p class="text-2xl font-semibold text-end uppercase">{{ user.career }}</p>
            </div>
        </div>

        <div class="flex p-3 gap-3">
            <img v-if="true" src="https://randomuser.me/api/portraits/lego/5.jpg" alt="Foto de perfil" class="border-circle h-5rem w-5rem">
            <Skeleton v-else shape="circle" size="5rem"></Skeleton>
            <div>
                <p class="font-semibold text-xl text-overflow-ellipsis"> {{ user.name }} </p>
                <Tag class="text-md" severity="success" :value="`${'11:00'} - ${'13:00'}`" rounded />
            </div>
            <!-- <Button v-if="checked == null" @click="checked = false" icon="pi pi-check" class="p-button-rounded p-button-success ml-auto" />
            <Button v-if="checked == false" @click="checked = true" icon="pi pi-check" class="p-button-rounded p-button-warning ml-auto" />
            <Button v-if="checked == true" @click="checked = null" icon="pi pi-check" class="p-button-rounded p-button-danger ml-auto" /> -->
        </div>
    </div>
</template>