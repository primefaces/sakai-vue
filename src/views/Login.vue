<script setup>
import { ref } from 'vue';
import { loginGetToken } from '@/service/PointService'
import AppConfig from '@/layout/AppConfig.vue';

const username = ref('');
const password = ref('');


function login() {
    console.log(username.value, password.value)
    loginGetToken(username.value, password.value).then((data) => {
        window.localStorage.setItem("token", data)
        window.location = "/"

    }).catch((e) => {
        window.location = "/#/auth/error"
    })

}

</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <div class="text-900 text-3xl font-medium mb-3">Welcome to Lapwing</div>
                        <span class="text-600 font-medium">Sign in to continue</span>
                    </div>

                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">User Name</label>
                        <InputText id="email1" type="text" placeholder="user name" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="username" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true"  :feedback="false" class="w-full mb-5" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>


                        <Button label="Sign In" class="w-full p-3 text-xl" @click="login"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
