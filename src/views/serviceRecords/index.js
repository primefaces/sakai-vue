// src/views/serviceRecords/index.js
import List from './sR_List.vue'
import Create from './sR_Create.vue'
import Edit from './sR_Edit.vue'

export default {
  path: '/service-records',
  children: [
    { path: '', component: List }, // 預設列表
    { path: 'sR_create', component: Create }, // 新增
    { path: 'sR_edit/:id', component: Edit, props: true } // 編輯
  ]
}
