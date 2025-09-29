<template>
  <div class="p-4">

    <!-- 📋 公司表格 -->
<DataTable
  :value="companies"
  :lazy="true"
  :paginator="true"
  :rows="10"
  :totalRecords="totalRecords"
  @lazy-load="onLazyLoad"
  @page="onPage"
  dataKey="CompanyID"
  class="p-datatable-gridlines"
>


      <Column field="CompanyID" header="公司ID" />
      <Column field="CoShortName" header="公司簡稱" />
      <Column field="CoFullName" header="公司全名" />
      <Column field="PhoneNumber" header="電話" />
      <Column field="Address" header="地址" />
      <Column header="編輯">
        <template #body="slotProps">
          <Button
            label="編輯"
            icon="pi pi-pencil"
            class="p-button-text"
            @click="editCompany(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>

    <!-- 📋 編輯表單 Dialog -->
    <Dialog v-model:visible="showDialog" header="編輯公司" :closable="false" style="width:50vw">
      <form @submit.prevent="updateCompany" class="space-y-3">
        <InputText v-model="form.CompanyID" label="公司ID" disabled class="w-full" />
        <InputText v-model="form.CoShortName" label="公司簡稱" class="w-full" />
        <InputText v-model="form.CoFullName" label="公司全名" class="w-full" />
        <InputText v-model="form.PhoneNumber" label="電話" class="w-full" />
        <InputTextarea v-model="form.Address" label="地址" rows="3" class="w-full" />
        <div class="flex justify-end gap-2 mt-2">
          <Button label="取消" icon="pi pi-times" class="p-button-secondary" @click="closeDialog" />
          <Button label="儲存" icon="pi pi-check" type="submit" class="p-button-success" />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import AutoComplete from 'primevue/autocomplete';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import InputTextarea from 'primevue/textarea';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { onMounted } from 'vue';



const companies = ref([]);
const totalRecords = ref(0);
const selectedCompany = ref(null);
const filteredCompanies = ref([]);
const form = ref({});
const showDialog = ref(false);

onMounted(() => {
  onLazyLoad({ first: 0, rows: 10 });
});

const onLazyLoad = async (event) => {
  //console.log('onLazyLoad event:', event);
  const first = event.first ?? 0;
  const rows = event.rows ?? 10;
  try {
    const res = await axios.get('http://localhost:4000/api/companies/searchall', {
      params: { first, rows }
    });
    //console.log('API 回傳:', res.data);
    companies.value = res.data.items;
    totalRecords.value = res.data.total;
  } catch (err) {
    console.error('載入資料失敗', err);
  }
};


const onPage = (event) => {
  console.log('page event:', event);
  onLazyLoad(event);
};


const editCompany = (companyData) => {
  form.value = { ...companyData };
  showDialog.value = true;
};

const loading = ref(false);
const updateCompany = async () => {
  try {
    loading.value = true;

    const updates = { ...form.value };

    const skipFields = ["CompanyID", "CreateDate", "CreatorID", "ModifyDate"];
    const keys = Object.keys(updates).filter(
      k => updates[k] !== undefined && !skipFields.includes(k)
    );

    const payload = { CompanyID: updates.CompanyID };
    keys.forEach(key => {
      payload[key] = updates[key];
    });

   // console.log('送出的淨化資料:', payload);

    await axios.put(`http://localhost:4000/api/companies/${payload.CompanyID}`, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // 更新成功後，把 companies 陣列裡該筆資料更新
    const idx = companies.value.findIndex(c => c.CompanyID === payload.CompanyID);
    if (idx !== -1) {
      companies.value[idx] = { ...companies.value[idx], ...payload };
    }

    alert('更新成功');
    showDialog.value = false;

  } catch (err) {
    console.error("❌ 更新錯誤:", err);
    alert('更新失敗，請稍後再試');
  } finally {
    loading.value = false;
  }
};





const closeDialog = () => { showDialog.value = false; };
</script>
