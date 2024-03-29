<script setup>
import { ref } from 'vue';

const customEvents = ref([
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
    <div class="grid">
        <div class="col-6">
            <div class="card">
                <h5>Left Align</h5>
                <Timeline :value="customEvents">
                    <template #content="slotProps">
                        {{ slotProps.item.status }}
                    </template>
                </Timeline>
            </div>
        </div>
        <div class="col-6">
            <div class="card">
                <h5>Right Align</h5>
                <Timeline :value="customEvents" align="right">
                    <template #content="slotProps">
                        {{ slotProps.item.status }}
                    </template>
                </Timeline>
            </div>
        </div>
        <div class="col-6">
            <div class="card">
                <h5>Alternate Align</h5>
                <Timeline :value="customEvents" align="alternate">
                    <template #content="slotProps">
                        {{ slotProps.item.status }}
                    </template>
                </Timeline>
            </div>
        </div>
        <div class="col-6">
            <div class="card">
                <h5>Opposite Content</h5>
                <Timeline :value="customEvents">
                    <template #opposite="slotProps">
                        <small class="p-text-secondary">{{ slotProps.item.date }}</small>
                    </template>
                    <template #content="slotProps">
                        {{ slotProps.item.status }}
                    </template>
                </Timeline>
            </div>
        </div>
    </div>
    <div class="card">
        <h5>Custom Timeline</h5>
        <Timeline :value="customEvents" align="alternate" class="customized-timeline">
            <template #marker="slotProps">
                <span class="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-2" :style="{ backgroundColor: slotProps.item.color }">
                    <i :class="slotProps.item.icon"></i>
                </span>
            </template>
            <template #content="slotProps">
                <Card>
                    <template #title>
                        {{ slotProps.item.status }}
                    </template>
                    <template #subtitle>
                        {{ slotProps.item.date }}
                    </template>
                    <template #content>
                        <img v-if="slotProps.item.image" :src="'/demo/images/product/' + slotProps.item.image" :alt="slotProps.item.name" width="200" class="shadow-2 mb-3" />
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate
                            neque quas!
                        </p>
                        <Button label="Read more" class="p-button-text"></Button>
                    </template>
                </Card>
            </template>
        </Timeline>
    </div>
    <div class="card mt-3">
        <h5>Horizontal</h5>
        <h6>Top Align</h6>
        <Timeline :value="horizontalEvents" layout="horizontal" align="top">
            <template #content="slotProps">
                {{ slotProps.item }}
            </template>
        </Timeline>

        <h6>Bottom Align</h6>
        <Timeline :value="horizontalEvents" layout="horizontal" align="bottom">
            <template #content="slotProps">
                {{ slotProps.item }}
            </template>
        </Timeline>

        <h6>Alternate Align</h6>
        <Timeline :value="horizontalEvents" layout="horizontal" align="alternate">
            <template #opposite> &nbsp; </template>
            <template #content="slotProps">
                {{ slotProps.item }}
            </template>
        </Timeline>
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
