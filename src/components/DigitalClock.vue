<script setup>
import { ref } from 'vue';
import { useCurrentTime } from '../layout/composables/useCurrentTime';
import { useDtrStore } from '@/stores/dtr';

import Employee from './Employee.vue';

// const layoutWrapper = document.querySelector('.layout-wrapper');
// layoutWrapper.classList.add('layout-static-inactive');

// let date = new Date('2023-08-07T00:00:00Z'); // Date in ISO 8601 format
// console.log(date)
// let timestamp = date.getTime();
// console.log(timestamp); 

const dtrStore = useDtrStore();
let earlybirds = ref(dtrStore.earlyBirds());
let nightowls = ref(dtrStore.nightOwls());
// const withinR9 = ref(dtrStore.earlyBirds());
// const outsideR9 = ref(dtrStore.earlyBirds());

const { currentTime } = useCurrentTime();
const formatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

var emp_number = ref('');
const placeholder = ref('');
const activeButton = ref('AM-IN'); // Keep track of the active button
var msg = ref('');

const timeIn = (period) => {
    placeholder.value = `Time In for ${period}`;
    activeButton.value = `${period}-IN`;
};

const timeOut = (period) => {
    placeholder.value = `Time Out for ${period}`;
    activeButton.value = `${period}-OUT`;
};

async function submit() {
    switch (activeButton.value) {
        case 'AM-IN': {
            try {
                // console.log(emp_number.value);
                let dtr = await dtrStore.TimeInAM(emp_number.value);
                if (dtr) {
                    msg.value = 'Good Morning ' + dtrStore.fullname;
                    setTimeout(() => {
                        emp_number.value = '';
                        msg.value = null;
                        dtrStore.user_id = null;
                        dtrStore.fullname = null;
                        dtrStore.emp_number = null;
                        dtrStore.date = null;
                        dtrStore.inAM = null;
                        dtrStore.outAM = null;
                        dtrStore.inPM = null;
                        dtrStore.outPM = null;
                        dtrStore.ip = null;
                    }, 3000);
                    // either redirect or hide login modal, dipende na use case
                    // console.log('Logged in!');
                } else {
                    msg.value = 'Employee not found';
                    setTimeout(() => {
                        emp_number.value = '';
                        msg.value = null;
                        dtrStore.user_id = null;
                        dtrStore.fullname = null;
                        dtrStore.emp_number = null;
                        dtrStore.date = null;
                        dtrStore.inAM = null;
                        dtrStore.outAM = null;
                        dtrStore.inPM = null;
                        dtrStore.outPM = null;
                        dtrStore.ip = null;
                    }, 3000);
                    // yan failed el login
                    // man alert lng nu? or reload. Yes puede tamen.
                    // nccta pa extension para na documentation?
                    // no need ya ata.
                    // console.log('Else but not logged in.');
                }
            } catch (error) {
                console.log('ERROR:', error);
            }
            break;
        }

        case 'AM-OUT': {
            try {
                // console.log(emp_number.value);
                let dtr = await dtrStore.TimeOutAM(emp_number.value);
                if (dtr) {
                    msg.value = 'Enjoy your Lunch ' + dtrStore.fullname;
                    setTimeout(() => {
                        emp_number.value = '';
                        msg.value = null;
                        dtrStore.user_id = null;
                        dtrStore.fullname = null;
                        dtrStore.emp_number = null;
                        dtrStore.date = null;
                        dtrStore.inAM = null;
                        dtrStore.outAM = null;
                        dtrStore.inPM = null;
                        dtrStore.outPM = null;
                        dtrStore.ip = null;
                    }, 3000);
                } else {
                    msg.value = 'Employee not found';
                    setTimeout(() => {
                        emp_number.value = '';
                        msg.value = null;
                        dtrStore.user_id = null;
                        dtrStore.fullname = null;
                        dtrStore.emp_number = null;
                        dtrStore.date = null;
                        dtrStore.inAM = null;
                        dtrStore.outAM = null;
                        dtrStore.inPM = null;
                        dtrStore.outPM = null;
                        dtrStore.ip = null;
                    }, 3000);
                }
            } catch (error) {
                console.log('ERROR:', error);
            }
            break;
        }
        case 'PM-IN': {
            try {
                console.log(emp_number.value);
                let dtr = await dtrStore.TimeInPM(emp_number.value);
                if (dtr) {
                    msg.value = 'Good Afternoon ' + dtrStore.fullname;
                    setTimeout(() => {
                        emp_number.value = '';
                        msg.value = null;
                        dtrStore.user_id = null;
                        dtrStore.fullname = null;
                        dtrStore.emp_number = null;
                        dtrStore.date = null;
                        dtrStore.inAM = null;
                        dtrStore.outAM = null;
                        dtrStore.inPM = null;
                        dtrStore.outPM = null;
                        dtrStore.ip = null;
                    }, 3000);
                } else {
                    msg.value = 'Employee not found';
                    setTimeout(() => {
                        emp_number.value = '';
                        msg.value = null;
                        dtrStore.user_id = null;
                        dtrStore.fullname = null;
                        dtrStore.emp_number = null;
                        dtrStore.date = null;
                        dtrStore.inAM = null;
                        dtrStore.outAM = null;
                        dtrStore.inPM = null;
                        dtrStore.outPM = null;
                        dtrStore.ip = null;
                    }, 3000);
                }
            } catch (error) {
                console.log('ERROR:', error);
            }
            break;
        }
        case 'PM-OUT': {
            try {
                console.log(emp_number.value);
                let dtr = await dtrStore.TimeOutPM(emp_number.value);
                if (dtr) {
                    msg.value = 'Good bye ' + dtrStore.fullname;
                    setTimeout(() => {
                        emp_number.value = '';
                        msg.value = null;
                        dtrStore.user_id = null;
                        dtrStore.fullname = null;
                        dtrStore.emp_number = null;
                        dtrStore.date = null;
                        dtrStore.inAM = null;
                        dtrStore.outAM = null;
                        dtrStore.inPM = null;
                        dtrStore.outPM = null;
                        dtrStore.ip = null;
                    }, 3000);
                } else {
                    msg.value = 'Employee not found';
                    setTimeout(() => {
                        emp_number.value = '';
                        msg.value = null;
                        dtrStore.user_id = null;
                        dtrStore.fullname = null;
                        dtrStore.emp_number = null;
                        dtrStore.date = null;
                        dtrStore.inAM = null;
                        dtrStore.outAM = null;
                        dtrStore.inPM = null;
                        dtrStore.outPM = null;
                        dtrStore.ip = null;
                    }, 3000);
                }
            } catch (error) {
                console.log('ERROR:', error);
            }
            break;
        }
        default:
    }
}
</script>

