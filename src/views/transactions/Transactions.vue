<template>
  <div class="grid">
    <TransactionsListTable v-if="!isLoading" title="Transacciones" :payload="transactionsNoba" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import TransactionsListTable from '@/views/transactions/components/TransactionsListTable.vue';

const isLoading = ref(true);

isLoading.value = false;

const transactionsNoba = [
  {
    id: 1,
    client_name: 'Cliente 1',
    total_wire: 100,
    total_wire_out: 50,
    swap_buy: 10,
    swap_sell: 5,
    date: '2023-10-17',
    status: 'approved'
  },
  {
    id: 2,
    client_name: 'Cliente 2',
    total_wire: 150,
    total_wire_out: 75,
    swap_buy: 12,
    swap_sell: 6,
    date: '2023-10-17',
    status: 'pending'
  },
  {
    id: 3,
    client_name: 'Cliente 3',
    total_wire: 80,
    total_wire_out: 40,
    swap_buy: 8,
    swap_sell: 4,
    date: '2023-10-17',
    status: 'rejected'
  },
  {
    id: 4,
    client_name: 'Cliente 4',
    total_wire: 120,
    total_wire_out: 60,
    swap_buy: 15,
    swap_sell: 7.5,
    date: '2023-10-17',
    status: 'approved'
  },
  {
    id: 5,
    client_name: 'Cliente 5',
    total_wire: 200,
    total_wire_out: 100,
    swap_buy: 20,
    swap_sell: 10,
    date: '2023-10-17',
    status: 'pending'
  },
  {
    id: 6,
    client_name: 'Cliente 6',
    total_wire: 90,
    total_wire_out: 45,
    swap_buy: 9,
    swap_sell: 4.5,
    date: '2023-10-17',
    status: 'rejected'
  },
  {
    id: 7,
    client_name: 'Cliente 7',
    total_wire: 140,
    total_wire_out: 70,
    swap_buy: 14,
    swap_sell: 7,
    date: '2023-10-17',
    status: 'approved'
  },
  {
    id: 8,
    client_name: 'Cliente 8',
    total_wire: 60,
    total_wire_out: 30,
    swap_buy: 6,
    swap_sell: 3,
    date: '2023-10-17',
    status: 'pending'
  },
  {
    id: 9,
    client_name: 'Cliente 9',
    total_wire: 110,
    total_wire_out: 55,
    swap_buy: 11,
    swap_sell: 5.5,
    date: '2023-10-17',
    status: 'rejected'
  },
  {
    id: 10,
    client_name: 'Cliente 10',
    total_wire: 180,
    total_wire_out: 90,
    swap_buy: 18,
    swap_sell: 9,
    date: '2023-10-17',
    status: 'approved'
  }
];
</script>
