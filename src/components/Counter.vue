<template>
    <div class="count">
        {{ storeCounter.count }}
        {{  storeCounter.otherObject }}
    </div>
    <div class="buttons">
        <button @click="storeCounter.decreaseCount">-</button>
        <button @click="storeCounter.increaseCount">+</button>
    </div>

    <hr>

    <div>
        This counter is: {{ storeCounter.oddOrEven }}
    </div>

    <hr>

    <div>
        <hr>
        <h3>Edit Counter:</h3>
        <input v-model="storeCounter.count" type="number">
    </div>
</template>

<script setup>

import { useCounterStore } from '@/stores/counter'

const storeCounter = useCounterStore()

</script>

<style>
.count {
    font-size: 60px;
    margin: 20px;
}
.buttons {
    font-size: 40px;
    margin: 20px;
}
</style>