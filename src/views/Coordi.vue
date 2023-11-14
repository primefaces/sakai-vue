<script setup>
import Button from 'primevue/button';
import Panel from 'primevue/panel';
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
        <div class="maes-section">
            <div class="active-maes">
                <b>Maes Activos</b>
            </div>
            <div class="panels-container">
                <Panel header="Bernardo ITC" class="custom-panel"> </Panel>
                <Panel header="Panel 2"></Panel>
                <Panel header="Panel 3"></Panel>
            </div>
            <div class="pending-maes">
                <b>Maes Pendientes</b>
            </div>
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
    position: relative;
}

.left-content {
    flex: 1;
}

.title {
    font-size: 48px;
    margin-bottom: 20px;
    margin-left: 2.4%;
}

.separator {
    border-bottom: 2px solid #d6d6d6;
    width: 100%;
    margin-bottom: 20px;
    margin-left: 2.4%;
}

.right-content {
    flex: 1;
}

.button-container {
    display: flex;
    justify-content: flex-end;
}

.custom-button {
    border-radius: 20px;
    width: 42%;
    height: 51px;
    overflow: hidden;
    font-size: 24px;
    color: #fff;
    margin-top: 20px;
}

.custom-button .p-button-label {
    background-color: #1e436e;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.maes-section {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
}

.active-maes,
.pending-maes {
    color: #000;
    margin-left: 2.4%;
}

.panels-container {
    display: flex;
    align-items: stretch;
    margin-top: 20px;
    margin-left: 2.4%;
}

.p-panel {
    flex: 1;
    margin-right: 20px;
    border-radius: 20px;
    padding: 1%;
}
.custom-panel {
    border-radius: 20px;
    margin-right: 20px;
    padding: 1%;

    text-align: center;
}

.panel-content {
    display: flex;
    justify-content: space-between;
}

.panels-container {
    display: flex;
    align-items: stretch;
    margin-top: 20px;
    margin-left: 2.4%;
}
.custom-panel {
    position: relative;
    border-radius: 20px;
    background-color: #fff;

    box-sizing: border-box;
    width: 329px;
    height: 158px;
    overflow: hidden;
    flex-shrink: 0;
}

.header {
    position: absolute;
    top: 0;
    left: 11.5px;
    border-radius: 20px 20px 0px 0px;
    background-color: rgba(8, 20, 79, 0.56);
    width: 329px;
    height: 53px;
    overflow: hidden;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.circle,
.small-circle {
    position: absolute;
    border-radius: 50%;
    width: 83px;
    height: 83px;
}

.circle {
    top: 61px;
    left: 14.5px;
}

.small-circle {
    top: 77px;
    left: 299.5px;
}

.gradient-bar {
    position: absolute;
    top: 114px;
    left: 114.5px;
    border-radius: 30px;
    width: 88px;
    height: 30px;
    overflow: hidden;
    display: flex;
}

.gradient-segment {
    flex: 1;
    background: linear-gradient(#e4ffea, #e4ffea);
}

.solid-bar {
    background-color: #4dbd65;
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
