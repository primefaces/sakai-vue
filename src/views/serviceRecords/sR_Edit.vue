<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">編輯服務紀錄</h2>
    <form @submit.prevent="update">
      <input v-model="form.Subject" class="border p-2 mb-2 w-full"/>
      <textarea v-model="form.ProblemDescription" class="border p-2 mb-2 w-full"></textarea>
      <textarea v-model="form.WorkDescription" class="border p-2 mb-2 w-full"></textarea>
      <Button type="submit" label="更新" class="p-button-warning"/>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'

const apiRoot = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
const router = useRouter()
const route = useRoute()
const form = ref({})

onMounted(async () => {
  const res = await axios.get(`${apiRoot}/service-records`, { params: { incidentId: route.params.id } })
  form.value = res.data[0]
})

const update = async () => {
  await axios.put(`${apiRoot}/service-records/${route.params.id}`, form.value)
  router.push('/service-records')
}
</script>
