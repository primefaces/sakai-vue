<!--<script setup lang="ts">-->
<!--import { FilterMatchMode, FilterOperator } from 'primevue/api';-->
<!--import Column from 'primevue/column';-->
<!--import DataTable from 'primevue/datatable';-->
<!--import TriStateCheckbox from 'primevue/tristatecheckbox';-->
<!--import Slider from 'primevue/slider';-->
<!--import InputNumber from 'primevue/inputnumber';-->
<!--import ProgressBar from 'primevue/progressbar';-->
<!--import { ref, onBeforeMount } from 'vue';-->

<!--const customer1 = ref(null);-->
<!--const filters1 = ref(null);-->
<!--const loading1 = ref(null);-->
<!--const loading2 = ref(null);-->
<!--const statuses = ref(['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal']);-->

<!--onBeforeMount(() => {-->
<!--  customer1.value = [-->
<!--    {-->
<!--      id: 1000,-->
<!--      name: 'James Butt',-->
<!--      country: {-->
<!--        name: 'Algeria',-->
<!--        code: 'dz'-->
<!--      },-->
<!--      company: 'Benton, John B Jr',-->
<!--      status: 'unqualified',-->
<!--      verified: true,-->
<!--      activity: 17,-->
<!--      representative: {-->
<!--        name: 'Ioni Bowcher',-->
<!--        image: 'ionibowcher.png'-->
<!--      },-->
<!--      balance: 70663,-->
<!--      date: new Date()-->
<!--    },-->
<!--    {-->
<!--      id: 1000,-->
<!--      name: 'James Butt',-->
<!--      country: {-->
<!--        name: 'Algeria',-->
<!--        code: 'dz'-->
<!--      },-->
<!--      company: 'Benton, John B Jr',-->
<!--      status: 'unqualified',-->
<!--      verified: true,-->
<!--      activity: 17,-->
<!--      representative: {-->
<!--        name: 'Ioni Bowcher',-->
<!--        image: 'ionibowcher.png'-->
<!--      },-->
<!--      balance: 70663,-->
<!--      date: new Date()-->
<!--    }-->
<!--  ];-->

<!--  loading2.value = false;-->
<!--  loading1.value = false;-->

<!--  initFilters1();-->
<!--});-->

<!--const props = defineProps(['title']);-->

<!--const initFilters1 = () => {-->
<!--  filters1.value = {-->
<!--    global: { value: null, matchMode: FilterMatchMode.CONTAINS },-->
<!--    name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },-->
<!--    'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },-->
<!--    representative: { value: null, matchMode: FilterMatchMode.IN },-->
<!--    date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },-->
<!--    balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },-->
<!--    status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },-->
<!--    activity: { value: [0, 50], matchMode: FilterMatchMode.BETWEEN },-->
<!--    verified: { value: null, matchMode: FilterMatchMode.EQUALS }-->
<!--  };-->
<!--};-->

<!--const clearFilter1 = () => {-->
<!--  initFilters1();-->
<!--};-->

<!--const formatCurrency = (value) => {-->
<!--  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });-->
<!--};-->

<!--const formatDate = (value) => {-->
<!--  return value.toLocaleDateString('en-US', {-->
<!--    day: '2-digit',-->
<!--    month: '2-digit',-->
<!--    year: 'numeric'-->
<!--  });-->
<!--};-->
<!--</script>-->

<!--<template>-->
<!--  <div class="col-12">-->
<!--    <div class="card">-->
<!--      <h5>{{ props.title }}</h5>-->
<!--      <DataTable-->
<!--        :value="customer1"-->
<!--        :paginator="true"-->
<!--        class="p-datatable-gridlines"-->
<!--        :rows="7"-->
<!--        dataKey="id"-->
<!--        :rowHover="true"-->
<!--        v-model:filters="filters1"-->
<!--        filterDisplay="menu"-->
<!--        :loading="loading1"-->
<!--        :filters="filters1"-->
<!--        responsiveLayout="scroll"-->
<!--        :globalFilterFields="['name', 'country.name', 'representative.name', 'balance', 'status']"-->
<!--      >-->
<!--        <template #header>-->
<!--          <div class="flex justify-content-between flex-column sm:flex-row">-->
<!--            <Button type="button" icon="pi pi-filter-slash" label="Clear" class="p-button-outlined mb-2" @click="clearFilter1()" />-->
<!--            <span class="p-input-icon-left mb-2">-->
<!--              <i class="pi pi-search" />-->
<!--              <InputText v-model="filters1['global'].value" placeholder="Keyword Search" style="width: 100%" />-->
<!--            </span>-->
<!--          </div>-->
<!--        </template>-->

<!--        <template #empty> No customers found. </template>-->
<!--        <template #loading> Loading customers data. Please wait. </template>-->

