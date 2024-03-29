<script setup>
import { ProductService } from '@/service/ProductService';
import { PhotoService } from '@/service/PhotoService';
import { ref, onMounted } from 'vue';

const products = ref([]);
const images = ref([]);
const galleriaResponsiveOptions = ref([
    {
        breakpoint: '1024px',
        numVisible: 5
    },
    {
        breakpoint: '960px',
        numVisible: 4
    },
    {
        breakpoint: '768px',
        numVisible: 3
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
]);
const carouselResponsiveOptions = ref([
    {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
    },
    {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
    },
    {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
    }
]);

const productService = new ProductService();
const photoService = new PhotoService();

onMounted(() => {
    productService.getProductsSmall().then((data) => (products.value = data));
    photoService.getImages().then((data) => (images.value = data));
});

const getSeverity = (status) => {
    switch (status) {
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
    <div class="grid p-fluid">
        <div class="col-12">
            <div class="card">
                <h5>Carousel</h5>
                <Carousel :value="products" :numVisible="3" :numScroll="3" :responsiveOptions="carouselResponsiveOptions">
                    <template #item="slotProps">
                        <div class="border-1 surface-border border-round m-2 p-3">
                            <div class="mb-3">
                                <div class="relative mx-auto">
                                    <img :src="'/demo/images/product/' + slotProps.data.image" :alt="slotProps.data.name" class="w-full border-round" />
                                    <Tag :value="slotProps.data.inventoryStatus" :severity="getSeverity(slotProps.data.inventoryStatus)" class="absolute" style="left: 5px; top: 5px" />
                                </div>
                            </div>
                            <div class="mb-3 font-medium">{{ slotProps.data.name }}</div>
                            <div class="flex justify-content-between align-items-center">
                                <div class="mt-0 font-semibold text-xl">${{ slotProps.data.price }}</div>
                                <span>
                                    <Button icon="pi pi-heart" severity="secondary" outlined />
                                    <Button icon="pi pi-shopping-cart" class="ml-2" />
                                </span>
                            </div>
                        </div>
                    </template>
                </Carousel>
            </div>
        </div>

        <div class="col-12">
            <div class="card">
                <h5>Image</h5>
                <div class="flex justify-content-center">
                    <Image :src="'/demo/images/galleria/galleria11.jpg'" alt="Image" width="250" preview />
                </div>
            </div>
        </div>

        <div class="col-12">
            <div class="card">
                <h5>Galleria</h5>
                <Galleria :value="images" :responsiveOptions="galleriaResponsiveOptions" :numVisible="7"
                    :circular="true" containerStyle="max-width: 800px; margin: auto">
                    <template #item="slotProps">
                        <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt"
                            style="width: 100%; display: block" />
                    </template>
                    <template #thumbnail="slotProps">
                        <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt"
                            tyle="width: 100%; display: block;" />
                    </template>
                </Galleria>
            </div>
        </div>
    </div>
</template>
