<script setup>
import 'vite/modulepreload-polyfill'
import { useFlagsStore } from '@/stores'
const store = useFlagsStore()
// import moment from "moment-timezone";
moment.locale('es-mx')
import {onBeforeMount} from "vue";
onBeforeMount(()=>{
  console.log('before mount')
  console.log('APP.vue', moment().format('LLLL'))
})
// console.log(store);
setTimeout(() => {
    store.setShowSplash(false);
    console.log('active', store.isShowSplash);
}, 1500);
</script>

<template>
    <div v-if="store.isShowSplash" class="fondo animacionFondo">
        <img src="./assets/images/pngwing.com.png" class="animacionLogo" alt="ss">
    </div>
    <router-view />
</template>

<style scoped>
.fondo {
    background: lightgrey;
    width: 100vw;
    z-index: 1000;
    height: 100vh;
    position: fixed;
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: center;
    align-items: center;
}

.animacionFondo {
    animation-duration:2s;
    animation-delay: .2s;
    animation-iteration-count: 1;
    animation-name: animFondo;
    animation-fill-mode: forwards;
    animation-timing-function: ease;
}

.animacionLogo {
    animation-duration:1.5s;
    animation-delay: .2s;
    animation-iteration-count: 1;
    visibility: hidden;
    animation-name: animLogo;
    animation-fill-mode: forwards;
    animation-timing-function: ease-in-out;

}
.p-button.p-button-sm .p-button-icon,
.p1-button .p-button-icon

{
  font-size: 1.2rem;
}

@keyframes animLogo {
    0% {
        visibility: visible;
        filter: blur(20px) opacity(.4);
        transform: scale(2.6) rotate(60deg);
    }

    20% {
        filter: blur(1px) opacity(.9);
        transform: scale(0.8) rotate(3deg);
    }

    60% {
        filter: blur(0px) opacity(1);
        transform: scale(0.5) rotate(0deg);
    }

    100% {
        filter: blur(4px);
        transform: scale(0.5) rotate(0deg);
    }
}

@keyframes animFondo {
    0% {
        display: flex;
        filter: opacity(1);
    }

    60% {
        filter: opacity(1);
    }

    100% {
        filter: opacity(0);
        display: none;
    }

}
</style>