<!--        <Column field="name" header="Name" style="min-width: 12rem">-->
<!--          <template #body="{ data }">-->
<!--            {{ data.name }}-->
<!--          </template>-->
<!--          <template #filter="{ filterModel }">-->
<!--            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name" />-->
<!--          </template>-->
<!--        </Column>-->
<!--        <Column header="Country" filterField="country.name" style="min-width: 12rem">-->
<!--          <template #body="{ data }">-->
<!--            <img src="/demo/images/flag/flag_placeholder.png" :alt="data.country.name" :class="'flag flag-' + data.country.code" width="30" />-->
<!--            <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{ data.country.name }}</span>-->
<!--          </template>-->
<!--          <template #filter="{ filterModel }">-->
<!--            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by country" />-->
<!--          </template>-->
<!--          <template #filterclear="{ filterCallback }">-->
<!--            <Button type="button" icon="pi pi-times" @click="filterCallback()" class="p-button-secondary"></Button>-->
<!--          </template>-->
<!--          <template #filterapply="{ filterCallback }">-->
<!--            <Button type="button" icon="pi pi-check" @click="filterCallback()" class="p-button-success"></Button>-->
<!--          </template>-->
<!--        </Column>-->

<!--        <Column header="Date" filterField="date" dataType="date" style="min-width: 10rem">-->
<!--          <template #body="{ data }">-->
<!--            {{ formatDate(data.date) }}-->
<!--          </template>-->
<!--          <template #filter="{ filterModel }">-->
<!--            <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />-->
<!--          </template>-->
<!--        </Column>-->

<!--        <Column header="Balance" filterField="balance" dataType="numeric" style="min-width: 10rem">-->
<!--          <template #body="{ data }">-->
<!--            {{ formatCurrency(data.balance) }}-->
<!--          </template>-->
<!--          <template #filter="{ filterModel }">-->
<!--            <InputNumber v-model="filterModel.value" mode="currency" currency="USD" locale="en-US" />-->
<!--          </template>-->
<!--        </Column>-->
<!--        <Column field="status" header="Status" :filterMenuStyle="{ width: '14rem' }" style="min-width: 12rem">-->
<!--          <template #body="{ data }">-->
<!--            <span :class="'customer-badge status-' + data.status">{{ data.status }}</span>-->
<!--          </template>-->
<!--          <template #filter="{ filterModel }">-->
<!--            <Dropdown v-model="filterModel.value" :options="statuses" placeholder="Any" class="p-column-filter" :showClear="true">-->
<!--              <template #value="slotProps">-->
<!--                <span :class="'customer-badge status-' + slotProps.value" v-if="slotProps.value">{{ slotProps.value }}</span>-->
<!--                <span v-else>{{ slotProps.placeholder }}</span>-->
<!--              </template>-->
<!--              <template #option="slotProps">-->
<!--                <span :class="'customer-badge status-' + slotProps.option">{{ slotProps.option }}</span>-->
<!--              </template>-->
<!--            </Dropdown>-->
<!--          </template>-->
<!--        </Column>-->
<!--        <Column field="activity" header="Activity" :showFilterMatchModes="false" style="min-width: 12rem">-->
<!--          <template #body="{ data }">-->
<!--            <ProgressBar :value="data.activity" :showValue="false" style="height: 0.5rem"></ProgressBar>-->
<!--          </template>-->
<!--          <template #filter="{ filterModel }">-->
<!--            <Slider v-model="filterModel.value" :range="true" class="m-3"></Slider>-->
<!--            <div class="flex align-items-center justify-content-between px-2">-->
<!--              <span>{{ filterModel.value ? filterModel.value[0] : 0 }}</span>-->
<!--              <span>{{ filterModel.value ? filterModel.value[1] : 100 }}</span>-->
<!--            </div>-->
<!--          </template>-->
<!--        </Column>-->
<!--        <Column field="verified" header="Verified" dataType="boolean" bodyClass="text-center" style="min-width: 8rem">-->
<!--          <template #body="{ data }">-->
<!--            <i class="pi" :class="{ 'text-green-500 pi-check-circle': data.verified, 'text-pink-500 pi-times-circle': !data.verified }"></i>-->
<!--          </template>-->
<!--          <template #filter="{ filterModel }">-->
<!--            <TriStateCheckbox v-model="filterModel.value" />-->
<!--          </template>-->
<!--        </Column>-->
<!--      </DataTable>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<style scoped lang="scss">-->
<!--::v-deep(.p-datatable-frozen-tbody) {-->
<!--  font-weight: bold;-->
<!--}-->

<!--::v-deep(.p-datatable-scrollable .p-frozen-column) {-->
<!--  font-weight: bold;-->
<!--}-->
<!--</style>-->
