<script setup>
import Button from 'primevue/button';
</script>

<template>
    <div class="container">
        <div class="content">
            <div class="left-content">
                <div class="title">Coordinación</div>
                <div class="separator"></div>
            </div>
            <div class="right-content">
                <div class="button-container">
                    <Button label="Generar Reporte" severity="info" size="large" class="custom-button" />
                </div>
            </div>
        </div>
        <div class="active-maes">
            <b>Maes Activos</b>
        </div>
        <div class="pending-maes">
            <b>Maes Pendientes</b>
        </div>
    </div>
</template>

<style scoped>
.container {
    border-radius: 20px;
    background-color: #fff;
    width: 100%;
    height: 1033px;
    overflow: hidden;
    text-align: left;
    font-size: 32px;
    color: #0d294c;
    font-family: 'Lato';
}

.content {
    display: flex;
    align-items: flex-start;
    padding-left: 50px;
    padding-right: 50px;
    position: relative;
}

.left-content {
    flex: 1;
}

.title {
    font-size: 48px;
    margin-top: 3%;
}

.separator {
    border-bottom: 2px solid #d6d6d6; /* Agregar la línea con el color deseado */
    width: 100%; /* Ancho completo */
    margin-top: 10px; /* Espacio entre el título y la línea */
}

.right-content {
    flex: 1;
}

.button-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 3%;
}

.custom-button {
    border-radius: 20px;
    width: 42%;
    height: 51px;
    overflow: hidden;
    font-size: 24px;
    color: #fff;
}

.custom-button .p-button-label {
    background-color: #1e436e;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.active-maes,
.pending-maes {
    color: #000;
    margin-top: 4%;
    margin-left: 4%;
}
</style>

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
