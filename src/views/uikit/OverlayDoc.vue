<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { ProductService } from '@/service/ProductService';

const display = ref(false);
const displayConfirmation = ref(false);
const visibleLeft = ref(false);
const visibleRight = ref(false);
const visibleTop = ref(false);
const visibleBottom = ref(false);
const visibleFull = ref(false);
const products = ref(null);
const selectedProduct = ref(null);
const op = ref(null);
const op2 = ref(null);
const popup = ref(null);

const toast = useToast();
const confirmPopup = useConfirm();

onMounted(() => {
    ProductService.getProductsSmall().then((data) => (products.value = data));
});

const open = () => {
    display.value = true;
};

const close = () => {
    display.value = false;
};

const openConfirmation = () => {
    displayConfirmation.value = true;
};

const closeConfirmation = () => {
    displayConfirmation.value = false;
};

const toggle = (event) => {
    op.value.toggle(event);
};

const toggleDataTable = (event) => {
    op2.value.toggle(event);
};

const onProductSelect = (event) => {
    op.value.hide();
    toast.add({ severity: 'info', summary: 'Product Selected', detail: event.data.name, life: 3000 });
};

const confirm = (event) => {
    confirmPopup.require({
        target: event.target,
        message: 'Are you sure you want to proceed?',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Save'
        },
        accept: () => {
            toast.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
        },
        reject: () => {
            toast.add({ severity: 'info', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
};
</script>

<template>
    <div class="flex flex-col md:flex-row gap-6">
        <div class="md:w-1/2">
            <div class="card">
                <h5 class="mb-4">Dialog</h5>
                <Dialog header="Dialog" v-model:visible="display" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true">
                    <p class="leading-normal m-0">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <template #footer>
                        <Button label="Ok" @click="close" icon="pi pi-check" class="p-button-outlined" />
                    </template>
                </Dialog>
                <Button label="Show" icon="pi pi-external-link" style="width: auto" @click="open" />
            </div>

            <div class="card">
                <h5 class="mb-4">Popover</h5>
                <div class="flex flex-wrap gap-2">
                    <Button type="button" label="Image" @click="toggle" severity="success" />
                    <Popover ref="op">
                        <img src="https://primefaces.org/cdn/primevue/images/nature/nature9.jpg" alt="Image" />
                    </Popover>

                    <Button type="button" label="DataTable" @click="toggleDataTable" severity="success" />
                    <Popover ref="op2" id="overlay_panel" style="width: 450px">
                        <DataTable v-model:selection="selectedProduct" :value="products" selectionMode="single" :paginator="true" :rows="5" @row-select="onProductSelect">
                            <Column field="name" header="Name" sortable style="min-width: 12rem"></Column>
                            <Column header="Image">
                                <template #body="slotProps">
                                    <img :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`" :alt="slotProps.data.image" class="w-16 shadow-sm" />
                                </template>
                            </Column>
                            <Column field="price" header="Price" sortable style="min-width: 8rem">
                                <template #body="slotProps"> $ {{ slotProps.data.price }} </template>
                            </Column>
                        </DataTable>
                    </Popover>
                </div>
            </div>

            <div class="card">
                <h5 class="mb-4">Tooltip</h5>
                <div class="inline-flex gap-4">
                    <InputText type="text" placeholder="Username" v-tooltip="'Your username'" />
                    <Button type="button" label="Save" icon="pi pi-check" v-tooltip="'Click to proceed'" />
                </div>
            </div>
        </div>
        <div class="md:w-1/2">
            <div class="card">
                <h5 class="mb-4">Drawer</h5>
                <Drawer v-model:visible="visibleLeft" header="Drawer">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                        consequat.
                    </p>
                </Drawer>

                <Drawer v-model:visible="visibleRight" header="Drawer" position="right">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                        consequat.
                    </p>
                </Drawer>

                <Drawer v-model:visible="visibleTop" header="Drawer" position="top">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                        consequat.
                    </p>
                </Drawer>

                <Drawer v-model:visible="visibleBottom" header="Drawer" position="bottom">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                        consequat.
                    </p>
                </Drawer>

                <Drawer v-model:visible="visibleFull" header="Drawer" position="full">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                        consequat.
                    </p>
                </Drawer>

                <Button icon="pi pi-arrow-right" severity="warn" @click="visibleLeft = true" style="margin-right: 0.25em" />
                <Button icon="pi pi-arrow-left" severity="warn" @click="visibleRight = true" style="margin-right: 0.25em" />
                <Button icon="pi pi-arrow-down" severity="warn" @click="visibleTop = true" style="margin-right: 0.25em" />
                <Button icon="pi pi-arrow-up" severity="warn" @click="visibleBottom = true" style="margin-right: 0.25em" />
                <Button icon="pi pi-external-link" severity="warn" @click="visibleFull = true" />
            </div>

            <div class="card">
                <h5 class="mb-4">ConfirmPopup</h5>
                <ConfirmPopup></ConfirmPopup>
                <Button ref="popup" @click="confirm($event)" icon="pi pi-check" label="Confirm" class="mr-2"></Button>
            </div>

            <div class="card">
                <h5 class="mb-4">Confirmation</h5>
                <Button label="Delete" icon="pi pi-trash" severity="danger" style="width: auto" @click="openConfirmation" />
                <Dialog header="Confirmation" v-model:visible="displayConfirmation" :style="{ width: '350px' }" :modal="true">
                    <div class="flex items-center justify-center">
                        <i class="pi pi-exclamation-triangle mr-4" style="font-size: 2rem" />
                        <span>Are you sure you want to proceed?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" @click="closeConfirmation" class="p-button-text" />
                        <Button label="Yes" icon="pi pi-check" @click="closeConfirmation" class="p-button-text" autofocus />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>
