<script lang="ts" setup>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";

const toast = useToast();

const increaseCount = () => {
    count.value++;

    if (count.value === 3) {
        toast.add({ severity: "success", summary: "PrimeVue", detail: "Welcome to PrimeVue + Create Vue", life: 3000 });

        count.value = 0;
    }
};

const count = ref(0);
</script>

<template>
    <div class="greetings">
        <Toast />

        <h3>
            <a href="https://vitejs.dev/" target="_blank" rel="noopener">Vite</a> +
            <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a> +
            <a href="https://primevue.org/" target="_blank" rel="noopener">PrimeVue</a>.
        </h3>

        <Button @click="increaseCount" label="Count"></Button>
        <h5 class="green">{{ count }}</h5>
    </div>
</template>

<style scoped>
h1 {
    font-weight: 500;
    font-size: 2.6rem;
    top: -10px;
}

h3 {
    font-size: 1.2rem;
}

.green {
    margin-top: 20px;
}
button {
    margin-top: 20px;
}
</style>
