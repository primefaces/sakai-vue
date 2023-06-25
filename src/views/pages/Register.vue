<script setup>
import { ref } from 'vue';

const dropdownItems = ref([
    { name: 'Male', code: 'Male' },
    { name: 'Female', code: 'Female' }
]);

const dropdownRoles = ref([
    { name: 'User', code: 'user' },
    { name: 'Admin', code: 'admin' }
]);

const dropdownItem = ref(null);
const dropdownRole = ref(null);
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h3>User Registrations</h3>
                <div class="p-fluid formgrid grid">
                    <div class="field col-12 md:col-6">
                        <label for="firstname">Firstname</label>
                        <InputText id="firstname" type="text" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="lastname">Lastname</label>
                        <InputText id="lastname" type="text" />
                    </div>
                    <div class="field col-12">
                        <h5>Address</h5>
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="line1">Line 1</label>
                        <Textarea id="line1" rows="2" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="line2">Line 2</label>
                        <Textarea id="line2" rows="2" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="email">Email</label>
                        <InputText id="email" type="email" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="password">Password</label>
                        <InputText id="password" type="password" />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="gender">Sex</label>
                        <Dropdown id="gender" v-model="dropdownItem" :options="dropdownItems" optionLabel="name" placeholder="Select One"></Dropdown>
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="role">Role</label>
                        <Dropdown id="role" v-model="dropdownRole" :options="dropdownRoles" optionLabel="name" placeholder="Select One"></Dropdown>
                    </div>
                </div>
                <Button label="Submit"></Button>
            </div>
        </div>
    </div>
</template>