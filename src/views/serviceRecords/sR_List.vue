<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold">服務紀錄</h2>
      <div>
        <Button label="新增" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
        <Button label="編輯" icon="pi pi-pencil" class="p-button-warning mr-2" :disabled="!selectedRecord" @click="editRecord" />
        <Button label="刪除" icon="pi pi-trash" class="p-button-danger" :disabled="!selectedRecord" @click="confirmDelete" />
      </div>
    </div>

    <DataTable
      :value="records"
      selectionMode="single"
      :selection="selectedRecord"         
      @update:selection="onSelectionChange"
      dataKey="ServiceRecordID"
      paginator
      :rows="10"
      class="shadow rounded"
    >
      <Column selectionMode="single" style="width: 3rem" />
      <Column field="ServiceRecordID" header="ID" style="width:120px" />
      <Column field="Subject" header="主旨" />
      <Column field="CompanyDisplay" header="公司" />
      <Column field="IncidentDisplay" header="事件編號" />
      <Column field="StartTime" header="開始" :body="formatDate" />
      <Column field="ProcessTime" header="處理(H)" />
    </DataTable>

    <!-- 浮動表單 Dialog -->
    <Dialog :header="isEdit ? '編輯服務紀錄' : '新增服務紀錄'" v-model:visible="showDialog" :closable="true" style="width: 400px;">
      <form @submit.prevent="submitForm">
        <div class="p-field">
          <label for="subject">主旨</label>
          <InputText id="subject" v-model="form.Subject" required />
        </div>

        <div class="p-field">
          <label for="company">公司</label>
          <InputText id="company" v-model="form.CompanyDisplay" required />
        </div>

        <div class="p-field">
          <label for="incident">事件編號</label>
          <InputText id="incident" v-model="form.IncidentDisplay" required />
        </div>

        <div class="p-field">
          <label for="startTime">開始時間</label>
          <DatePicker id="startTime" v-model="form.StartTime" showTime hourFormat="24" required />
        </div>

        <div class="p-field">
          <label for="processTime">處理時間（小時）</label>
          <InputNumber id="processTime" v-model="form.ProcessTime" required />
        </div>

        <footer>
          <Button label="送出" icon="pi pi-check" class="p-button-success" type="submit" />
        </footer>
      </form>
    </Dialog>

    <!-- ConfirmDialog 组件 -->
    <ConfirmDialog />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ConfirmDialog from 'primevue/confirmdialog';
import { useRouter } from 'vue-router';
import Dialog from 'primevue/dialog'; // 引入Dialog
import InputText from 'primevue/inputtext'; // 引入 InputText
import InputNumber from 'primevue/inputnumber'; // 引入 InputNumber
//import Calendar from 'primevue/calendar'; // 引入 Calendar
import DatePicker from 'primevue/datepicker';




export default {
  name: 'ServiceRecordsView',
  components: {
    ConfirmDialog,
    Dialog,
    InputText,
    InputNumber,
    DatePicker,
  },
  setup() {
    const records = ref([]);
    const selectedRecord = ref(null);
    const showDialog = ref(false);
    const isEdit = ref(false); // 用來判斷是否是編輯模式
    const form = ref({
      ServiceRecordID: null,
      Subject: '',
      CompanyID: null,
      CompanyDisplay: '',
      IncidentID: null,
      IncidentDisplay: '',
      StartTime: null,
      FinishTime: null,
      ProcessTime: 0,
      ProblemDescription: '',
      WorkDescription: '',
      CreatorID: '1005'
    });

    const companies = ref([]);
    const incidents = ref([]);
    const apiRoot = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

    const loadData = async () => {
      try {
        const res = await axios.get(`${apiRoot}/service-records`, { 
          params: { creatorId: '1005', limit: 150 } 
        });
        records.value = res.data.map(r => ({
          ServiceRecordID: r.ServiceRecordID,
          Subject: r.Subject,
          StartTime: r.StartTime,
          FinishTime: r.FinishTime,
          ProcessTime: r.ProcessTime,
          ProblemDescription: r.ProblemDescription,
          WorkDescription: r.WorkDescription,
          CompanyID: r.CompanyID,
          CompanyDisplay: `${r.CompanyID || ''} ${r.CoShortName || ''}`,
          IncidentID: r.IncidentID,
          IncidentDisplay: `${r.IncidentID || ''} ${r.IncidentNumber || ''}`
        }));
      } catch (err) {
        console.error('Error loading service records', err);
      }
    };

    const loadMeta = async () => {
      try {
        if (records.value.length === 0) {
          await loadData();
        }
        companies.value = [
          ...new Map(records.value.map(r => [r.CompanyID, { id: r.CompanyID, name: r.CompanyDisplay }])).values()
        ];
        incidents.value = [
          ...new Map(records.value.map(r => [r.IncidentID, { id: r.IncidentID, number: r.IncidentDisplay }])).values()
        ];
      } catch (err) {
        console.error('Error building meta data', err);
      }
    };

    const openNew = () => {
      form.value = {
        ServiceRecordID: null,
        Subject: '',
        CompanyID: null,
        CompanyDisplay: '',
        IncidentID: null,
        IncidentDisplay: '',
        StartTime: null,
        FinishTime: null,
        ProcessTime: 0,
        ProblemDescription: '',
        WorkDescription: '',
        CreatorID: '1005'
      };
      isEdit.value = false;
      showDialog.value = true; // 顯示浮動表單
    };

      const onSelectionChange = (val) => {
      console.log('update:selection 觸發', val);
      selectedRecord.value = val;
      form.value = { ...val };
      showDialog.value = true;
    };

    const editRecord = () => {
      if (selectedRecord.value) {
        // 將選中的紀錄資料填入表單
        form.value = { ...selectedRecord.value };
        isEdit.value = true;
        showDialog.value = true; // 顯示浮動表單
      }
    };


    const submitForm = () => {
      console.log('表單資料', form.value);
      closeDialog(); // 關閉表單，不執行任何儲存操作
    };

    const confirmDelete = () => { if (selectedRecord.value) console.log('delete', selectedRecord.value); };

    const formatDate = (row) => {
      const val = row.StartTime || row.FinishTime;
      if (!val) return '';
      const d = new Date(val);
      return d.toLocaleString();
    };

    onMounted(async () => {
      await loadMeta();
      await loadData();
    });

    return {
      records, selectedRecord, showDialog, isEdit, form, companies, incidents,
      openNew,  editRecord, submitForm, confirmDelete, onSelectionChange, formatDate
    };     
      
  }
};
</script>

<style scoped>
/* 這裡可以添加一些樣式，根據需求來調整 */
</style>
