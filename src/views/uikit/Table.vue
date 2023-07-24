<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import CustomerService from '@/service/CustomerService';
import ProductService from '@/service/ProductService';
import { ref, onBeforeMount } from 'vue';

const customer1 = ref(null);
const customer2 = ref(null);
const customer3 = ref(null);
const filters1 = ref(null);
const loading1 = ref(null);
const loading2 = ref(null);
const idFrozen = ref(false);
const products = ref(null);
const expandedRows = ref([]);
const statuses = ref(['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal']);
const representatives = ref([
    { name: 'Amy Elsner', image: 'amyelsner.png' },
    { name: 'Anna Fali', image: 'annafali.png' },
    { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
    { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
    { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
    { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
    { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
    { name: 'Onyama Limba', image: 'onyamalimba.png' },
    { name: 'Stephen Shaw', image: 'stephenshaw.png' },
    { name: 'XuXue Feng', image: 'xuxuefeng.png' }
]);

const customerService = new CustomerService();
const productService = new ProductService();

onBeforeMount(() => {
    productService.getProductsWithOrdersSmall().then((data) => (products.value = data));
    customerService.getCustomersLarge().then((data) => {
        customer1.value = data;
        loading1.value = false;
        customer1.value.forEach((customer) => (customer.date = new Date(customer.date)));
    });
    customerService.getCustomersLarge().then((data) => (customer2.value = data));
    customerService.getCustomersMedium().then((data) => (customer3.value = data));
    loading2.value = false;

    initFilters1();
});

const initFilters1 = () => {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        activity: { value: [0, 50], matchMode: FilterMatchMode.BETWEEN },
        verified: { value: null, matchMode: FilterMatchMode.EQUALS }
    };
};

const clearFilter1 = () => {
    initFilters1();
};
const expandAll = () => {
    expandedRows.value = products.value.filter((p) => p.id);
};
const collapseAll = () => {
    expandedRows.value = null;
};
const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const formatDate = (value) => {
    return value.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};
const calculateCustomerTotal = (name) => {
    let total = 0;
    if (customer3.value) {
        for (let customer of customer3.value) {
            if (customer.representative.name === name) {
                total++;
            }
        }
    }

    return total;
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Filter Menu</h5>
                <DataTable
                    :value="customer1"
                    :paginator="true"
                    class="p-datatable-gridlines"
                    :rows="10"
                    dataKey="id"
                    :rowHover="true"
                    v-model:filters="filters1"
                    filterDisplay="menu"
                    :loading="loading1"
                    :filters="filters1"
                    responsiveLayout="scroll"
                    :globalFilterFields="['name', 'country.name', 'representative.name', 'balance', 'status']"
                >
                    <template #header>
                        <div class="flex justify-content-between flex-column sm:flex-row">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" class="p-button-outlined mb-2" @click="clearFilter1()" />
                            <span class="p-input-icon-left mb-2">
                                <i class="pi pi-search" />
                                <InputText v-model="filters1['global'].value" placeholder="Keyword Search" style="width: 100%" />
                            </span>
                        </div>
                    </template>
                    <template #empty> No customers found. </template>
                    <template #loading> Loading customers data. Please wait. </template>
                    <Column field="name" header="Name" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.name }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name" />
                        </template>
                    </Column>
                    <Column header="Country" filterField="country.name" style="min-width: 12rem">
                        <template #body="{ data }">
                            <img src="/demo/images/flag/flag_placeholder.png" :alt="data.country.name" :class="'flag flag-' + data.country.code" width="30" />
                            <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{ data.country.name }}</span>
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by country" />
                        </template>
                        <template #filterclear="{ filterCallback }">
                            <Button type="button" icon="pi pi-times" @click="filterCallback()" class="p-button-secondary"></Button>
                        </template>
                        <template #filterapply="{ filterCallback }">
                            <Button type="button" icon="pi pi-check" @click="filterCallback()" class="p-button-success"></Button>
                        </template>
                    </Column>
                    <Column header="Agent" filterField="representative" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem">
                        <template #body="{ data }">
                            <img :alt="data.representative.name" :src="'demo/images/avatar/' + data.representative.image" width="32" style="vertical-align: middle" />
                            <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{ data.representative.name }}</span>
                        </template>
                        <template #filter="{ filterModel }">
                            <div class="mb-3 text-bold">Agent Picker</div>
                            <MultiSelect v-model="filterModel.value" :options="representatives" optionLabel="name" placeholder="Any" class="p-column-filter">
                                <template #option="slotProps">
                                    <div class="p-multiselect-representative-option">
                                        <img :alt="slotProps.option.name" :src="'demo/images/avatar/' + slotProps.option.image" width="32" style="vertical-align: middle" />
                                        <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{ slotProps.option.name }}</span>
                                    </div>
                                </template>
                            </MultiSelect>
                        </template>
                    </Column>
                    <Column header="Date" filterField="date" dataType="date" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ formatDate(data.date) }}
                        </template>
                        <template #filter="{ filterModel }">
                            <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
                        </template>
                    </Column>
                    <Column header="Balance" filterField="balance" dataType="numeric" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ formatCurrency(data.balance) }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputNumber v-model="filterModel.value" mode="currency" currency="USD" locale="en-US" />
                        </template>
                    </Column>
                    <Column field="status" header="Status" :filterMenuStyle="{ width: '14rem' }" style="min-width: 12rem">
                        <template #body="{ data }">
                            <span :class="'customer-badge status-' + data.status">{{ data.status }}</span>
                        </template>
                        <template #filter="{ filterModel }">
                            <Dropdown v-model="filterModel.value" :options="statuses" placeholder="Any" class="p-column-filter" :showClear="true">
                                <template #value="slotProps">
                                    <span :class="'customer-badge status-' + slotProps.value" v-if="slotProps.value">{{ slotProps.value }}</span>
                                    <span v-else>{{ slotProps.placeholder }}</span>
                                </template>
                                <template #option="slotProps">
                                    <span :class="'customer-badge status-' + slotProps.option">{{ slotProps.option }}</span>
                                </template>
                            </Dropdown>
                        </template>
                    </Column>
                    <Column field="activity" header="Activity" :showFilterMatchModes="false" style="min-width: 12rem">
                        <template #body="{ data }">
                            <ProgressBar :value="data.activity" :showValue="false" style="height: 0.5rem"></ProgressBar>
                        </template>
                        <template #filter="{ filterModel }">
                            <Slider v-model="filterModel.value" :range="true" class="m-3"></Slider>
                            <div class="flex align-items-center justify-content-between px-2">
                                <span>{{ filterModel.value ? filterModel.value[0] : 0 }}</span>
                                <span>{{ filterModel.value ? filterModel.value[1] : 100 }}</span>
                            </div>
                        </template>
                    </Column>
                    <Column field="verified" header="Verified" dataType="boolean" bodyClass="text-center" style="min-width: 8rem">
                        <template #body="{ data }">
                            <i class="pi" :class="{ 'text-green-500 pi-check-circle': data.verified, 'text-pink-500 pi-times-circle': !data.verified }"></i>
                        </template>
                        <template #filter="{ filterModel }">
                            <TriStateCheckbox v-model="filterModel.value" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>

        <div class="col-12">
            <div class="card">
                <h5>Frozen Columns</h5>
                <ToggleButton v-model="idFrozen" onIcon="pi pi-lock" offIcon="pi pi-lock-open" onLabel="Unfreeze Id" offLabel="Freeze Id" style="width: 10rem" />

                <DataTable :value="customer2" :scrollable="true" scrollHeight="400px" :loading="loading2" scrollDirection="both" class="mt-3">
                    <Column field="name" header="Name" :style="{ width: '150px' }" frozen></Column>
                    <Column field="id" header="Id" :style="{ width: '100px' }" :frozen="idFrozen"></Column>
                    <Column field="country.name" header="Country" :style="{ width: '200px' }">
                        <template #body="{ data }">
                            <img src="/demo/images/flag/flag_placeholder.png" :class="'flag flag-' + data.country.code" width="30" />
                            <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{ data.country.name }}</span>
                        </template>
                    </Column>
                    <Column field="date" header="Date" :style="{ width: '200px' }"></Column>
                    <Column field="company" header="Company" :style="{ width: '200px' }"></Column>
                    <Column field="status" header="Status" :style="{ width: '200px' }">
                        <template #body="{ data }">
                            <span :class="'customer-badge status-' + data.status">{{ data.status }}</span>
                        </template>
                    </Column>
                    <Column field="activity" header="Activity" :style="{ width: '200px' }"></Column>
                    <Column field="representative.name" header="Representative" :style="{ width: '200px' }">
                        <template #body="{ data }">
                            <img :alt="data.representative.name" :src="'demo/images/avatar/' + data.representative.image" width="32" style="vertical-align: middle" />
                            <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{ data.representative.name }}</span>
                        </template>
                    </Column>
                    <Column field="balance" header="Balance" :style="{ width: '150px' }" frozen alignFrozen="right">
                        <template #body="{ data }">
                            <span class="text-bold">{{ formatCurrency(data.balance) }}</span>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>

        <div class="col-12">
            <div class="card">
                <h5>Row Expand</h5>
                <DataTable :value="products" v-model:expandedRows="expandedRows" dataKey="id" responsiveLayout="scroll">
                    <template #header>
                        <div>
                            <Button icon="pi pi-plus" label="Expand All" @click="expandAll" class="mr-2 mb-2" />
                            <Button icon="pi pi-minus" label="Collapse All" @click="collapseAll" class="mb-2" />
                        </div>
                    </template>
                    <Column :expander="true" headerStyle="min-width: 3rem" />
                    <Column field="name" header="Name" :sortable="true">
                        <template #body="slotProps">
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column header="Image">
                        <template #body="slotProps">
                            <img :src="'demo/images/product/' + slotProps.data.image" :alt="slotProps.data.image" class="shadow-2" width="100" />
                        </template>
                    </Column>
                    <Column field="price" header="Price" :sortable="true">
                        <template #body="slotProps">
                            {{ formatCurrency(slotProps.data.price) }}
                        </template>
                    </Column>
                    <Column field="category" header="Category" :sortable="true">
                        <template #body="slotProps">
                            {{ formatCurrency(slotProps.data.category) }}
                        </template></Column
                    >
                    <Column field="rating" header="Reviews" :sortable="true">
                        <template #body="slotProps">
                            <Rating :modelValue="slotProps.data.rating" :readonly="true" :cancel="false" />
                        </template>
                    </Column>
                    <Column field="inventoryStatus" header="Status" :sortable="true">
                        <template #body="slotProps">
                            <span :class="'product-badge status-' + (slotProps.data.inventoryStatus ? slotProps.data.inventoryStatus.toLowerCase() : '')">{{ slotProps.data.inventoryStatus }}</span>
                        </template>
                    </Column>
                    <template #expansion="slotProps">
                        <div class="p-3">
                            <h5>Orders for {{ slotProps.data.name }}</h5>
                            <DataTable :value="slotProps.data.orders" responsiveLayout="scroll">
                                <Column field="id" header="Id" :sortable="true">
                                    <template #body="slotProps">
                                        {{ slotProps.data.id }}
                                    </template>
                                </Column>
                                <Column field="customer" header="Customer" :sortable="true">
                                    <template #body="slotProps">
                                        {{ slotProps.data.customer }}
                                    </template>
                                </Column>
                                <Column field="date" header="Date" :sortable="true">
                                    <template #body="slotProps">
                                        {{ slotProps.data.date }}
                                    </template>
                                </Column>
                                <Column field="amount" header="Amount" :sortable="true">
                                    <template #body="slotProps">
                                        {{ formatCurrency(slotProps.data.amount) }}
                                    </template>
                                </Column>
                                <Column field="status" header="Status" :sortable="true">
                                    <template #body="slotProps">
                                        <span :class="'order-badge order-' + (slotProps.data.status ? slotProps.data.status.toLowerCase() : '')">{{ slotProps.data.status }}</span>
                                    </template>
                                </Column>
                                <Column headerStyle="width:4rem">
                                    <template #body>
                                        <Button icon="pi pi-search" />
                                    </template>
                                </Column>
                            </DataTable>
                        </div>
                    </template>
                </DataTable>
            </div>
        </div>

        <div class="col-12">
            <div class="card">
                <h5>Subheader Grouping</h5>
                <DataTable :value="customer3" rowGroupMode="subheader" groupRowsBy="representative.name" sortMode="single" sortField="representative.name" :sortOrder="1" scrollable scrollHeight="400px">
                    <Column field="representative.name" header="Representative"></Column>
                    <Column field="name" header="Name" style="min-width: 200px"></Column>
                    <Column field="country" header="Country" style="min-width: 200px">
                        <template #body="slotProps">
                            <img src="/demo/images/flag/flag_placeholder.png" :class="'flag flag-' + slotProps.data.country.code" width="30" />
                            <span class="image-text ml-2">{{ slotProps.data.country.name }}</span>
                        </template>
                    </Column>
                    <Column field="company" header="Company" style="min-width: 200px"></Column>
                    <Column field="status" header="Status" style="min-width: 200px">
                        <template #body="slotProps">
                            <span :class="'customer-badge status-' + slotProps.data.status">{{ slotProps.data.status }}</span>
                        </template>
                    </Column>
                    <Column field="date" header="Date" style="min-width: 200px"></Column>
                    <template #groupheader="slotProps">
                        <img :alt="slotProps.data.representative.name" :src="'demo/images/avatar/' + slotProps.data.representative.image" width="32" style="vertical-align: middle" />
                        <span class="image-text font-bold ml-2">{{ slotProps.data.representative.name }}</span>
                    </template>
                    <template #groupfooter="slotProps">
                        <td style="text-align: right" class="text-bold pr-6">Total Customers: {{ calculateCustomerTotal(slotProps.data.representative.name) }}</td>
                    </template>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
::v-deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

::v-deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
</style>
