<template>
  <div class="p-4 max-w-2xl mx-auto">
    <!-- 按鈕控制顯示表單 -->
    <Button label="新增服務紀錄" icon="pi pi-plus" class="p-button-success mb-4" @click="toggleForm" />

    <!-- 浮動表單 -->
    <div v-if="showForm" class="floating-form p-4 shadow-lg rounded-md bg-white w-96 absolute top-1/4 left-1/2 transform -translate-x-1/2">
      <h2 class="text-xl font-bold mb-4">新增服務紀錄</h2>
      <form @submit.prevent="save" class="flex flex-col gap-4">
        <div>
          <label class="block mb-1">主旨</label>
          <InputText v-model="form.Subject" placeholder="輸入主旨" class="w-full" />
        </div>

        <div>
          <label class="block mb-1">公司</label>
          <Dropdown
            v-model="form.CompanyID"
            :options="companies"
            optionLabel="name"
            optionValue="id"
            placeholder="選擇公司"
            class="w-full"
          />
        </div>

        <div>
          <label class="block mb-1">事件</label>
          <Dropdown
            v-model="form.IncidentID"
            :options="incidents"
            optionLabel="number"
            optionValue="id"
            placeholder="選擇事件"
            class="w-full"
          />
        </div>

        <div>
          <label class="block mb-1">問題描述</label>
          <Textarea v-model="form.ProblemDescription" rows="3" class="w-full" />
        </div>

        <div>
          <label class="block mb-1">處理描述</label>
          <Textarea v-model="form.WorkDescription" rows="3" class="w-full" />
        </div>

        <div class="flex justify-end gap-2">
          <Button type="button" label="取消" class="p-button-text" @click="toggleForm" />
          <Button type="submit" label="保存" class="p-button-success" />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'

const apiRoot = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
const router = useRouter()

const form = ref({
  Subject: '',
  CompanyID: null,
  IncidentID: null,
  ProblemDescription: '',
  WorkDescription: '',
  CreatorID: '1005'
})

const companies = ref([])
const incidents = ref([])
const showForm = ref(false)  // 控制浮動表單顯示

const loadMeta = async () => {
  try {
    const [cRes, iRes] = await Promise.all([
      axios.get(`${apiRoot}/companies`),
      axios.get(`${apiRoot}/incidents`, { params: { creatorId: '1005' } })
    ])
    companies.value = cRes.data.map(c => ({ id: c.CompanyID, name: c.CompanyName }))
    incidents.value = iRes.data.map(i => ({ id: i.IncidentID, number: `${i.IncidentID} - ${i.IncidentNumber}` }))
  } catch (err) {
    console.error('載入下拉選單失敗', err)
  }
}

const save = async () => {
  try {
    await axios.post(`${apiRoot}/service-records`, form.value)
    alert('新增成功')
    router.push('/service-records')
  } catch (err) {
    console.error('新增失敗', err)
    alert('新增失敗，請稍後再試')
  }
}

const toggleForm = () => {
  showForm.value = !showForm.value  // 切換浮動表單顯示狀態
}

onMounted(loadMeta)
</script>

<style scoped>
.floating-form {
  z-index: 1000;  /* 確保表單在畫面上層 */
  transition: transform 0.3s ease-in-out;
}
</style>
