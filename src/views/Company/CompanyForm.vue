<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-3">公司資料編輯</h2>

    <!-- 🔍 搜尋公司 -->
    <AutoComplete
      v-model="selectedCompany"
      :suggestions="filteredCompanies"
      complete-method="searchCompanies"
      field="displayName"
      placeholder="輸入公司ID或簡稱"
      class="w-full mb-4"
      @item-select="loadCompany"
    />

    <!-- 📋 編輯表單 -->
    <form v-if="company" @submit.prevent="updateCompany" class="space-y-3">
      <div>
        <label class="font-semibold">公司ID</label>
        <InputText v-model="inputCompanyId" class="w-full" @keyup.enter="loadCompanyById" />
      </div>
      <div>
        <label class="font-semibold">公司簡稱</label>
        <InputText v-model="company.CoShortName" class="w-full" />
      </div>
      <div>
        <label class="font-semibold">公司全名</label>
        <InputText v-model="company.CoFullName" class="w-full" />
      </div>
      <div>
        <label class="font-semibold">電話</label>
        <InputText v-model="company.PhoneNumber" class="w-full" />
      </div>
      <div>
        <label class="font-semibold">地址</label>
        <InputTextarea v-model="company.Address" rows="3" class="w-full" />
      </div>

      <Button type="submit" label="儲存" class="p-button-success" />
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import AutoComplete from "primevue/autocomplete";
import InputText from "primevue/inputtext";
import InputTextarea from "primevue/inputtextarea";
import Button from "primevue/button";

const selectedCompany = ref(null);
const filteredCompanies = ref([]);
const company = ref(null);
const inputCompanyId = ref("");

const searchCompanies = async (event) => {
  const res = await axios.get("http://localhost:4000/api/companies/search", {
    params: { q: event.query },
  });
  filteredCompanies.value = res.data.map((c) => ({
    ...c,
    displayName: `${c.CompanyID} - ${c.CoShortName}`,
  }));
};

const loadCompany = async (e) => {
  const id = e.value.CompanyID;
  const res = await axios.get(`http://localhost:4000/api/companies/${id}`);
  company.value = res.data;
};

const loadCompanyById = async () => {
  const res = await axios.get(`http://localhost:4000/api/companies/${inputCompanyId.value}`);
  company.value = res.data;
};

const updateCompany = async () => {
  await axios.put(`http://localhost:4000/api/companies/${company.value.CompanyID}`, company.value);
  alert("更新成功！");
};
</script>
