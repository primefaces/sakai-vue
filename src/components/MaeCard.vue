<script setup>
import { ref } from 'vue';

// Props para recibir del padre
const props = defineProps(['nombre', 'carrera', 'matricula', 'horaInicio', 'horaFin', 'checked']);

const checked = ref(null)
</script>

<template>
    <div class="w-full p-0 border-round-xl bg-white">
        <div class="flex border-round-top-xl bg-primary">
            <div class="pl-4 p-2">
                <p class="text-2xl font-semibold">{{ nombre }}</p>
            </div>
            <div class="ml-auto pr-4 p-2">
                <p class="text-2xl font-semibold text-end">{{ carrera }}</p>
            </div>
        </div>

        <div class="flex p-3 gap-3">
            <Skeleton shape="circle" size="5rem"></Skeleton>
            <div>
                <p class="font-semibold text-xl text-overflow-ellipsis" style="max-width: 10px;"> {{ matricula }} </p>
                <span class="bg-green-500 border-round-xl p-2 text-white font-bold"> {{ horaInicio }} - {{ horaFin }} </span>
            </div>
            <Button v-if="checked == null" @click="checked = false" icon="pi pi-check" class="p-button-rounded p-button-success ml-auto" />
            <Button v-if="checked == false" @click="checked = true" icon="pi pi-check" class="p-button-rounded p-button-warning ml-auto" />
            <Button v-if="checked == true" @click="checked = null" icon="pi pi-check" class="p-button-rounded p-button-danger ml-auto" />
        </div>
    </div>
</template>

<style scoped>
.custom-button-style,
.custom-button-style-fin {
    height: 35px;
    border: 1px solid #b6b6b6;
    background-color: #e4ffea;
    color: #718096;
}

.custom-button-left {
    border-radius: 25px 0 0 25px;
}

.custom-button-right {
    border-radius: 0 25px 25px 0;
}

.custom-button-style:hover {
    color: #e4ffea;
}

.custom-button-style:hover,
.custom-button-style:active {
    background-color: #d5eedb;
}

.custom-button-style-fin:hover {
    color: #fff;
}

.custom-button-style-fin:hover,
.custom-button-style-fin:active {
    background-color: #4fd06b;
    border: 1px solid #b6b6b6;
}
</style>
