// src/views/serviceRecords/index.js
import List from './c_List.vue'
//import Create from './c_Create.vue'
//import Edit from './c_Edit.vue'

export default {
  path: '/company',
  children: [
    { path: '', component: List }, // 預設列表
   // { path: 'sR_create', component: Create }, // 新增
   // { path: 'sR_edit/:id', component: Edit, props: true } // 編輯
  ]
}
