<script setup>
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import router from '../../../router';
// import AppConfig from '@/layout/AppConfig.vue';

const toast = useToast();

const email = ref('');
const password = ref('');
const errorMsg = ref('');
const checked = ref(false);

const onSignIn = () => {
    
    const auth = getAuth();

    // TODO: Agregar persistencia de sesiones
    signInWithEmailAndPassword(auth, email.value, password.value)
        .then(async (data) => {
            if (auth.currentUser.emailVerified) {
                router.push('/');
            }
            else {
                toast.add({ severity: 'info', summary: 'Por favor verifica tu correo para continuar', detail: 'Revisa tu bandeja de entrada y spam' });
            }
        })
        .catch((error) => {
            switch (error.code) {
                case "auth/invalid-email":
                    errorMsg.value = 'Correo no válido'
                    break;
                case "auth/user-not-found":
                    errorMsg.value = 'No se encontró un usuario con ese correo'
                    break;
                case "auth/wrong-password":
                    errorMsg.value = 'Contraseña incorrecta'
                    break;
                default:
                    errorMsg.value = 'El correo o la constraseña no son válidos'
                    break;
            }
        })
}
</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <img src="layout/images/logo-maes.svg" alt="Sakai logo" class="mb-5 w-16rem flex-shrink-0" />
            <div
                style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <div class="text-900 text-3xl font-medium mb-3">Bienvenid@ al portal de MAE</div>
                        <span class="text-600 font-medium">Inicia sesión para continuar</span>
                    </div>

                    <div>
                        <Toast />
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Correo</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-30rem mb-5"
                            style="padding: 1rem" v-model="email" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Contraseña</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="w-full"
                            inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>

                        <Message v-if="errorMsg" severity="error" class="mt-3"> {{ errorMsg }} </Message>

                        <div class="flex align-items-center justify-content-between mb-5 mt-3 gap-5">
                            <div class="flex align-items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Recuerdame</label>
                            </div>
                            <!-- <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Olvidaste tu contraseña?</a> -->
                        </div>
                        <Divider />
                        <Button @click="onSignIn" label="Inicar sesión" class="w-full p-3 mb-3 text-xl"></Button>
                        <Button label="Registrarse" disabled class="w-full p-3 text-xl"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- <AppConfig simple /> -->
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}</style>
