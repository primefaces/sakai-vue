<template>
  <Dialog 
    v-model:visible="showDialog" 
    header="新增服務紀錄" 
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
        <Button label="送出" icon="pi pi-check" class="p-button-success" type="submit" ></Button>
        <Button label="關閉" icon="pi pi-times" class="p-button-secondary" @click="closeDialog"></Button>
      </footer>
    </form>
  </Dialog>
</template>

<script setup>
import { ref , onMounted } from 'vue';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import DatePicker from 'primevue/datepicker';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';


const showDialog = ref(false);
onMounted(() => {
  showDialog.value = true;
});

const form = ref({
  Subject: '',
  CompanyID: '',
  IncidentID: '',
  ProcessTime: 0,
  StartTime: null,
  FinishTime: null,
  ProblemDescription: '',
  WorkDescription: '' 
});

function submitForm() {
  console.log('送出表單資料', form.value);
  showDialog.value = false;
}

function closeDialog() {
  showDialog.value = false;
}
</script>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 100%;
}

/* 每個欄位是 flex 排列 */
.p-field {
  display: flex;
  align-items: center;
}

/* label 固定寬度並靠右 */
.p-field > label {
  width: 100px;  /* 固定寬度 */
  text-align: right;
  margin-right: 1rem;
  font-weight: 500;
}

/* 新增必填欄位 label 紅星號 */
.p-field > label[for]::after {
  content: '*';
  color: red;
  margin-left: 0.25rem;
  font-weight: bold;
  font-size: 1.2em;
  vertical-align: middle;
}

.p-field > .p-inputtextarea {
  resize: vertical;         /* 允許使用者上下拉伸 */
  flex: 1;
  width: 100%;
  min-width: 300px;
}


/* 輸入框寬度固定 */
.p-field > .p-inputtext,
.p-field > .p-inputnumber,
.p-field > .p-datepicker {
  flex: 1; /* 輸入框佔剩餘寬度 */
  min-width: 300px;
  min-width: 200px; /* 最小寬度，避免太窄 */
}



/* footer 按鈕靠右排列 */
.footer-btns {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
}
</style>
