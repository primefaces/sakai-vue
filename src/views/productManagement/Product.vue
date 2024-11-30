<script setup>
import { ProductService } from '@/service/ProductService';
import productService from '@/services/productService';
import sousCategorieService from '@/services/sousCategorieService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref, watch } from 'vue';

onMounted(async () => {
    try {
        ProductService.getProducts().then((data) => (products.value = data));
        const response = await sousCategorieService.getSousCategorie();
        categories.value = response.data;
    } catch (error) {
        console.error('Failed to fetch categories:', error);
    }
});

const toast = useToast();
const dt = ref();
const products = ref();
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref();
const uploadedImages = ref([]);
const categories = ref([]);
const selectedCategory = ref(null);
const fieldsData = ref([]);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);
const statuses = ref([
    { label: 'INSTOCK', value: 'INSTOCK' },
    { label: 'LOWSTOCK', value: 'LOWSTOCK' },
    { label: 'OUTOFSTOCK', value: 'OUTOFSTOCK' }
]);

function formatCurrency(value) {
    if (value) return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    return;
}

function openNew() {
    product.value = {};
    submitted.value = false;
    productDialog.value = true;
}

function hideDialog() {
    productDialog.value = false;
    submitted.value = false;
}

function saveProduct() {
    submitted.value = true;

    if (product?.value.name?.trim()) {
        if (product.value.id) {
            // Modify Product: Use the updateData service method for PUT request
            product.value.inventoryStatus = product.value.inventoryStatus.value ? product.value.inventoryStatus.value : product.value.inventoryStatus;

            productService.updateData(product.value, product.value.id)
                .then(() => {
                    // On success, update the local list of products
                    products.value[findIndexById(product.value.id)] = product.value;
                    toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
                })
                .catch((error) => {
                    // Handle error here
                    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update product', life: 3000 });
                    console.error("Error updating product:", error);
                });
        } else {
            // Create new Product: Use the postData service method for POST request
            product.value.inventoryStatus = product.value.inventoryStatus ? product.value.inventoryStatus.value : 'INSTOCK';

            productService.postData(product.value)
                .then((response) => {
                    // On success, push the newly created product into the list
                    products.value.push(response.data); // Assuming the response contains the created product
                    toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
                })
                .catch((error) => {
                    // Handle error here
                    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to create product', life: 3000 });
                    console.error("Error creating product:", error);
                });
        }
        console.log(product);
    }
}



 // productDialog.value = false;
        // product.value = {};

function editProduct(prod) {
    product.value = { ...prod };
    productDialog.value = true;
}

function confirmDeleteProduct(prod) {
    product.value = prod;
    deleteProductDialog.value = true;
}

function deleteProduct() {
    products.value = products.value.filter((val) => val.id !== product.value.id);
    deleteProductDialog.value = false;
    product.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
}

