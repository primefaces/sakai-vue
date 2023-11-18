<script setup>
import Button from 'primevue/button';
// Props para recibir del padre
const props = defineProps(['nombre', 'carrera', 'matricula', 'horaInicio', 'horaFin']);
console.log(props);
</script>

<template>
    <div class="relative sm:w-30% md:w-30% lg:w-30% shrink-0 text-black ml-2 mt-3 mb-3" style="border-radius: 25px; overflow: hidden; border: 1px solid #ccc">
        <div class="flex" style="background-color: #09144f; border-radius: 25px 25px 0 0">
            <div class="pl-5 p-2">
                <p class="text-4xl font-semibold text-white">{{ nombre }}</p>
            </div>
            <div class="ml-auto pr-4 p-2">
                <p class="text-4xl font-semibold text-white text-end">{{ carrera }}</p>
            </div>
        </div>

        <div class="flex mt-5">
            <div class="flex top-1/2 transform -translate-y-1/2 bg-gray-300 mb-5 ml-4" style="width: 80px; height: 80px; border-radius: 50%; margin-left: 1%"></div>
            <b class="flex text-4xl text-blue-800" style="padding-left: 8%; padding-right: 20%">{{ matricula }}</b>

            <div class="flex top-1/2 transform -translate-y-1/2 bg-gray-300" style="width: 25px; height: 25px; border-radius: 50%"></div>
            <div class="flex" style="margin-left: -61.5%; margin-top: 10%">
                <Button :label="horaInicio" size="large" class="custom-button-style-fin custom-button-left" />
                <Button :label="horaFin" size="large" class="custom-button-style-fin custom-button-right" />
            </div>
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
