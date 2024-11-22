<script setup>
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"
import router from '../../../router';
import { getCampuses } from '../../../firebase/db/campuses';
import { getMajors } from '../../../firebase/db/majors';
import { createUser } from '../../../firebase/db/users';
import {  useRoute } from 'vue-router';

const toast = useToast();
const route = useRoute(); 
const campuses = ref([]);
const majors = ref([]);

const newUserInfo = ref({
    "firstname": null,
    "lastname": null,
    "name": null,
    "campus": null,
    "major": null,
    "career": null,
    "area": null,
    "subjects": [],
    "weekSchedule": {},
    totalTime: 0,
    status: "estudiante",
    "role": "user",
    "email": null,
    "id": null,
    "uid": null
});

const password1 = ref('');
const password2 = ref('');
const errorMsg = ref('');


onMounted(async () => {
    campuses.value = await getCampuses();
    majors.value = await getMajors();
})

// Helper function to check if any required field is empty
const isAnyFieldEmpty = () => {
    return (
        !newUserInfo.value.email ||
        !password1.value ||
        !newUserInfo.value.firstname ||
        !newUserInfo.value.lastname ||
        !newUserInfo.value.campus ||
        !newUserInfo.value.major
    );
};

function isValidTecMxEmail(email) {
    // Regular expression to match the pattern of (string of characters)@tec.mx
    const regex = /^[a-zA-Z0-9._%+-]+@tec\.mx$/;
    return regex.test(email);
}

