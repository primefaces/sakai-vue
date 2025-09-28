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
      @selection-change="e => selectedRecord = e.value"
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
      <Column field="ProcessTime" header="處理(分)" />
    </DataTable>

    <!-- ConfirmDialog 组件 -->
    <ConfirmDialog />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ConfirmDialog from 'primevue/confirmdialog';  // 导入 ConfirmDialog 组件

export default {
  name: 'ServiceRecordsView',
  components: {
    ConfirmDialog
  },
  setup() {
    const records = ref([]);
    const selectedRecord = ref(null);
    const showDialog = ref(false);
    const isEdit = ref(false);

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

    // 加载数据
    const loadData = async () => {
      try {
        const res = await axios.get(`${apiRoot}/service-records`, { 
          params: { creatorId: '1005', limit: 150 } 
        });

        // 🔹 組合「公司代號+公司名稱」和「事件代號+事件編號」
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
          IncidentDisplay: `${r.IncidentID || ''} ${r.IncidentName || ''}`
        }));
      } catch (err) {
        console.error('Error loading service records', err);
      }
    };

    // 🔹 從 records 提取 meta
    const loadMeta = async () => {
      try {
        if (records.value.length === 0) {
          await loadData();
        }

        companies.value = [
          ...new Map(
            records.value.map(r => [r.CompanyID, { id: r.CompanyID, name: r.CompanyDisplay }])
          ).values()
        ];

        incidents.value = [
          ...new Map(
            records.value.map(r => [r.IncidentID, { id: r.IncidentID, number: r.IncidentDisplay }])
          ).values()
        ];
      } catch (err) {
        console.error('Error building meta data', err);
      }
    };

    // 新增记录
    const openNew = () => {
      isEdit.value = false;
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
        ProblemDescription:'',
        WorkDescription:'',
        CreatorID:'1005'
      };
      showDialog.value = true;
    };

    // 编辑记录
    const editRecord = () => {
      if (!selectedRecord.value) return;
      isEdit.value = true;
      form.value = { ...selectedRecord.value };  // 深拷贝记录
      showDialog.value = true;
    };

    // 保存记录
    const saveRecord = async () => {
      try {
        if (isEdit.value && form.value.ServiceRecordID) {
          await axios.put(`${apiRoot}/service-records/${form.value.ServiceRecordID}`, form.value);
        } else {
          await axios.post(`${apiRoot}/service-records`, form.value);
        }
        showDialog.value = false;
        await loadData();
      } catch (err) {
        console.error('Error saving record', err);
      }
    };

    // 删除记录
    const confirmDelete = () => {
      if (!selectedRecord.value) return;
      this.$confirm.require({
        message: `確定要刪除 ID=${selectedRecord.value.ServiceRecordID} 嗎？`,
        header: '刪除確認',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
          try {
            await axios.delete(`${apiRoot}/service-records/${selectedRecord.value.ServiceRecordID}`);
            selectedRecord.value = null;
            await loadData();
          } catch (err) {
            console.error('刪除失敗', err);
          }
        }
      });
    };

    // 格式化日期
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
      openNew, editRecord, saveRecord, confirmDelete, formatDate
    };
  }
};
</script>
