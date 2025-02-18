<script setup>
import { ProductService } from '@/service/ProductService';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

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
const popup = ref(null);

const toast = useToast();
const confirmPopup = useConfirm();

onMounted(() => {
    ProductService.getProductsSmall().then((data) => (products.value = data));
});

function open() {
    display.value = true;
}

function close() {
    display.value = false;
}

function openConfirmation() {
    displayConfirmation.value = true;
}

function closeConfirmation() {
    displayConfirmation.value = false;
}

function toggleDataTable(event) {
    op.value.toggle(event);
}

function onProductSelect(event) {
    op.value.hide();
    toast.add({ severity: 'info', summary: 'Product Selected', detail: event.data.name, life: 3000 });
}

function confirm(event) {
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
}
</script>

<template>
    <div class="flex flex-col md:flex-row gap-8">
        <div class="md:w-1/2">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Dialog</div>
                <Dialog header="Dialog" v-model:visible="display" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true">
                    <p class="leading-normal m-0">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <template #footer>
                        <Button label="Save" @click="close" />
                    </template>
                </Dialog>
                <Button label="Show" style="width: auto" @click="open" />
            </div>

            <div class="card">
                <div class="font-semibold text-xl mb-4">Popover</div>
                <div class="flex flex-wrap gap-2">
                    <Button type="button" label="Show" @click="toggleDataTable" />
                    <Popover ref="op" id="overlay_panel" style="width: 450px">
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
                <div class="font-semibold text-xl mb-4">Tooltip</div>
                <div class="inline-flex gap-4">
                    <InputText type="text" placeholder="Username" v-tooltip="'Your username'" />
                    <Button type="button" label="Save" v-tooltip="'Click to proceed'" />
                </div>
            </div>
        </div>
        <div class="md:w-1/2">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Drawer</div>
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

                <Button icon="pi pi-arrow-right" @click="visibleLeft = true" style="margin-right: 0.25em" />
                <Button icon="pi pi-arrow-left" @click="visibleRight = true" style="margin-right: 0.25em" />
                <Button icon="pi pi-arrow-down" @click="visibleTop = true" style="margin-right: 0.25em" />
                <Button icon="pi pi-arrow-up" @click="visibleBottom = true" style="margin-right: 0.25em" />
                <Button icon="pi pi-external-link" @click="visibleFull = true" />
            </div>

            <div class="card">
                <div class="font-semibold text-xl mb-4">ConfirmPopup</div>
                <ConfirmPopup></ConfirmPopup>
                <Button ref="popup" @click="confirm($event)" icon="pi pi-check" label="Confirm" class="mr-2"></Button>
            </div>

            <div class="card">
                <div class="font-semibold text-xl mb-4">ConfirmDialog</div>
                <Button label="Delete" icon="pi pi-trash" severity="danger" style="width: auto" @click="openConfirmation" />
                <Dialog header="Confirmation" v-model:visible="displayConfirmation" :style="{ width: '350px' }" :modal="true">
                    <div class="flex items-center justify-center">
                        <i class="pi pi-exclamation-triangle mr-4" style="font-size: 2rem" />
                        <span>Are you sure you want to proceed?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" @click="closeConfirmation" text severity="secondary" />
                        <Button label="Yes" icon="pi pi-check" @click="closeConfirmation" severity="danger" outlined autofocus />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>
