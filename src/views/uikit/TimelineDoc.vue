<script setup>
import { ref } from 'vue';

const events = ref([
    {
        status: 'Ordered',
        date: '15/10/2020 10:30',
        icon: 'pi pi-shopping-cart',
        color: '#9C27B0',
        image: 'game-controller.jpg'
    },
    {
        status: 'Processing',
        date: '15/10/2020 14:00',
        icon: 'pi pi-cog',
        color: '#673AB7'
    },
    {
        status: 'Shipped',
        date: '15/10/2020 16:15',
        icon: 'pi pi-envelope',
        color: '#FF9800'
    },
    {
        status: 'Delivered',
        date: '16/10/2020 10:00',
        icon: 'pi pi-check',
        color: '#607D8B'
    }
]);

const horizontalEvents = ref(['2020', '2021', '2022', '2023']);
</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <div class="col-span-6">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Left Align</div>
                <Timeline :value="events">
                    <template #content="slotProps">
                        {{ slotProps.item.status }}
                    </template>
                </Timeline>
            </div>
        </div>
        <div class="col-span-6">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Right Align</div>
                <Timeline :value="events" align="right">
                    <template #content="slotProps">
                        {{ slotProps.item.status }}
                    </template>
                </Timeline>
            </div>
        </div>
        <div class="col-span-6">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Alternate Align</div>
                <Timeline :value="events" align="alternate">
                    <template #content="slotProps">
                        {{ slotProps.item.status }}
                    </template>
                </Timeline>
            </div>
        </div>
        <div class="col-span-6">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Opposite Content</div>
                <Timeline :value="events">
                    <template #opposite="slotProps">
                        <small class="text-muted-color">{{ slotProps.item.date }}</small>
                    </template>
                    <template #content="slotProps">
                        {{ slotProps.item.status }}
                    </template>
                </Timeline>
            </div>
        </div>
        <div class="col-span-full">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Templating</div>
                <Timeline :value="events" align="alternate" class="customized-timeline">
                    <template #marker="slotProps">
                        <span class="flex w-8 h-8 items-center justify-center text-white rounded-full z-10 shadow-sm" :style="{ backgroundColor: slotProps.item.color }">
                            <i :class="slotProps.item.icon"></i>
                        </span>
                    </template>
                    <template #content="slotProps">
                        <Card class="mt-4">
                            <template #title>
                                {{ slotProps.item.status }}
                            </template>
                            <template #subtitle>
                                {{ slotProps.item.date }}
                            </template>
                            <template #content>
                                <img v-if="slotProps.item.image" :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.item.image}`" :alt="slotProps.item.name" width="200" class="shadow-sm" />
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse,
                                    cupiditate neque quas!
                                </p>
                                <Button label="Read more" text></Button>
                            </template>
                        </Card>
                    </template>
                </Timeline>
            </div>
        </div>
        <div class="col-span-full">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Horizontal</div>
                <div class="font-semibold mb-2">Top Align</div>
                <Timeline :value="horizontalEvents" layout="horizontal" align="top">
                    <template #content="slotProps">
                        {{ slotProps.item }}
                    </template>
                </Timeline>

                <div class="font-semibold mt-4 mb-2">Bottom Align</div>
                <Timeline :value="horizontalEvents" layout="horizontal" align="bottom">
                    <template #content="slotProps">
                        {{ slotProps.item }}
                    </template>
                </Timeline>

                <div class="font-semibold mt-4 mb-2">Alternate Align</div>
                <Timeline :value="horizontalEvents" layout="horizontal" align="alternate">
                    <template #opposite> &nbsp; </template>
                    <template #content="slotProps">
                        {{ slotProps.item }}
                    </template>
                </Timeline>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@media screen and (max-width: 960px) {
    ::v-deep(.customized-timeline) {
        .p-timeline-event:nth-child(even) {
            flex-direction: row !important;

            .p-timeline-event-content {
                text-align: left !important;
            }
        }

        .p-timeline-event-opposite {
            flex: 0;
        }

        .p-card {
            margin-top: 1rem;
        }
    }
}
</style>
