// src/views/serviceRecords/index.js
import List from './sR_List.vue'
import Create from './sR_Create.vue'
import Edit from './sR_Edit.vue'
import Delete from './sR_Delete.vue'

export default {
  path: '/service-records',
  component: List,   // 預設顯示清單
  children: [
    { path: 'sR_create', component: Create },
    { path: 'sR_edit/:id', component: Edit, props: true },
    { path: 'sR_delete/:id', component: Delete, props: true }
  ]
}