<template>
    <div id="employees" class="flex">
        <div class="card col-6 mr-2">
            <h4>Present</h4>
            <h5>Early Birds ()</h5>

            <Employee v-for="bird in dtrStore.earlybirds" :employee="bird" :key="bird.user_id" />

            <h5>Night Owls ()</h5>
            <Employee v-for="owl in dtrStore.nightowls" :employee="owl" :key="owl.user_id" />
        </div>

        <div class="card col-3 mr-2">
            <h4>On Official Travel</h4>
            <h5>Within Region 9</h5>
            <!-- <Employee v-for="emp in dtrStore.withinR9" :employee="emp" :key="emp.user_id" /> -->

            <h5>Outside Region 9</h5>
            <!-- <Employee v-for="emp in dtrStore.employees" :employee="emp" :key="emp.user_id" /> -->
        </div>

        <div class="card col-3">
            <h4>Statistics</h4>
            <Button label="Present" icon="pi pi-users" badge="8" class="mr-2"></Button>
            <Button label="Absent" icon="pi pi-users" badge="8" class="p-button-warning mr-2" badgeClass="p-badge-danger"></Button>
        </div>
    </div>

    <div id="clock" class="flex">
        <div class="m-auto" style="border-radius: 56px; padding: 0.5rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
            <div class="w-full m-auto surface-card pt-4 pb-4 px-8 sm:px-8" style="border-radius: 53px">
                <div v-if="msg" class="w-full text-center font-semibold bg-cyan-400 text-white text-2xl mb-3 p-3 border-2">
                    {{ msg }}
                </div>
                <div v-if="!msg" class="w-full text-center font-semibold text-2xl mb-3 p-3">&nbsp;</div>
                <!-- <div class="w-full lg:w-1/4 m-auto p-7 shadow-lg shadow-pink-400 border-4 border-t-purple-600 border-r-pink-600 border-b-pink-600 border-l-indigo-600 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"> -->
                <InputText id="emp_number" v-model="emp_number" type="text" :placeholder="placeholder" class="w-full md:w-40rem mb-4 text-center" style="padding: 1.5rem" @keyup.enter="submit" />
                <span class="p-buttonset am-group">
                    <Button @click="timeIn('AM')" :class="{ active: activeButton === 'AM-IN' }" label="AM Time In" icon="pi pi-sign-in" />
                    <Button @click="timeOut('AM')" :class="{ active: activeButton === 'AM-OUT' }" label="AM Time Out" icon="pi pi-sign-out" />
                </span>
                &nbsp;
                <span class="p-buttonset pm-group p-2">
                    <Button @click="timeIn('PM')" :class="{ active: activeButton === 'PM-IN' }" label="PM Time In" icon="pi pi-sign-in" />
                    <Button @click="timeOut('PM')" :class="{ active: activeButton === 'PM-OUT' }" label="PM Time Out" icon="pi pi-sign-out" />
                </span>
                &nbsp;
                <p class="font-bold text-blue-700 pt-4 text-8xl font-semibold -mt-5">
                    {{ currentTime.toLocaleTimeString() }}
                </p>
                <p class="border-4 border-indigo-500/100 text-center text-blue-700 text-6xl font-bold -mt-6">
                    {{ currentTime.toLocaleDateString('en-US', formatOptions) }}
                </p>
            </div>
        </div>
    </div>
</template>

<style>
#clock {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 80px;
}

.fixed-width {
    width: 200px;
    /* Adjust to your desired width */
}

.active {
    background-color: #ffd700;
    /* Gold color for active status */
    color: #000;
}

.p-buttonset .p-button:hover,
.p-buttonset .p-button.active {
    background-color: #ffd700;
    /* Gold color for active status and hover */
    color: #000;
}
</style>
