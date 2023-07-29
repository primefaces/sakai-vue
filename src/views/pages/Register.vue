<script setup>
import { ref } from 'vue';

import { useUserStore } from "@/stores/user";
const userStore = useUserStore();

const dropdownItems = ref([
    { name: 'Male', code: 'male' },
    { name: 'Female', code: 'female' }
]);

const dropdownRoles = ref([
    { name: 'User', code: 'user' },
    { name: 'Admin', code: 'admin' }
]);

// const dropdownItem = ref(null);
const dropdownRole = ref(null);

// const onChangeGender = () =>{
    // userStore.gender = dropdownItem.value.code;
    // console.log(userStore.gender)
// }

const onChangeRole = () =>{
    userStore.role = dropdownRole.value.code;
}

async function register() {
    
    await userStore.signUp(
        userStore.email, userStore.password, userStore.firstName, userStore.lastName, userStore.role
    );
    // console.log("Log - Register.vue")
    // await userStore.signUp({
    //     email: userStore.email,
    //     password: userStore.password,
    //     firstName: userStore.firstName,
    //     lastName: userStore.lastName,
    //     role: userStore.role
    // })
    // console.log(userStore)
}
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h3>User Registrations</h3>
                <!-- <form @submit.prevent="userStore.signUp"> -->
                    <div class="p-fluid formgrid grid">
                        <div class="field col-12 md:col-6">
                            <label for="firstname">Firstname</label>
                            <InputText v-model="userStore.firstName" id="firstname" type="text" />
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="lastname">Lastname</label>
                            <InputText v-model="userStore.lastName" id="lastname" type="text" />
                        </div>
                        <div class="field col-12">
                            <h5>Address</h5>
                        </div>
                        <!-- <div class="field col-12 md:col-6">
                            <label for="line1">Line 1</label>
                            <Textarea v-model="userStore.line1" id="line1" rows="2" />
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="line2">Line 2</label>
                            <Textarea v-model="userStore.line2" id="line2" rows="2" />
                        </div> -->
                        <div class="field col-12 md:col-6">
                            <label for="email">Email</label>
                            <InputText v-model="userStore.email" id="email" type="email" />
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="password">Password</label>
                            <InputText v-model="userStore.password" id="password" type="password" />
                        </div>
                        <!--div class="field col-12 md:col-6">
                            <label for="gender">Sex</label>
                            <Dropdown @change="onChangeGender()" id="gender" v-model="dropdownItem" :options="dropdownItems" optionLabel="name" placeholder="Select One"></Dropdown>
                        </div-->
                        <div class="field col-12 md:col-6">
                            <label for="role">Role</label>
                            <Dropdown @change="onChangeRole()" id="role" v-model="dropdownRole" :options="dropdownRoles" optionLabel="name" placeholder="Select One"></Dropdown>
                            <!-- <Dropdown v-model="userStore.age" id="role" :options="dropdownRoles" optionLabel="name" placeholder="Select One"></Dropdown> -->
                        </div>
                    </div>
                    <Button @click="register" label="Submit"></Button>
                <!-- </form> -->
            </div>
        </div>
    </div>
</template>

<style>

</style>