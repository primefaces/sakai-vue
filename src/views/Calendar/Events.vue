
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
      @event-click="openEditDialog"
      @ready="onReady"
    />
    <Dialog v-model:visible="showDialog" :header="'編輯事件'" :style="{ width: '50vw' }">
      <template #footer>
        <Button label="取消" icon="pi pi-times" @click="closeDialog" />
        <Button label="儲存" icon="pi pi-check" @click="saveEvent" />
      </template>
      <div>
        <InputText v-model="editedEvent.title" placeholder="事件標題" />
        <InputText v-model="editedEvent.start" placeholder="開始時間" />
        <InputText v-model="editedEvent.end" placeholder="結束時間" />
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

const events = ref([]);  // 動態事件資料，從 API 請求中獲得
const showDialog = ref(false);
const editedEvent = ref({});



// 取得動態事件資料
onMounted(async () => {
  try {
    const response = await fetch('http://localhost:4000/api/events?creatorId=1005');
    const data = await response.json();

    // 將 API 返回的資料轉換為日曆需要的格式
    events.value = data.map(event => {
      // 使用後台提供的 ServiceRecordID 作為事件的唯一 ID
        const eventId = event.ServiceRecordID;
      

      // 將 UTC 時間字串轉換為明確的 UTC Date 物件
      const utcStartDate = new Date(event.StartTime + 'Z');

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
        title: event.Subject || '(無標題)',
        style
      };
    });
  } catch (error) {
    console.error('資料載入錯誤:', error);
  }
});

// 開啟編輯對話框並顯示事件資料
function openEditDialog(event) {
    
  editedEvent.value = { 
    title: event.title,
    start: event.start,
    end: event.end
  };
    showDialog.value = true;

}



// 關閉對話框
function closeDialog() {
  showDialog.value = false;
}

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
</style>
