<script setup>
import Button from 'primevue/button';
</script>

<template>
    <div :style="{ position: 'relative', borderRadius: '20px', backgroundColor: '#fff', width: '100%', height: '1033px', overflow: 'hidden', textAlign: 'left', fontSize: '32px', color: '#fff', fontFamily: 'Lato' }">
        <div :style="{ position: 'absolute', top: '87px', left: '319px', borderRadius: '50%', backgroundColor: '#fff', border: '1px solid #eee', boxSizing: 'border-box', width: '27px', height: '27px' }" />
        <img :style="{ position: 'absolute', top: '93.5px', left: '327.2px', width: '9.3px', height: '14px' }" alt="" src="/vector-6.svg" />
        <div :style="{ position: 'absolute', top: '389px', left: '367px', borderRadius: '0px 0px 20px 20px', overflow: 'hidden' }" />
        <b :style="{ position: 'absolute', top: '43px', left: '50px', fontSize: '48px', display: 'inline-block', color: '#0d294c', width: '382px', height: '52px' }">Coordinación</b>
        <div :style="{ position: 'absolute', top: '107px', left: '50px', borderRadius: '20px', backgroundColor: '#d6d6d6', width: '378px', height: '2px', overflow: 'hidden' }" />
        <div
            :style="{
                position: 'absolute',
                top: '186px',
                left: 'calc(50% - 407px)',
                width: '1088px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px',
                boxSizing: 'border-box',
                gap: '10px'
            }"
        >
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
            </div>
        </div>

        <b :style="{ position: 'absolute', top: '139px', left: '50px', color: '#000' }">Maes Activos</b>
        <b :style="{ position: 'absolute', top: '557px', left: '50px', color: '#000' }">Maes pendientes</b>
        <Button label="Generar Reporte" size="large" class="custom-button" />
    </div>
</template>

<style scoped>
.custom-button {
    position: absolute;
    top: 117px;
    left: 1109px;
    border-radius: 20px;
    background-color: #1e436e;
    width: 263px;
    height: 51px;
    overflow: hidden;
    font-size: 24px;
    color: #fff; /* Cambiar el color del texto según tus necesidades */
}

.custom-button .p-button-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
