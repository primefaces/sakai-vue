<script setup>
import Button from 'primevue/button';
import Panel from 'primevue/panel';
</script>

<template>
    <div class="rounded-3xl bg-white w-full h-1033px overflow-hidden text-left text-2xl text-blue-800 font-lato p-5">
        <div class="flex items-start relative">
            <div class="flex-1">
                <div class="text-black text-4xl mb-5 ml-2.4%">Coordinación</div>
                <div class="border-b-2 border-d6d6d6 w-full mb-5 ml-2.4%"></div>
            </div>
            <div class="flex-2">
                <div class="flex">
                    <!-- Ajuste en justify-start para mover a la izquierda -->
                    <Button label="Generar Reporte" severity="info" size="large" class="custom-button" />
                </div>
            </div>
        </div>
        <div class="mt-5">
            <div class="text-3xl"><b>Maes Activos</b></div>
            <div class="flex mt-5">
                <Panel header="Bernardo ITC" class="custom-panel"></Panel>
                <Panel header="Panel 2"></Panel>
                <Panel header="Panel 3"></Panel>
            </div>
            <div class="text-3xl mt-2.4% pt-5"><b>Maes Pendientes</b></div>
        </div>
    </div>
</template>

<!--
<div :style="{ position: 'relative', borderRadius: '20px', backgroundColor: '#fff', border: '1px solid #e9ebeb', boxSizing: 'border-box', width: '329px', height: '158px', overflow: 'hidden', flexShrink: '0' }">
    <div :style="{ position: 'absolute', top: '0px', left: '11.5px', borderRadius: '20px 20px 0px 0px', backgroundColor: 'rgba(8, 20, 79, 0.56)', width: '329px', height: '53px', overflow: 'hidden' }">
        <b :style="{ position: 'absolute', top: 'calc(50% - 15.5px)', right: '22px', display: 'inline-block', width: '52px', height: '32px' }">ITC</b>
    </div>
    <div :style="{ position: 'absolute', top: '61px', left: '14.5px', borderRadius: '50%', backgroundColor: '#d9d9d9', width: '83px', height: '83px' }" />
    <div
        :style="{
            position: 'absolute',
            top: '114px',
            left: '114.5px',
            borderRadius: '30px',
            background: 'linear-gradient(#e4ffea, #e4ffea), linear-gradient(#e4ffea, #e4ffea), linear-gradient(#e4ffea, #e4ffea), #e4ffea',
            width: '88px',
            height: '30px',
            overflow: 'hidden'
        }"
    />
    <div :style="{ position: 'absolute', top: '114px', left: '225.5px', borderRadius: '30px', backgroundColor: '#4dbd65', width: '88px', height: '30px', overflow: 'hidden' }" />
    <div :style="{ position: 'absolute', top: '77px', left: '299.5px', borderRadius: '50%', backgroundColor: '#efd063', width: '14px', height: '14px' }" />
</div> -->