const checkPassword = (password) => {
    return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[`!@#$%^&*()_+\-=\[\]{};':\\|,.<>\/?~]/.test(password)
}

const onSignUp = () => {
    const auth = getAuth();

    // Validate the form before proceeding
    if (!isFormValid()) {
        return;
    }
    newUserInfo.value.email = newUserInfo.value.email.toLowerCase();
    newUserInfo.value.email = newUserInfo.value.email.trim();

    // Register the user if the form is valid
    registerUser(auth);
};

// Function to validate the entire form
const isFormValid = () => {
    // Check if the email is a valid TecMx email
    if (!isValidTecMxEmail(newUserInfo.value.email)) {
        errorMsg.value = 'Por favor inicia sesión con un correo válido (@tec.mx)';
        return false;
    }

    // Check if the passwords match
    if (password1.value !== password2.value) {
        errorMsg.value = 'Por favor asegurate de que las contraseñas coincidan';
        return false;
    }

    // Check if the password meets the requirements
    if (!checkPassword(password1.value)) {
        errorMsg.value = 'Por favor asegurate de la contraseña cumpla con los requisitos (8 caracteres, mayusculas y minusculas, números y caracteres especiales)';
        return false;
    }

    // Check if any required field is empty
    if (isAnyFieldEmpty()) {
        errorMsg.value = 'Por favor ingresa todos los campos';
        return false;
    }

    // If all checks pass, return true
    return true;
};

// Function to handle user registration
const registerUser = (auth) => {
    createUserWithEmailAndPassword(auth, newUserInfo.value.email, password1.value)
        .then(userCredential => {
            // Send verification email after user is created
            sendVerificationEmail(auth.currentUser);
        })
        .catch(error => {
            switch (error.code) {
                case "auth/email-already-in-use":
                    errorMsg.value = 'Este correo ya se encuentra en uso';
                    break;
                default:
                    errorMsg.value = 'Ocurrió un error inesperado, contacta a un administrador de la página';
                    break;
            }
        }); // Handle any errors during user creation
};

// Function to send an email verification
const sendVerificationEmail = (user) => {
    sendEmailVerification(user)
        .then(() => {
            // Save the user to the database after sending the verification email
            saveUserToDatabase(newUserInfo.value);
        })
        .catch(error => {
            console.error(error);
            errorMsg.value = 'Ocurrió un error al enviar el correo de verificación, contacta a un administrador de la página';
        });
};

// Function to save the user information to the database
const saveUserToDatabase = (userInfo) => {
    createUser(userInfo)
        .then(() => {
            const asesoriaId = route.query.asesoriaId || ''; 
            const targetPath = `/auth/login`;
            const targetPathWithQuery = asesoriaId ? `${targetPath}?redirect=&asesoriaId=${asesoriaId}` : targetPath;
            router.push(targetPathWithQuery); 
            toast.add({ severity: 'info', summary: 'Cuenta creada correctamente', detail: 'Por favor verifica tu correo para continuar. Revisa tu bandeja de entrada y spam' });
        })
        .catch(error => {
            console.error(error);
            errorMsg.value = 'Ocurrió un error al guardar tu usuario en la base de datos, contacta a un administrador de la página';
        });
};

function handleLoginClick() {
  const asesoriaId = route.query.asesoriaId || ''; 
  const targetPath = `/auth/login`;
  const targetPathWithQuery = asesoriaId ? `${targetPath}?redirect=&asesoriaId=${asesoriaId}` : targetPath;

  router.push(targetPathWithQuery); 
}
</script>

<template>
    <div
        class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <img src="../../../../public/layout/images/logo-maes.svg" alt="Sakai logo" class="mb-5 w-16rem flex-shrink-0" />
            <div
                style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <div class="text-900 text-3xl font-medium mb-3">Bienvenid@ al portal de MAE</div>
                        <span class="text-600 font-medium">Registrate para continuar</span>
                    </div>

                    <div>
                        <Toast />
                        <label for="email" class="block text-900 text-xl font-medium mb-2">Correo</label>
                        <InputText id="email" type="text" placeholder="example@tec.mx" class="w-full mb-5"
                            v-model="newUserInfo.email" />

                        <label for="firstname" class="block text-900 text-xl font-medium mb-2">Nombre</label>
                        <InputText id="firstname" v-model="newUserInfo.firstname" placeholder="Nombre"
                            class="w-full mb-4" />

                        <label for="lastname" class="block text-900 text-xl font-medium mb-2">Apellido</label>
                        <InputText id="lastname" v-model="newUserInfo.lastname" placeholder="Apellido"
                            class="w-full mb-4" />

                        <label for="career" class="block text-900 text-xl font-medium mb-2">Carrera</label>
                        <Dropdown v-model="newUserInfo.major" :options="majors" filter
                            optionLabel="name" placeholder="Carrera" checkmark :highlightOnSelect="false"
                            class="w-12 mb-4" />

                        <label for="campus" class="block text-900 text-xl font-medium mb-2">Campus</label>
                        <Dropdown v-model="newUserInfo.campus" :options="campuses" optionValue="id" filter
                            optionLabel="name" placeholder="Carrera" checkmark :highlightOnSelect="false"
                            class="w-12 mb-4" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Contraseña diferente a la institucional</label>
                        <Password id="password1" v-model="password1" placeholder="Contraseña" :toggleMask="true"
                            class="w-full mb-4" inputClass="w-full" :inputStyle="{ padding: '1rem' }">
                            <template #header>
                                <h6>Introduce tu contraseña diferente a la institucional</h6>
                            </template>
                            <template #footer>
                                <Divider />
                                <p class="mt-2">La contraseña debe contener: </p>
                                <ul class="pl-2 ml-2 mt-0 leading-6">
                                    <li><i class="pi font-bold"
                                            :class="password1.length >= 8 ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-500'"></i>
                                        La longitud mínima es de 8 caracteres.</li>
                                    <li><i class="pi font-bold"
                                            :class="/[A-Z]/.test(password1) ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-500'"></i>
                                        Se requiere al menos una letra mayúscula.</li>
                                    <li><i class="pi font-bold"
                                            :class="/[a-z]/.test(password1) ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-500'"></i>
                                        Se requiere al menos una letra minúscula.</li>
                                    <li><i class="pi font-bold"
                                            :class="/\d/.test(password1) ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-500'"></i>
                                        Se requiere al menos un dígito numérico.</li>
                                    <li><i class="pi font-bold"
                                            :class="/[`!@#$%^&*()_+\-=\[\]{};':\\|,.<>\/?~]/.test(password1) ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-500'"></i>
                                        Se requiere al menos un carácter especial (!, @, #, $, etc.).</li>
                                        
                                </ul>
                            </template>
                        </Password>

                        <label for="password2" class="block text-900 font-medium text-xl mb-2">Repetir
                            contraseña</label>
                        <Password id="password2" v-model="password2" placeholder="Contraseña" :toggleMask="true"
                            class="w-full" inputClass="w-full" :inputStyle="{ padding: '1rem' }">
                            <template #header>
                                <h6>Introduce tu contraseña</h6>
                            </template>
                            <template #footer>
                                <Divider />
                                <p class="mt-2">La contraseña debe contener: </p>
                                <ul class="pl-2 ml-2 mt-0 leading-6">
                                    <li><i class="pi font-bold"
                                            :class="password2.length >= 8 ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-500'"></i>
                                        La longitud mínima es de 8 caracteres.</li>
                                    <li><i class="pi font-bold"
                                            :class="/[A-Z]/.test(password2) ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-500'"></i>
                                        Se requiere al menos una letra mayúscula.</li>
                                    <li><i class="pi font-bold"
                                            :class="/[a-z]/.test(password2) ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-500'"></i>
                                        Se requiere al menos una letra minúscula.</li>
                                    <li><i class="pi font-bold"
                                            :class="/\d/.test(password2) ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-500'"></i>
                                        Se requiere al menos un dígito numérico.</li>
                                    <li><i class="pi font-bold"
                                            :class="/[`!@#$%^&*()_+\-=\[\]{};':\\|,.<>\/?~]/.test(password2) ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-500'"></i>
                                        Se requiere al menos un carácter especial (!, @, #, $, etc.).</li>
                                        
                                </ul>
                            </template>
                        </Password>
                        <div class="text-center max-w-full mt-4">
                            <p class="text-600 font-medium">Recuerda usar una contraseña única y diferente a la que utilizas en otras cuentas, incluido tu correo institucional</p>
                        </div>

                        <Message v-if="errorMsg" severity="error" class="mt-2"> {{ errorMsg }} </Message>
                        <Divider />
                        <Button @click="onSignUp" label="Registrarse"
                            :disabled="newUserInfo.email == '' || password1 == '' || password2 == '' || newUserInfo.firstname == null || newUserInfo.lastname == null || newUserInfo.campus == null || newUserInfo.major == null"
                            class="w-full p-3 mb-3 text-xl"></Button>
                        <Button @click="handleLoginClick" label="Iniciar sesión"
                            class="w-full p-3 mb-3 text-xl" severity="secondary"></Button>
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
}
</style>
