<script setup>
// Props para recibir del padre
const props = defineProps(['nombre', 'carrera', 'matricula', 'horaInicio', 'horaFin']);
console.log(props);
</script>

<template>
    <div class="relative sm:w-30% md:w-30% lg:w-30% shrink-0 text-black ml-3 mt-5 mb-5" style="border-radius: 15px; overflow: hidden; border: 1px solid #ccc">
        <div class="flex" style="background-color: #09144f; border-radius: 25px 25px 0 0">
            <div class="pl-2 p-2">
                <p class="text-4xl font-semibold text-white">{{ nombre }}</p>
            </div>
            <div class="ml-auto pr-4 p-2">
                <p class="text-4xl font-semibold text-white text-end">{{ carrera }}</p>
            </div>
        </div>

        <div class="flex mt-5">
            <div class="flex top-1/2 transform -translate-y-1/2 bg-gray-300 mb-5" style="width: 80px; height: 80px; border-radius: 50%; margin-left: 1%"></div>
            <b class="flex text-4xl text-blue-800" style="padding-left: 8%; padding-right: 20%">{{ matricula }}</b>
            <div class="flex top-1/2 transform -translate-y-1/2 bg-gray-300" style="width: 25px; height: 25px; border-radius: 50%"></div>
            <div class="flex" style="margin-left: -60%; margin-top: 10%">
                <div class="bg-green-200 text-2xl flex items-center justify-center text-center px-4" style="border-radius: 25%; height: 35px; margin-right: 50%">
                    <p class="text-gray-500">{{ horaInicio }}</p>
                </div>
                <div class="bg-green-500 text-2xl flex items-center justify-center text-center px-4" style="border-radius: 25%; height: 35px">
                    <p class="text-white">{{ horaFin }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
