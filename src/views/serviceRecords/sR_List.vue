<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold">服務紀錄</h2>
      <div>
        <Button label="新增" icon="pi pi-plus" class="p-button-success mr-2" @click="showCreate = true" />
        <Button label="編輯" icon="pi pi-pencil" class="p-button-warning mr-2" :disabled="!selectedRecord" @click="showEdit = true" />
        <Button label="刪除" icon="pi pi-trash" class="p-button-danger" :disabled="true" />
      </div>
    </div>

    <DataTable
      :value="records"
      selectionMode="single"
      v-model:selection="selectedRecord"
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

    <!-- 新增 Dialog -->
    <Dialog header="新增服務紀錄" v-model:visible="showCreate" style="width: 400px">
      <sR_Create @saved="loadData" @close="showCreate=false" />
    </Dialog>

    <!-- 編輯 Dialog -->
    <Dialog header="編輯服務紀錄" v-model:visible="showEdit" style="width: 400px">
      <sR_Edit :record="selectedRecord" @saved="loadData" @close="showEdit=false" />
    </Dialog>

    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ConfirmDialog from 'primevue/confirmdialog'
import Dialog from 'primevue/dialog'
import sR_Create from './sR_Create.vue'
import sR_Edit from './sR_Edit.vue'

const records = ref([])
const selectedRecord = ref(null)
const showCreate = ref(false)
const showEdit = ref(false)

const apiRoot = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

const loadData = async () => {
  try {
    const res = await axios.get(`${apiRoot}/service-records`, { params: { creatorId: '1005', limit: 150 } })
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
    }))
  } catch (err) {
    console.error('Error loading service records', err)
  }
}

const confirmDelete = () => {
  if (selectedRecord.value) console.log('delete', selectedRecord.value)
}

const formatDate = (row) => {
  const val = row.StartTime || row.FinishTime
  if (!val) return ''
  const d = new Date(val)
  return d.toLocaleString()
}

onMounted(loadData)
</script>
