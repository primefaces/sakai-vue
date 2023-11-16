<script setup>
import Button from 'primevue/button';
</script>

<template>
    <div class="rounded-3xl bg-white overflow-hidden text-left text-2xl text-blue-800 font-lato p-5 w-screen h-screen px-3">
        <div class="flex relative">
            <div class="flex-1">
                <div class="text-black text-4xl mb-5 ml-2.4%">Coordinación</div>
                <div class="border-b-2 border-d6d6d6 w-full mb-5 ml-2.4%"></div>
            </div>
            <div class="flex-2">
                <div class="flex">
                    <Button label="Generar Reporte" severity="info" size="large" />
                </div>
            </div>
        </div>
        <div class="mt-5">
            <div class="text-3xl"><b>Maes Activos</b></div>
            <div class="flex mt-5">
                <div class="relative rounded-l sm:w-30% md:w-30% lg:w-30% shrink-0 text-black ml-5 mr-5 mt-5">
                    <div class="flex" style="background-color: #09144f">
                        <div class="pl-6 p-2">
                            <p class="text-4xl font-semibold text-white">Juan Perez</p>
                        </div>
                        <div class="ml-auto pr-3 p-2">
                            <p class="text-4xl font-semibold text-white text-end">ITC</p>
                        </div>
                    </div>

                    <div class="flex mt-5">
                        <div class="relative top-1/2 transform -translate-y-1/2 bg-gray-300" style="width: 100px; height: 100px; border-radius: 100%; margin-left: 1%"></div>
                        <b class="relative text-4xl" style="padding-left: 8%; padding-right: 20%">A01733822</b>
                        <div class="relative top-1/2 transform -translate-y-1/2 bg-gray-300" style="width: 30px; height: 30px; border-radius: 100%"></div>
                        <div class="flex" style="margin-left: -58%; margin-top: 10%">
                            <div class="bg-green-200 mr-10 text-4xl" style="width: 100px; height: 40px; border-radius: 30%; margin-right: 76%">
                                <p class="text-center text-black">11:00</p>
                            </div>
                            <div class="bg-green-500 text-4xl" style="width: 100px; height: 40px; border-radius: 30%">
                                <p class="text-center text-black">12:00</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="text-3xl mt-2.4% pt-5"><b>Maes Pendientes</b></div>
        </div>
    </div>
</template>
