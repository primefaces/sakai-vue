<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">刪除確認</h2>
    <p>確定要刪除 ID = {{ id }} 嗎？</p>
    <div class="mt-4">
      <Button label="刪除" icon="pi pi-trash" class="p-button-danger mr-2" @click="remove"/>
      <RouterLink to="/service-records">
        <Button label="取消" class="p-button-secondary"/>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'

const apiRoot = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
const router = useRouter()
const route = useRoute()
const id = route.params.id

const remove = async () => {
  await axios.delete(`${apiRoot}/service-records/${id}`)
  router.push('/service-records')
}
</script>
