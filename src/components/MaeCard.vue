<script setup>
import { ref } from 'vue';

// Props para recibir del padre
const props = defineProps(['nombre', 'carrera', 'matricula', 'horaInicio', 'horaFin', 'checked']);

const checked = ref(null)
</script>

<template>
    <div class="w-full p-0 border-round-xl bg-white shadow-1">
        <div class="flex border-round-top-xl bg-primary">
            <div class="pl-4 p-2">
                <p class="text-2xl font-semibold">{{ matricula }}</p>
            </div>
            <div class="ml-auto pr-4 p-2">
                <p class="text-2xl font-semibold text-end">{{ carrera }}</p>
            </div>
        </div>

        <div class="flex p-3 gap-3">
            <Skeleton shape="circle" size="5rem"></Skeleton>
            <div>
                <p class="font-semibold text-xl text-overflow-ellipsis" style="max-width: 10px;"> {{ nombre }} </p>
                <Tag class="text-md" severity="success" :value='`${horaInicio} - ${horaFin}`' rounded />
            </div>
            <Button v-if="checked == null" @click="checked = false" icon="pi pi-check" class="p-button-rounded p-button-success ml-auto" />
            <Button v-if="checked == false" @click="checked = true" icon="pi pi-check" class="p-button-rounded p-button-warning ml-auto" />
            <Button v-if="checked == true" @click="checked = null" icon="pi pi-check" class="p-button-rounded p-button-danger ml-auto" />
        </div>
    </div>
</template>