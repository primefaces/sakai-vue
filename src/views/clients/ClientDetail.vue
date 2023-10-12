<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';

import ClientDetailHeader from '@/views/clients/components/ClientDetailHeader.vue';
import ClientDetailTabs from '@/views/clients/components/ClientDetailTabs.vue';

const route = useRoute();

onMounted(() => {
  console.log('client detail client id', route.params.clientId);
});
</script>

<template>
  <ClientDetailHeader></ClientDetailHeader>

  <ClientDetailTabs></ClientDetailTabs>
</template>
