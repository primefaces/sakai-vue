<script setup>
import { ref, toRefs, onMounted } from 'vue';
import EmployeeService from '@/service/EmployeeService';
import timeService from '@/service/TimeService.js';

const props = defineProps({
    employee: [],
});

let showDialog = ref(false);
let image = ref();
let name = ref('');

const { employee } = toRefs(props);

let inAM = timeService.getTimeFromTimestamp(employee.value.inAM);
let outAM = timeService.getTimeFromTimestamp(employee.value.outAM);
let inPM = timeService.getTimeFromTimestamp(employee.value.inPM);
let outPM = timeService.getTimeFromTimestamp(employee.value.outPM);

const employeeService = new EmployeeService();

onMounted(() => {
    employeeService
        .getImage(employee.value.user_id)
        .then((employeeImage) => {
            if (employeeImage) {
                image.value = employeeImage.itemImageSrc; // do something with the found image
                // name.value = employeeImage.fullname;

                let img = new Image();
                img.onload = function () {
                    // Image exists, keep the new image path and set the name
                    name.value = employeeImage.fullname;
                };
                img.onerror = function () {
                    // Image doesn't exist, revert to default image and set user_id as the name
                    image.value = 'data/images/photo/logo.png';
                    // name.value = ` ${employee.value.user_id} `;
                    name.value = employeeImage.fullname;
                };
                img.src = image.value;
            } else {
                image.value = 'data/images/photo/logo.png';
                name.value = ` ${employee.value.user_id} `;
            }
        })
        .catch((err) => {
            console.error(err); // handle any errors
        });
});

const handleClick = () => {
    showDialog.value = true;
};
</script>

<template>
    <Avatar :image="image" size="large" shape="circle" v-tooltip="name" @click="handleClick" />

    <Dialog v-model:visible="showDialog" modal :header="name" :style="{ width: '30vw' }"
        :breakpoints="{ '960px': '75vw', '641px': '100vw' }">
        <div class="w-full text-center font-semibold text-2xl mb-3 p-3">
            <!-- <Avatar :image="image" size="xlarge" shape="circle" /> -->
            <Image :src="image" alt="Image" width="310" />
        </div>
        <div class="w-full text-center font-semibold text-2xl mb-3 p-3">
            <div class="time-container">
                <p class="time-label">AM</p>
                <Button v-if="inAM" :label="inAM" alt="Time In" icon="pi pi-sign-in" size="large" />
                <Button v-if="!inAM" @click="timeIn('AM')" :class="{ active: activeButton === 'AM-IN' }" label="AM In"
                    icon="pi pi-sign-in" size="large" />
                &nbsp;&nbsp;
                <Button v-if="outAM" :label="outAM" icon="pi pi-sign-out" size="large" />
                <Button v-if="!outAM" @click="timeOut('AM')" :class="{ active: activeButton === 'AM-OUT' }" label="AM Out"
                    icon="pi pi-sign-out" size="large" />
            </div>
            <br /><br />
            <div class="time-container">
                <p class="time-label">PM</p>
                <Button v-if="inPM" :label="inPM" icon="pi pi-sign-in" size="large" />
                <Button v-if="!inPM" @click="timeIn('PM')" :class="{ active: activeButton === 'PM-IN' }" label="PM In"
                    icon="pi pi-sign-in" size="large" />
                &nbsp;&nbsp;
                <Button v-if="outPM" :label="outPM" icon="pi pi-sign-out" size="large" />
                <Button v-if="!outPM" @click="timeOut('PM')" :class="{ active: activeButton === 'PM-OUT' }" label="PM Out"
                    icon="pi pi-sign-out" size="large" />
            </div>
        </div>

    </Dialog>
</template>

<style>
.time-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.time-label {
    margin-right: 20px;
    padding-top: 10px;
}
</style>