function findIndexById(id) {
    let index = -1;
    for (let i = 0; i < products.value.length; i++) {
        if (products.value[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
}

function createId() {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

function exportCSV() {
    dt.value.exportCSV();
}

function confirmDeleteSelected() {
    deleteProductsDialog.value = true;
}

function deleteSelectedProducts() {
    products.value = products.value.filter((val) => !selectedProducts.value.includes(val));
    deleteProductsDialog.value = false;
    selectedProducts.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
}

function getStatusLabel(status) {
    switch (status) {
        case 'INSTOCK':
            return 'success';

        case 'LOWSTOCK':
            return 'warn';

        case 'OUTOFSTOCK':
            return 'danger';

        default:
            return null;
    }
}
// !important
watch(
    () => product.value.sousCategorie,
    (newSousCategorie) => {
        if (newSousCategorie) {
            // Clear existing fields and initialize new ones
            product.value.fields = {};
            newSousCategorie.fields.forEach((field) => {
                product.value.fields[field] = ''; // Initialize each field as an empty string
            });
        }
    }
);

async function uploadImages(event) {
    const files = event.target.files;
    if (!files.length) return;

    const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'cg0nwkaa'); // Replace with your Cloudinary preset

        try {
            const response = await fetch('https://api.cloudinary.com/v1_1/dstjfvua2/image/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error('Image upload failed:', error.message);
            return null;
        }
    });

    const imageUrls = (await Promise.all(uploadPromises)).filter(Boolean);
    uploadedImages.value.push(...imageUrls);
    product.value.images = uploadedImages.value; // Sync with product data
}

function removeImage(index) {
    uploadedImages.value.splice(index, 1);
    product.value.images = uploadedImages.value; // Sync with product data
}
</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                    <Button label="Delete" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" />
                </template>

                <template #end>
                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                v-model:selection="selectedProducts"
                :value="products"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Manage Products</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="code" header="Code" sortable style="min-width: 12rem"></Column>
                <Column field="name" header="Name" sortable style="min-width: 16rem"></Column>
                <Column header="Image">
                    <template #body="slotProps">
                        <img :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`" :alt="slotProps.data.image" class="rounded" style="width: 64px" />
                    </template>
                </Column>
                <Column field="price" header="Price" sortable style="min-width: 8rem">
                    <template #body="slotProps">
                        {{ formatCurrency(slotProps.data.price) }}
                    </template>
                </Column>
                <Column field="category" header="Category" sortable style="min-width: 10rem"></Column>
                <Column field="rating" header="Reviews" sortable style="min-width: 12rem">
                    <template #body="slotProps">
                        <Rating :modelValue="slotProps.data.rating" :readonly="true" />
                    </template>
                </Column>
                <Column field="inventoryStatus" header="Status" sortable style="min-width: 12rem">
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.inventoryStatus" :severity="getStatusLabel(slotProps.data.inventoryStatus)" />
                    </template>
                </Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editProduct(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Product Details" :modal="true">
            <div class="flex flex-col gap-6">
                <div class="box-shadow p-4">
                    <div class="flex flex-col items-center gap-4">
                        <h4 class="font-bold mb-2">Upload Product Images</h4>
                        <small v-if="submitted && !uploadedImages.length" class="text-red-500">Please Insert An image.</small>
                        <input type="file" multiple @change="uploadImages" accept="image/*" />
                        <div v-if="uploadedImages.length" class="grid grid-cols-3 gap-4 mt-4">
                            <!-- Display Uploaded Images -->
                            <div v-for="(image, index) in uploadedImages" :key="index" class="relative">
                                <img :src="image" alt="Uploaded Image" class="w-full rounded border" />
                                <button class="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-sm" @click="removeImage(index)">✕</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-6">
                        <label for="name" class="block font-bold mb-3">no name</label>
                        <InputText id="name" v-model.trim="product.name" required="true" autofocus :invalid="submitted && !product.name" fluid />
                        <small v-if="submitted && !product.name" class="text-red-500">Name is required.</small>
                    </div>
                    <div class="col-span-6">
                        <label for="code" class="block font-bold mb-3">Code</label>
                        <InputText id="code" v-model.trim="product.code" required="false" autofocus :invalid="submitted && !product.code" fluid />
                        <small v-if="submitted && !product.code" class="text-red-500">Code is Optional.</small>
                    </div>
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Description</label>
                    <Textarea id="description" v-model="product.description" required="true" rows="3" cols="20" fluid />
                </div>
                <div>
                    <label for="inventoryStatus" class="block font-bold mb-3">Inventory Status</label>
                    <Select id="inventoryStatus" v-model="product.inventoryStatus" :options="statuses" optionLabel="label" placeholder="Select a Status" fluid></Select>
                </div>

                <div>
                    <!-- Display categories -->
                    <div>
                        <span class="block font-bold mb-4">Category</span>
                        <div class="grid grid-cols-12 gap-4">
                            <div v-for="category in categories" :key="category.id" class="flex items-center gap-2 col-span-6">
                                <RadioButton :id="'category' + category.id" v-model="product.sousCategorie" name="category" :value="category" :invalid="submitted && !product.sousCategorie" />
                                <label :for="'category' + category.id">{{ category.name }}</label>
                            </div>
                        </div>
                        <small v-if="submitted && !product.sousCategorie" class="text-red-500">Please select a category.</small>
                    </div>

                    <!-- Display fields for the selected category -->
                    <div v-if="product.sousCategorie">
                        <span class="block font-bold mt-6 mb-4">Fields for {{ product.sousCategorie.name }}</span>
                        <div v-for="(field, index) in product.sousCategorie.fields" :key="index" class="mb-2">
                            <label :for="'field-' + index" class="block font-bold">{{ field }}</label>
                            <InputText type="text" :id="'field-' + index" v-model="product.fields[field]" class="border rounded px-2 py-1 w-full" :required="true" autofocus :invalid="submitted" fluid />
                            <small v-if="submitted && !product.fields[field]" class="text-red-500">This field is required.</small>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-6">
                        <label for="price" class="block font-bold mb-3">Price</label>
                        <InputNumber id="price" v-model="product.price" mode="currency" currency="USD" locale="en-US" fluid />
                    </div>
                    <div class="col-span-6">
                        <label for="quantity" class="block font-bold mb-3">Quantity</label>
                        <InputNumber id="quantity" v-model="product.quantity" integeronly fluid />
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveProduct" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="product"
                    >Are you sure you want to delete <b>{{ product.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteProduct" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="product">Are you sure you want to delete the selected products?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProductsDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedProducts" />
            </template>
        </Dialog>
    </div>
</template>
