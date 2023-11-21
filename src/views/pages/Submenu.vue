<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const title = ref(null);

watch(
    () => route.params,
    (newParams) => {
        title.value = newParams.title;
    }
);

onMounted(() => {
    console.log(route.params);
    title.value = route.params.title;
});
</script>

<template>
    <div className="card">
        <h5>Submenu {{ title }}</h5>
    </div>
</template>
