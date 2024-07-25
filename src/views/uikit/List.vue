<script setup>
import { ref, onMounted } from 'vue';
import { ProductService } from '@/service/ProductService';

const picklistValue = ref([
    [
        { name: 'San Francisco', code: 'SF' },
        { name: 'London', code: 'LDN' },
        { name: 'Paris', code: 'PRS' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Berlin', code: 'BRL' },
        { name: 'Barcelona', code: 'BRC' },
        { name: 'Rome', code: 'RM' }
    ],
    []
]);

const orderlistValue = ref([
    { name: 'San Francisco', code: 'SF' },
    { name: 'London', code: 'LDN' },
    { name: 'Paris', code: 'PRS' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Berlin', code: 'BRL' },
    { name: 'Barcelona', code: 'BRC' },
    { name: 'Rome', code: 'RM' }
]);

const dataviewValue = ref(null);
const layout = ref('grid grid-cols-12 gap-4');
const sortKey = ref(null);
const sortOrder = ref(null);
const sortField = ref(null);
const sortOptions = ref([
    { label: 'Price High to Low', value: '!price' },
    { label: 'Price Low to High', value: 'price' }
]);

const productService = new ProductService();

onMounted(() => {
    productService.getProductsSmall().then((data) => (dataviewValue.value = data));
});

const onSortChange = (event) => {
    const value = event.value.value;
    const sortValue = event.value;

    if (value.indexOf('!') === 0) {
        sortOrder.value = -1;
        sortField.value = value.substring(1, value.length);
        sortKey.value = sortValue;
    } else {
        sortOrder.value = 1;
        sortField.value = value;
        sortKey.value = sortValue;
    }
};

const getSeverity = (product) => {
    switch (product.inventoryStatus) {
        case 'INSTOCK':
            return 'success';

        case 'LOWSTOCK':
            return 'warning';

        case 'OUTOFSTOCK':
            return 'danger';

        default:
            return null;
    }
};
</script>

<template>
    <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12">
            <div class="card">
                <h5>DataView</h5>
                <DataView :value="dataviewValue" :layout="layout" :paginator="true" :rows="9" :sortOrder="sortOrder" :sortField="sortField">
                    <template #header>
                        <div class="grid grid-cols-12 gap-4 grid-nogutter">
                            <div class="col-span-6 text-left">
                                <Dropdown v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Sort By Price" @change="onSortChange($event)" />
                            </div>
                            <div class="col-span-6 text-right">
                                <DataViewLayoutOptions v-model="layout" />
                            </div>
                        </div>
                    </template>

                    <template #list="slotProps">
                        <div class="grid grid-cols-12 gap-4 grid-nogutter">
                            <div v-for="(item, index) in slotProps.items" :key="index" class="col-span-12">
                                <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4" :class="{ 'border-top-1 surface-border': index !== 0 }">
                                    <div class="md:w-40 relative">
                                        <img class="block xl:block mx-auto rounded-border w-full" :src="`https://primefaces.org/cdn/primevue/images/product/${item.image}`" :alt="item.name" />
                                        <Tag :value="item.inventoryStatus" :severity="getSeverity(item)" class="absolute" style="left: 4px; top: 4px"></Tag>
                                    </div>
                                    <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                                        <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                                            <div>
                                                <span class="font-medium text-secondary text-sm">{{ item.category }}</span>
                                                <div class="text-lg font-medium text-surface-900 dark:text-surface-0 mt-2">{{ item.name }}</div>
                                            </div>
                                            <div class="bg-surface-100 dark:bg-surface-700 p-1" style="border-radius: 30px">
                                                <div class="bg-surface-0 dark:bg-surface-900 flex items-center gap-2 justify-center py-1 px-2" style="border-radius: 30px; box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.04), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)">
                                                    <span class="text-surface-900 dark:text-surface-0 font-medium text-sm">{{ item.rating }}</span>
                                                    <i class="pi pi-star-fill text-yellow-500"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex flex-col md:items-end gap-8">
                                            <span class="text-xl font-semibold text-surface-900 dark:text-surface-0">${{ item.price }}</span>
                                            <div class="flex flex-row-reverse md:flex-row gap-2">
                                                <Button icon="pi pi-heart" outlined></Button>
                                                <Button icon="pi pi-shopping-cart" label="Buy Now" :disabled="item.inventoryStatus === 'OUTOFSTOCK'" class="flex-auto md:flex-initial whitespace-nowrap"></Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>

                    <template #grid="slotProps">
                        <div class="grid grid-cols-12 gap-4 grid-nogutter">
                            <div v-for="(item, index) in slotProps.items" :key="index" class="col-span-12 sm:col-span-6 md:col-span-4 p-2">
                                <div class="p-6 border border-surface bg-surface-0 dark:bg-surface-900 rounded-border flex flex-col">
                                    <div class="bg-surface-50 dark:bg-surface-800 flex justify-center rounded-border p-4">
                                        <div class="relative mx-auto">
                                            <img class="rounded-border w-full" :src="`https://primefaces.org/cdn/primevue/images/product/${item.image}`" :alt="item.name" style="max-width: 300px" />
                                            <Tag :value="item.inventoryStatus" :severity="getSeverity(item)" class="absolute" style="left: 4px; top: 4px"></Tag>
                                        </div>
                                    </div>
                                    <div class="pt-6">
                                        <div class="flex flex-row justify-between items-start gap-2">
                                            <div>
                                                <span class="font-medium text-secondary text-sm">{{ item.category }}</span>
                                                <div class="text-lg font-medium text-surface-900 dark:text-surface-0 mt-1">{{ item.name }}</div>
                                            </div>
                                            <div class="bg-surface-100 dark:bg-surface-700 p-1" style="border-radius: 30px">
                                                <div class="bg-surface-0 dark:bg-surface-900 flex items-center gap-2 justify-center py-1 px-2" style="border-radius: 30px; box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.04), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)">
                                                    <span class="text-surface-900 dark:text-surface-0 font-medium text-sm">{{ item.rating }}</span>
                                                    <i class="pi pi-star-fill text-yellow-500"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex flex-col gap-6 mt-6">
                                            <span class="text-2xl font-semibold text-surface-900 dark:text-surface-0">${{ item.price }}</span>
                                            <div class="flex gap-2">
                                                <Button icon="pi pi-shopping-cart" label="Buy Now" :disabled="item.inventoryStatus === 'OUTOFSTOCK'" class="flex-auto whitespace-nowrap"></Button>
                                                <Button icon="pi pi-heart" outlined></Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </DataView>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-8">
            <div class="card">
                <h5>PickList</h5>
                <PickList v-model="picklistValue" listStyle="height:250px" dataKey="code">
                    <template #sourceheader> From </template>
                    <template #targetheader> To </template>
                    <template #item="slotProps">
                        <div>{{ slotProps.item.name }}</div>
                    </template>
                </PickList>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-4">
            <div class="card">
                <h5>OrderList</h5>
                <OrderList v-model="orderlistValue" listStyle="height:250px" dataKey="code" :rows="10">
                    <template #header> Cities </template>
                    <template #item="slotProps">
                        <div>{{ slotProps.item.name }}</div>
                    </template>
                </OrderList>
            </div>
        </div>
    </div>
</template>
