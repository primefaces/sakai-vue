<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const message = ref([]);
const username = ref(null);
const email = ref(null);
const value = ref(null);
const count = ref(0);

const addMessage = (type) => {
    if (type === 'success') {
        message.value = [{ severity: 'success', detail: 'Success Message', content: 'Message sent', id: count.value++ }];
    } else if (type === 'info') {
        message.value = [{ severity: 'info', detail: 'Info Message', content: 'PrimeVue rocks', id: count.value++ }];
    } else if (type === 'warn') {
        message.value = [{ severity: 'warn', detail: 'Warn Message', content: 'There are unsaved changes', id: count.value++ }];
    } else if (type === 'error') {
        message.value = [{ severity: 'error', detail: 'Error Message', content: 'Validation failed', id: count.value++ }];
    }
};

const showSuccess = () => {
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Message Detail', life: 3000 });
};

const showInfo = () => {
    toast.add({ severity: 'info', summary: 'Info Message', detail: 'Message Detail', life: 3000 });
};

const showWarn = () => {
    toast.add({ severity: 'warn', summary: 'Warn Message', detail: 'Message Detail', life: 3000 });
};

const showError = () => {
    toast.add({ severity: 'error', summary: 'Error Message', detail: 'Message Detail', life: 3000 });
};
</script>

<template>
    <div class="flex flex-col md:flex-row gap-4">
        <div class="card md:w-1/2">
            <h5 class="mb-2">Toast</h5>
            <div class="flex flex-wrap gap-2">
                <Button @click="showSuccess()" label="Success" severity="success" />
                <Button @click="showInfo()" label="Info" severity="info" />
                <Button @click="showWarn()" label="Warn" severity="warning" />
                <Button @click="showError()" label="Error" severity="danger" />
            </div>
        </div>
        <div class="card md:w-1/2">
            <h5 class="mb-2">Messages</h5>
            <div class="flex flex-wrap gap-2 mb-4">
                <Button label="Success" @click="addMessage('success')" severity="success" />
                <Button label="Info" @click="addMessage('info')" severity="info" />
                <Button label="Warn" @click="addMessage('warn')" severity="warning" />
                <Button label="Error" @click="addMessage('error')" severity="danger" />
            </div>

            <transition-group name="p-message" tag="div">
                <Message v-for="msg of message" :severity="msg.severity" :key="msg.content">{{ msg.content }}</Message>
            </transition-group>
        </div>
    </div>

    <div class="flex flex-col md:flex-row gap-4 mt-6">
        <div class="card md:w-1/2">
            <h5 class="mb-2">Inline</h5>
            <div class="flex flex-wrap mb-4 gap-2">
                <InputText v-model="username" placeholder="Username" aria-label="username" invalid />
                <Message severity="error">Username is required</Message>
            </div>
            <div class="flex flex-wrap gap-2">
                <InputText v-model="email" placeholder="Email" aria-label="email" invalid />
                <Message severity="error" icon="pi pi-times-circle" />
            </div>
        </div>
        <div class="card md:w-1/2">
            <h5 class="mb-2">Help Text</h5>
            <div class="flex flex-col gap-2">
                <label for="username">Username</label>
                <InputText id="username" v-model="value" aria-describedby="username-help" />
                <small id="username-help">Enter your username to reset your password.</small>
            </div>
        </div>
    </div>
</template>
