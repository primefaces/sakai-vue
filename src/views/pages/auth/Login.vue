<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/authService'; // Adjust the path to match your project structure
import api from '@/services/api';

const email = ref('');
const password = ref('');
const checked = ref(false);
const router = useRouter();

const login = async () => {
  try {
    const accessToken = await authService.login(email.value, password.value); // Call login API
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`; // Set access token for future requests
    router.push('/dashboard'); // Navigate to the dashboard after successful login
  } catch (error) {
    console.error('Login failed:', error);
    alert('Login failed. Please check your email and password.');
    router.push('/auth/login'); // Navigate to the dashboard after successful login
  }
};
</script>

<template>
  <!--   <FloatingConfigurator /> -->
  <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
    <div class="flex flex-col items-center justify-center">
      <div
        style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)"
      >
        <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
          <div class="text-center mb-8">
            <div class="flex flex-col items-center justify-center text-center mb-8">
              <img
                src="../../../assets/images/NeoLogic.png"
                class="w-[250px] h-auto object-cover rounded-lg"
                alt="NeoLogic Logo"
              />
            </div>
            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Welcome Admin !</div>
            <span class="text-muted-color font-medium">Sign in to continue</span>
          </div>

          <div>
            <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
            <InputText
              id="email1"
              type="text"
              placeholder="Email address"
              class="w-full md:w-[30rem] mb-8"
              v-model="email"
            />

            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
            <Password
              id="password1"
              v-model="password"
              placeholder="Password"
              :toggleMask="true"
              class="mb-4"
              fluid
              :feedback="false"
            ></Password>

            <div class="flex items-center justify-between mt-2 mb-8 gap-8">
              <div class="flex items-center">
                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                <label for="rememberme1">Remember me</label>
              </div>
              <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Forgot password?</span>
            </div>
            <Button label="Sign In" class="w-full" @click="login"></Button>
          </div>
        </div>
      </div>
    </div>
  </div>
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
