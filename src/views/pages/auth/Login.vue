<script setup>
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { getCurrentUser, getUser } from '../../../firebase/db/users';
import router from '../../../router';
// import AppConfig from '@/layout/AppConfig.vue';

const toast = useToast();

const email = ref('');
const password = ref('');
const errorMsg = ref('');
const checked = ref(false);

const userInfo = ref(null);
const maeInfo = ref(null);

onMounted(async () => {
  userInfo.value = await getCurrentUser();

  // Verifica si el usuario ya inició sesión
  if (userInfo) {
    router.push('/inicio'); // Redirige a la página 'maesActivos'
  }
});

function isValidTecMxEmail(email) {
    // Regular expression to match the pattern of (string of characters)@tec.mx
    const regex = /^[a-zA-Z0-9._%+-]+@tec\.mx$/;
    return regex.test(email);
}

const onSignIn = () => {
    
    const auth = getAuth();

    if (email.value == '' || password.value == '') {
        errorMsg.value = 'Por favor ingresa todos los campos'
        return;
    }

    if (!isValidTecMxEmail(email.value)) {
        errorMsg.value = 'Por favor inicia sesión con un correo @tec.mx'
        return;
    }

    // TODO: Agregar persistencia de sesiones
    signInWithEmailAndPassword(auth, email.value, password.value)
        .then(async (data) => {
            if (auth.currentUser.emailVerified) {
                router.push('/maesactivos');
            }
            else {
                errorMsg.value = 'Por favor verifica tu correo para continuar. Revisa tu bandeja de entrada y spam'
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
            <img src="../../../../public/layout/images/logo-maes.svg" alt="Sakai logo" class="mb-5 w-16rem flex-shrink-0" />
            <div
                style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <div class="text-900 text-3xl font-medium mb-3">Bienvenid@ al portal de MAE</div>
                        <span class="text-600 font-medium">Inicia sesión para continuar</span>
                    </div>

                    <div>
                        <Toast />
                        <label for="email" class="block text-900 text-xl font-medium mb-2">Correo</label>
                        <InputText id="email" type="text" placeholder="Correo electrónico" class="w-full md:w-30rem mb-5"
                            style="padding: 1rem" v-model="email" />

                        <label for="password" class="block text-900 font-medium text-xl mb-2">Contraseña</label>
                        <Password id="password" v-model="password" placeholder="Password" :toggleMask="true" class="w-full"
                            inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>

                        <a href="/#/auth/password-reset">
                            <p class="text-center text-indigo-800 w-full mt-2 underline cursor-pointer">¿Olvidaste tu contraseña?</p>
                        </a>
                        <Message v-if="errorMsg" severity="error" class="mt-2"> {{ errorMsg }} </Message>

                        <!-- <div class="flex align-items-center justify-content-between mb-5 mt-3 gap-5">
                            <div class="flex align-items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Recuerdame</label>
                            </div>
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Olvidaste tu contraseña?</a>
                        </div> -->
                        <Divider />
                        <Button @click="onSignIn" :disabled="email == '' || password == ''" label="Iniciar sesión" class="w-full p-3 mb-3 text-xl"></Button>
                        <Button @click="router.push('/auth/register')" label="Registrarse" class="w-full p-3 text-xl" severity="secondary"></Button>
                        <a href="https://firebasestorage.googleapis.com/v0/b/peer-teaching.appspot.com/o/documents%2FAvisoPrivacidadMaesMx.pdf?alt=media&token=425380a0-f154-4723-b73a-4505a8a4fae2">
                            <p class="text-center text-indigo-800 w-full mt-4 underline cursor-pointer">Aviso de privacidad</p>
                        </a>
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
