
<template>
  <div class="calendar-container">
    <h2 class="text-2xl font-bold mb-4">可拖動事件日曆</h2>
    <VueCal
      ref="calendar"
      today-button
      style="height: 600px;"
      :events="events"
      :time-from="8 * 60"   
      :time-to="19 * 60"  
      locale="zh-hk"
      hide-weekends
      events-on-month-view
      @event-click="openEditDialog"
      @ready="onReady"
    />
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
        <label for="companyId">公司</label>
        <InputText id="companyId" v-model="form.CompanyID" required />
      </div>

      <div class="p-field">
        <label for="incidentId">事件</label>
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
  </div>
   <Toast group="custom" position="custom" class="custom-toast-position" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import VueCal from 'vue-cal';
import axios from 'axios'
import 'vue-cal/dist/vuecal.css';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

import { useToast } from 'primevue/usetoast';




const events = ref([]);  // 動態事件資料，從 API 請求中獲得
const showDialog = ref(false);
const editedEvent = ref({});
const apiRoot = 'http://localhost:4000/api'
const form = ref({})
const toast = useToast();

// 取得動態事件資料
onMounted(async () => {
  try {
    const response = await fetch('http://localhost:4000/api/events?creatorId=1005');
    const data = await response.json();

    // 將 API 返回的資料轉換為日曆需要的格式
    events.value = data.map(event => {
      // 使用後台提供的 ServiceRecordID 作為事件的唯一 ID
        const eventId = event.ServiceRecordID;
     // console.log('Processing event ID:', eventId);

      // 將 UTC 時間字串轉換為明確的 UTC Date 物件
      const utcStartDate = new Date(event.StartTime + 'Z');
     //console.log('UTC Start Date:', utcStartDate);
      // 使用 toLocaleString 轉換為台北時間字串
      const taipeiStartTime = utcStartDate.toLocaleString('zh-TW', {
        timeZone: 'Asia/Taipei',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      // console.log('Taipei Start Time:', taipeiStartTime);
      // 檢查並轉換結束時間
      let taipeiFinishTime = null;
      if (event.FinishTime) {
        const utcFinishDate = new Date(event.FinishTime + 'Z');
        taipeiFinishTime = utcFinishDate.toLocaleString('zh-TW', {
          timeZone: 'Asia/Taipei',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
      } else {
        // 如果沒有結束時間，則設定為開始時間 + 1 小時
        const defaultFinishDate = new Date(utcStartDate.getTime() + 60 * 60 * 1000);
        taipeiFinishTime = defaultFinishDate.toLocaleString('zh-TW', {
          timeZone: 'Asia/Taipei',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
      }
      //console.log('Taipei Finish Time:', taipeiFinishTime);
      // 動態決定顏色
      let style = { backgroundColor: '#fd9c42d9', color: 'white' }; // 預設橘色
      if (event.Subject?.includes('會議')) {
        style = { backgroundColor: '#4caf50', color: 'white' }; // 綠色
      } else if (event.Subject?.includes('電話')) {
        style = { backgroundColor: '#2196f3', color: 'white' }; // 藍色
      } else if (event.Subject?.includes('拜訪')) {
        style = { backgroundColor: '#9c27b0', color: 'white' }; // 紫色
        }
      
      return {
        // 使用後台傳來的 eventId
        id: eventId,
        start: taipeiStartTime.replace(/\//g, '-'),
        end: taipeiFinishTime.replace(/\//g, '-'),
        title: event.Subject + "/"+ eventId ,  // 顯示標題和 ID 以便識別
        recordId: event.ServiceRecordID,
        style
      };
    });
  } catch (error) {
    console.error('資料載入錯誤:', error);
  }
});

const onReady = () => {
  console.log('Component is ready');
};

/*
// 開啟編輯對話框並顯示事件資料
function openEditDialog(event) {
    
  editedEvent.value = { 
    title: event.title,
    start: event.start,
    end: event.end
  };
    showDialog.value = true;

}*/


async function openEditDialog(event) {
  try {
    console.log('點擊的事件:', event)

    const recordId = event.recordId  // ✅ 直接拿
    //console.log('取得的服務紀錄recordId:', recordId)
    if (!recordId) {
      console.error('事件缺少 recordId')
      return
    }

    // 用 ServiceRecordID 查詢後端
    const res = await axios.get(`http://localhost:4000/api/service-records/${recordId}`)

    form.value = res.data
    //console.log('取得的服務紀錄:', form.value)
    showDialog.value = true
  } catch (err) {
    console.error('讀取服務紀錄失敗', err)
  }
}





// 關閉對話框
function closeDialog() {
  showDialog.value = false;
}


function formatDate(date) {
  if (!date) return null
  const d = new Date(date)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  const ss = String(d.getSeconds()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`
}

async function submitForm() {
  try {
    const payload = {
      ...form.value,
      StartTime: formatDate(form.value.StartTime),
      FinishTime: formatDate(form.value.FinishTime),
     //   StartTime: form..value.start.toISOString().slice(0, 19).replace('T', ' '),  // '2025-09-01 05:30:00'
 // FinishTime: form.value.end.toISOString().slice(0, 19).replace('T', ' ')
    }
    console.log('送出的資料StartTime:',  formatDate(form.value.StartTime));
console.log('送出的資料FinishTime: :', formatDate(form.value.FinishTime));
    await axios.put(`${apiRoot}/service-records/${form.value.ServiceRecordID}`, payload)
    showDialog.value = false
toast.add({
  group: 'custom',         // ✅ 指定群組
  severity: 'success',
  summary: '更新成功',
  detail: `公司資料已更新：${payload.CoShortName}`,
  life: 3000
});
  } catch (err) {
    console.error('更新失敗', err)
   toast.add({
  group: 'custom',
  severity: 'error',
  summary: '更新失敗',
  detail: err.message || '請稍後再試',
  life: 5000
});
  }
}


/*
// 儲存編輯的事件
function saveEvent() {
  // 查找事件並更新
  const eventIndex = events.value.findIndex(e => e.title === editedEvent.value.title);

  if (eventIndex !== -1) {
    // 更新事件資料
    events.value[eventIndex] = { ...editedEvent.value };
  }

  // 強制 Vue 重新渲染，觸發事件更新
  events.value = [...events.value];
  closeDialog();
}
*/



</script>

<style>



.calendar-container {
  max-width: 9000px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.vuecal__event {
  position: relative;
  display: block;
  font-size: 0.85em;
  padding: 0.2em 0.4em;
  margin: 0.1em 0;
  border-radius: 0.5em;
  background: rgba(0, 123, 255, 0.15);   /* 淡藍底 */
  color: #004085;
  cursor: pointer;
  transition: all 0.5s;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.vuecal__event:hover {
  background: rgba(0, 123, 255, 0.25);  /* 滑鼠懸停時顏色加深 */
  color: #002752;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

/* 建議加 !important 避免被覆蓋 */
.custom-toast-position {
  position: fixed !important;
  left: 50% !important;
  bottom: 60px !important;  /* 底部往上偏移，可自調 */
  transform: translateX(-50%) !important;
  z-index: 9999 !important;
}
</style>
