<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { ProductService } from '@/service/ProductService';
import { useLayout } from '@/layout/composables/layout';

const { isDarkTheme } = useLayout();

const products = ref(null);
const lineData = reactive({
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: 0.4
        },
        {
            label: 'Second Dataset',
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            backgroundColor: '#00bb7e',
            borderColor: '#00bb7e',
            tension: 0.4
        }
    ]
});
const items = ref([
    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
    { label: 'Remove', icon: 'pi pi-fw pi-minus' }
]);
const lineOptions = ref(null);

onMounted(() => {
    ProductService.getProductsSmall().then((data) => (products.value = data));
});

const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};
const applyLightTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };
};

const applyDarkTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#ebedef'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            },
            y: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            }
        }
    };
};

watch(
    isDarkTheme,
    (val) => {
        if (val) {
            applyDarkTheme();
        } else {
            applyLightTheme();
        }
    },
    { immediate: true }
);
</script>

<template>
    <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-surface-500 dark:text-surface-300 font-medium mb-4">Orders</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">152</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-shopping-cart text-blue-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">24 new </span>
                <span class="text-surface-500 dark:text-surface-300">since last visit</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-surface-500 dark:text-surface-300 font-medium mb-4">Revenue</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">$2.100</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-map-marker text-orange-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">%52+ </span>
                <span class="text-surface-500 dark:text-surface-300">since last week</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-surface-500 dark:text-surface-300 font-medium mb-4">Customers</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">28441</div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-inbox text-cyan-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">520 </span>
                <span class="text-surface-500 dark:text-surface-300">newly registered</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-surface-500 dark:text-surface-300 font-medium mb-4">Comments</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">152 Unread</div>
                    </div>
                    <div class="flex items-center justify-center bg-purple-100 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-comment text-purple-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">85 </span>
                <span class="text-surface-500 dark:text-surface-300">responded</span>
            </div>
        </div>

        <div class="col-span-12 xl:col-span-6">
            <div class="card">
                <h5>Recent Sales</h5>
                <DataTable :value="products" :rows="5" :paginator="true" responsiveLayout="scroll">
                    <Column style="width: 15%">
                        <template #header> Image </template>
                        <template #body="slotProps">
                            <img :src="'demo/images/product/' + slotProps.data.image" :alt="slotProps.data.image" width="50" class="shadow" />
                        </template>
                    </Column>
                    <Column field="name" header="Name" :sortable="true" style="width: 35%"></Column>
                    <Column field="price" header="Price" :sortable="true" style="width: 35%">
                        <template #body="slotProps">
                            {{ formatCurrency(slotProps.data.price) }}
                        </template>
                    </Column>
                    <Column style="width: 15%">
                        <template #header> View </template>
                        <template #body>
                            <Button icon="pi pi-search" type="button" class="p-button-text"></Button>
                        </template>
                    </Column>
                </DataTable>
            </div>
            <div class="card">
                <div class="flex justify-between items-center mb-8">
                    <h5>Best Selling Products</h5>
                    <div>
                        <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded" @click="$refs.menu2.toggle($event)"></Button>
                        <Menu ref="menu2" :popup="true" :model="items"></Menu>
                    </div>
                </div>
                <ul class="list-none p-0 m-0">
                    <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <div>
                            <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">Space T-Shirt</span>
                            <div class="mt-1 text-surface-600 dark:text-surface-200">Clothing</div>
                        </div>
                        <div class="mt-2 md:mt-0 flex items-center">
                            <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                                <div class="bg-orange-500 h-full" style="width: 50%"></div>
                            </div>
                            <span class="text-orange-500 ml-4 font-medium">%50</span>
                        </div>
                    </li>
                    <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <div>
                            <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">Portal Sticker</span>
                            <div class="mt-1 text-surface-600 dark:text-surface-200">Accessories</div>
                        </div>
                        <div class="mt-2 md:mt-0 ml-0 md:ml-20 flex items-center">
                            <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                                <div class="bg-cyan-500 h-full" style="width: 16%"></div>
                            </div>
                            <span class="text-cyan-500 ml-4 font-medium">%16</span>
                        </div>
                    </li>
                    <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <div>
                            <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">Supernova Sticker</span>
                            <div class="mt-1 text-surface-600 dark:text-surface-200">Accessories</div>
                        </div>
                        <div class="mt-2 md:mt-0 ml-0 md:ml-20 flex items-center">
                            <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                                <div class="bg-pink-500 h-full" style="width: 67%"></div>
                            </div>
                            <span class="text-pink-500 ml-4 font-medium">%67</span>
                        </div>
                    </li>
                    <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <div>
                            <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">Wonders Notebook</span>
                            <div class="mt-1 text-surface-600 dark:text-surface-200">Office</div>
                        </div>
                        <div class="mt-2 md:mt-0 ml-0 md:ml-20 flex items-center">
                            <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                                <div class="bg-green-500 h-full" style="width: 35%"></div>
                            </div>
                            <span class="text-green-500 ml-4 font-medium">%35</span>
                        </div>
                    </li>
                    <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <div>
                            <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">Mat Black Case</span>
                            <div class="mt-1 text-surface-600 dark:text-surface-200">Accessories</div>
                        </div>
                        <div class="mt-2 md:mt-0 ml-0 md:ml-20 flex items-center">
                            <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                                <div class="bg-purple-500 h-full" style="width: 75%"></div>
                            </div>
                            <span class="text-purple-500 ml-4 font-medium">%75</span>
                        </div>
                    </li>
                    <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <div>
                            <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">Robots T-Shirt</span>
                            <div class="mt-1 text-surface-600 dark:text-surface-200">Clothing</div>
                        </div>
                        <div class="mt-2 md:mt-0 ml-0 md:ml-20 flex items-center">
                            <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                                <div class="bg-teal-500 h-full" style="width: 40%"></div>
                            </div>
                            <span class="text-teal-500 ml-4 font-medium">%40</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="col-span-12 xl:col-span-6">
            <div class="card">
                <h5>Sales Overview</h5>
                <Chart type="line" :data="lineData" :options="lineOptions" />
            </div>
            <div class="card">
                <div class="flex items-center justify-between mb-6">
                    <h5>Notifications</h5>
                    <div>
                        <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded" @click="$refs.menu1.toggle($event)"></Button>
                        <Menu ref="menu1" :popup="true" :model="items"></Menu>
                    </div>
                </div>

                <span class="block text-surface-600 dark:text-surface-200 font-medium mb-4">TODAY</span>
                <ul class="p-0 mx-0 mt-0 mb-6 list-none">
                    <li class="flex items-center py-2 border-b border-surface">
                        <div class="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full mr-4 shrink-0">
                            <i class="pi pi-dollar text-xl text-blue-500"></i>
                        </div>
                        <span class="text-surface-900 dark:text-surface-0 leading-normal"
                            >Richard Jones
                            <span class="text-surface-700 dark:text-surface-100">has purchased a blue t-shirt for <span class="text-blue-500">79$</span></span>
                        </span>
                    </li>
                    <li class="flex items-center py-2">
                        <div class="w-12 h-12 flex items-center justify-center bg-orange-100 rounded-full mr-4 shrink-0">
                            <i class="pi pi-download text-xl text-orange-500"></i>
                        </div>
                        <span class="text-surface-700 dark:text-surface-100 leading-normal">Your request for withdrawal of <span class="text-blue-500 font-medium">2500$</span> has been initiated.</span>
                    </li>
                </ul>

                <span class="block text-surface-600 dark:text-surface-200 font-medium mb-4">YESTERDAY</span>
                <ul class="p-0 m-0 list-none">
                    <li class="flex items-center py-2 border-b border-surface">
                        <div class="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full mr-4 shrink-0">
                            <i class="pi pi-dollar text-xl text-blue-500"></i>
                        </div>
                        <span class="text-surface-900 dark:text-surface-0 leading-normal"
                            >Keyser Wick
                            <span class="text-surface-700 dark:text-surface-100">has purchased a black jacket for <span class="text-blue-500">59$</span></span>
                        </span>
                    </li>
                    <li class="flex items-center py-2 border-b border-surface">
                        <div class="w-12 h-12 flex items-center justify-center bg-pink-100 rounded-full mr-4 shrink-0">
                            <i class="pi pi-question text-xl text-pink-500"></i>
                        </div>
                        <span class="text-surface-900 dark:text-surface-0 leading-normal"
                            >Jane Davis
                            <span class="text-surface-700 dark:text-surface-100">has posted a new questions about your product.</span>
                        </span>
                    </li>
                </ul>
            </div>
            <div
                class="px-6 py-8 shadow flex flex-col md:flex-row md:items-center justify-between mb-4"
                style="border-radius: 1rem; background: linear-gradient(0deg, rgba(0, 123, 255, 0.5), rgba(0, 123, 255, 0.5)), linear-gradient(92.54deg, #1c80cf 47.88%, #ffffff 100.01%)"
            >
                <div>
                    <div class="text-blue-100 font-medium text-xl mt-2 mb-4">TAKE THE NEXT STEP</div>
                    <div class="text-white font-medium text-5xl">Try PrimeBlocks</div>
                </div>
                <div class="mt-6 mr-auto md:mt-0 md:mr-0">
                    <a href="https://www.primefaces.org/primeblocks-vue" class="p-button font-bold px-8 py-4 p-button-warning p-button-rounded p-button-raised"> Get Started </a>
                </div>
            </div>
        </div>
    </div>
</template>
