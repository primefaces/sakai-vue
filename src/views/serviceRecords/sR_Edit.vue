<template>
  <Dialog 
    v-model:visible="showDialog" 
    header="編輯服務紀錄" 
    style="width: 50vw;" 
    :closable="false"
  >
    <form @submit.prevent="submitForm" class="form-container">
      <div class="p-field">
        <label for="subject">主旨</label>
        <InputText id="subject" v-model="form.Subject" required />
      </div>

      <div class="p-field">
        <label for="companyId">公司ID</label>
        <InputText id="companyId" v-model="form.CompanyID" required />
      </div>

      <div class="p-field">
        <label for="incidentId">事件ID</label>
        <InputText id="incidentId" v-model="form.IncidentID" required />
      </div>

      <div class="p-field">
        <label for="processTime">處理時間（小時）</label>
        <InputNumber id="processTime" v-model="form.ProcessTime" showButtons :min="0" required />
      </div>

      <div class="p-field">
        <label for="startTime">開始時間</label>
        <DatePicker id="startTime" v-model="form.StartTime" showTime hourFormat="24" required />
      </div>

      <div class="p-field">
        <label for="finishTime">結束時間</label>
        <DatePicker id="finishTime" v-model="form.FinishTime" showTime hourFormat="24" required />
      </div>

      <div class="p-field">
        <label for="problem">問題描述</label>
        <Textarea id="problem" v-model="form.ProblemDescription" rows="3" :style="{ width: '100%' }"></Textarea>
      </div>

      <div class="p-field">
        <label for="work">處理描述</label>
        <Textarea id="work" v-model="form.WorkDescription" rows="3" :style="{ width: '100%' }"></Textarea>
      </div>

      <footer class="footer-btns">
        <Button label="更新" icon="pi pi-check" class="p-button-warning" type="submit"></Button>
        <Button label="關閉" icon="pi pi-times" class="p-button-secondary" @click="closeDialog"></Button>
      </footer>
    </form>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'

const props = defineProps({
  record: { type: Object, required: true }
})
const emit = defineEmits(['updated', 'close'])

const showDialog = ref(true)
const form = ref({ ...props.record })

// 當 record 改變時，自動更新表單
watch(() => props.record, (val) => {
  if (val) form.value = { ...val }
}, { immediate: true })

const apiRoot = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

async function submitForm() {
  try {
    await axios.put(`${apiRoot}/service-records/${form.value.ServiceRecordID}`, form.value)
    emit('updated')   // 通知父元件刷新
    closeDialog()
  } catch (err) {
    console.error('更新失敗', err)
  }
}

function closeDialog() {
  showDialog.value = false
  emit('close')
}
</script>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 100%;
}
.p-field {
  display: flex;
  align-items: center;
}
.p-field > label {
  width: 100px;
  text-align: right;
  margin-right: 1rem;
  font-weight: 500;
}
.p-field > .p-inputtextarea {
  resize: vertical;
  flex: 1;
  min-width: 300px;
}
.p-field > .p-inputtext,
.p-field > .p-inputnumber,
.p-field > .p-datepicker {
  flex: 1;
  min-width: 200px;
}
.footer-btns {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
}
</style>
