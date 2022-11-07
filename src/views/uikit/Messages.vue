<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const message = ref([]);
const username = ref(null);
const email = ref(null);
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
    <div class="grid">
        <div class="col-12 lg:col-6">
            <div class="card">
                <h5>Toast</h5>

                <Toast />
                <Button @click="showSuccess()" label="Success" class="p-button-success mr-2" />
                <Button @click="showInfo()" label="Info" class="p-button-info mr-2" />
                <Button @click="showWarn()" label="Warn" class="p-button-warning mr-2" />
                <Button @click="showError()" label="Error" class="p-button-danger mr-2" />
            </div>
        </div>

        <div class="col-12 lg:col-6">
            <div class="card">
                <h5>Messages</h5>

                <Button label="Success" @click="addMessage('success')" class="p-button-success mr-2" />
                <Button label="Info" @click="addMessage('info')" class="p-button-info mr-2" />
                <Button label="Warn" @click="addMessage('warn')" class="p-button-warning mr-2" />
                <Button label="Error" @click="addMessage('error')" class="p-button-danger mr-2" />

                <transition-group name="p-message" tag="div">
                    <Message v-for="msg of message" :severity="msg.severity" :key="msg.content">{{ msg.content }}</Message>
                </transition-group>
            </div>
        </div>

        <div class="col-12 lg:col-8">
            <div class="card">
                <h5>Inline</h5>
                <div class="field grid">
                    <label for="username1" class="col-fixed w-9rem">Username</label>
                    <div class="col">
                        <InputText id="username1" v-model="username" :required="true" class="p-invalid mr-2"></InputText>
                        <InlineMessage>Username is required</InlineMessage>
                    </div>
                </div>
                <div class="field grid">
                    <label for="email" class="col-fixed w-9rem">Email</label>
                    <div class="col">
                        <InputText id="email" v-model="email" :required="true" class="p-invalid mr-2"></InputText>
                        <InlineMessage />
                    </div>
                </div>
            </div>
        </div>

        <div class="col-12 lg:col-4">
            <div class="card">
                <h5>Help Text</h5>
                <div class="field p-fluid">
                    <label for="username2">Username</label>
                    <InputText id="username2" type="username" class="p-error" aria-describedby="username-help" />
                    <small id="username-help" class="p-error">Enter your username to reset your password.</small>
                </div>
            </div>
        </div>
    </div>
</template>
