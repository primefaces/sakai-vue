<template>
    <button class="layout-config-button p-link" type="button" @click="onConfigButtonClick()">
        <i class="pi pi-cog"></i>
    </button>

    <Sidebar [(visible)]="visible" position="right" [transitionOptions]="'.3s cubic-bezier(0, 0, 0.2, 1)'" styleClass="layout-config-sidebar w-20rem">
        <h5>Scale</h5>
        <div class="flex align-items-center">
            <button icon="pi pi-minus" type="button" @click="decrementScale()" class="p-button-text p-button-rounded w-2rem h-2rem mr-2" :disabled="scale === scales[0]"></button>
            <div class="flex gap-2 align-items-center">
                <i class="pi pi-circle-fill text-300" v-for="s in scales" :key="s" :class="{ 'text-primary-500': s === scale }"></i>
            </div>
            <button icon="pi pi-plus" type="button" pButton @click="incrementScale()" class="p-button-text p-button-rounded w-2rem h-2rem ml-2" :disabled="scale === scales[scales.length - 1]"></button>
        </div>

        <template v-if="!minimal">
            <h5>Menu Type</h5>
            <div class="field-radiobutton">
                <RadioButton name="menuMode" value="static" [(ngModel)]="menuMode" inputId="mode1"></RadioButton>
                <label for="mode1">Static</label>
            </div>
            <div class="field-radiobutton">
                <RadioButton name="menuMode" value="overlay" [(ngModel)]="menuMode" inputId="mode2"></RadioButton>
                <label for="mode2">Overlay</label>
            </div>
        </template>

        <template v-if="!minimal">
            <h5>Input Style</h5>
            <div class="flex">
                <div class="field-radiobutton flex-1">
                    <RadioButton name="inputStyle" value="outlined" [(ngModel)]="inputStyle" inputId="outlined_input"></RadioButton>
                    <label for="outlined_input">Outlined</label>
                </div>
                <div class="field-radiobutton flex-1">
                    <RadioButton name="inputStyle" value="filled" [(ngModel)]="inputStyle" inputId="filled_input"></RadioButton>
                    <label for="filled_input">Filled</label>
                </div>
            </div>

            <h5>Ripple Effect</h5>
            <InputSwitch [(ngModel)]="ripple"></InputSwitch>
        </template>

        <h5>Bootstrap</h5>
        <div class="grid">
            <div class="col-3">
                <button class="p-link w-2rem h-2rem" @click="changeTheme('bootstrap4-light-blue', 'light')">
                    <img src="assets/layout/images/themes/bootstrap4-light-blue.svg" class="w-2rem h-2rem" alt="Bootstrap Light Blue" />
                </button>
            </div>
            <div class="col-3">
                <button class="p-link w-2rem h-2rem" @click="changeTheme('bootstrap4-light-purple', 'light')">
                    <img src="assets/layout/images/themes/bootstrap4-light-purple.svg" class="w-2rem h-2rem" alt="Bootstrap Light Purple" />
                </button>
            </div>
            <div class="col-3">
                <button class="p-link w-2rem h-2rem" @click="changeTheme('bootstrap4-dark-blue', 'dark')">
                    <img src="assets/layout/images/themes/bootstrap4-dark-blue.svg" class="w-2rem h-2rem" alt="Bootstrap Dark Blue" />
                </button>
            </div>
            <div class="col-3">
                <button class="p-link w-2rem h-2rem" @click="changeTheme('bootstrap4-dark-purple', 'dark')">
                    <img src="assets/layout/images/themes/bootstrap4-dark-purple.svg" class="w-2rem h-2rem" alt="Bootstrap Dark Purple" />
                </button>
            </div>
        </div>

        <h5>Material Design</h5>
        <div class="grid">
            <div class="col-3">
                <button class="p-link w-2rem h-2rem" @click="changeTheme('md-light-indigo', 'light')">
                    <img src="assets/layout/images/themes/md-light-indigo.svg" class="w-2rem h-2rem" alt="Material Light Indigo" />
                </button>
            </div>
            <div class="col-3">
                <button class="p-link w-2rem h-2rem" @click="changeTheme('md-light-deeppurple', 'light')">
                    <img src="assets/layout/images/themes/md-light-deeppurple.svg" class="w-2rem h-2rem" alt="Material Light DeepPurple" />
                </button>
            </div>
            <div class="col-3">
                <button class="p-link w-2rem h-2rem" @click="changeTheme('md-dark-indigo', 'dark')">
                    <img src="assets/layout/images/themes/md-dark-indigo.svg" class="w-2rem h-2rem" alt="Material Dark Indigo" />
                </button>
            </div>
            <div class="col-3">
                <button class="p-link w-2rem h-2rem" @click="changeTheme('md-dark-deeppurple', 'dark')">
                    <img src="assets/layout/images/themes/md-dark-deeppurple.svg" class="w-2rem h-2rem" alt="Material Dark DeepPurple" />
                </button>
            </div>
        </div>

        <h5>Material Design Compact</h5>
        <div class="grid">
            <div class="col-3">
                <button class="p-link w-2rem h-2rem" @click="changeTheme('mdc-light-indigo', 'light')">
                    <img src="assets/layout/images/themes/md-light-indigo.svg" class="w-2rem h-2rem" alt="Material Light Indigo" />
                </button>
            </div>
            <div class="col-3">
                <button class="p-link w-2rem h-2rem" @click="changeTheme('mdc-light-deeppurple', 'light')">
                    <img src="assets/layout/images/themes/md-light-deeppurple.svg" class="w-2rem h-2rem" alt="Material Light Deep Purple" />
                </button>
            </div>
            <div class="col-3">
                <button class="p-link w-2rem h-2rem" @click="changeTheme('mdc-dark-indigo', 'dark')">
                    <img src="assets/layout/images/themes/md-dark-indigo.svg" class="w-2rem h-2rem" alt="Material Dark Indigo" />
                </button>
            </div>
            <div class="col-3">
                <button class="p-link w-2rem h-2rem" @click="changeTheme('mdc-dark-deeppurple', 'dark')">
                    <img src="assets/layout/images/themes/md-dark-deeppurple.svg" class="w-2rem h-2rem" alt="Material Dark Deep Purple" />
                </button>
            </div>
        </div>

        <h5>Tailwind</h5>
        <div class="grid">
            <div class="col-3">
                <button class="p-link w-2rem h-2rem" @click="changeTheme('tailwind-light', 'light')">
                    <img src="assets/layout/images/themes/tailwind-light.png" class="w-2rem h-2rem" alt="Tailwind Light" />
                </button>
            </div>
        </div>

        <h5>Fluent UI</h5>
        <div class="grid">
            <div class="col-3">
                <button class="p-link w-2rem h-2rem" @click="changeTheme('fluent-light', 'light')">
                    <img src="assets/layout/images/themes/fluent-light.png" class="w-2rem h-2rem" alt="Fluent Light" />
                </button>
            </div>
        </div>

        <h5>PrimeOne Design - 2022</h5>
        <div class="grid">
            <div class="col-3">
                <button class="p-link w-2rem h-2rem" @click="changeTheme('lara-light-indigo', 'light')">
                    <img src="assets/layout/images/themes/lara-light-indigo.png" class="w-2rem h-2rem" alt="Lara Light Indigo" />
                </button>
            </div>
            <div class="col-3">
                <button class="p-link w-2rem h-2rem" @click="changeTheme('lara-light-blue', 'light')">
                    <img src="assets/layout/images/themes/lara-light-blue.png" class="w-2rem h-2rem" alt="Lara Light Blue" />
                </button>
            </div>
            <div class="col-3">
                <button class="p-link w-2rem h-2rem" @click="changeTheme('lara-light-purple', 'light')">
                    <img src="assets/layout/images/themes/lara-light-purple.png" class="w-2rem h-2rem" alt="Lara Light Purple" />
                </button>
            </div>
            <div class="col-3">
                <button class="p-link w-2rem h-2rem" @click="changeTheme('lara-light-teal', 'light')">
                    <img src="assets/layout/images/themes/lara-light-teal.png" class="w-2rem h-2rem" alt="Lara Light Teal" />
                </button>
            </div>
            <div class="col-3">
                <button class="p-link w-2rem h-2rem" @click="changeTheme('lara-dark-indigo', 'dark')">
                    <img src="assets/layout/images/themes/lara-dark-indigo.png" class="w-2rem h-2rem" alt="Lara Dark Indigo" />
                </button>
            </div>
            <div class="col-3">
                <button class="p-link w-2rem h-2rem" @click="changeTheme('lara-dark-blue', 'dark')">
                    <img src="assets/layout/images/themes/lara-dark-blue.png" class="w-2rem h-2rem" alt="Lara Dark Blue" />
                </button>
            </div>
            <div class="col-3">
                <button class="p-link w-2rem h-2rem" @click="changeTheme('lara-dark-purple', 'dark')">
                    <img src="assets/layout/images/themes/lara-dark-purple.png" class="w-2rem h-2rem" alt="Lara Dark Purple" />
                </button>
            </div>
            <div class="col-3">
                <button class="p-link w-2rem h-2rem" @click="changeTheme('lara-dark-teal', 'dark')">
                    <img src="assets/layout/images/themes/lara-dark-teal.png" class="w-2rem h-2rem" alt="Lara Dark Teal" />
                </button>
            </div>
        </div>

        <h5>PrimeOne Design - 2021</h5>
        <div class="grid">
            <div class="col-3">
                <button class="p-link w-2rem h-2rem" @click="changeTheme('saga-blue', 'light')">
                    <img src="assets/layout/images/themes/saga-blue.png" class="w-2rem h-2rem" alt="Saga Blue" />
                </button>
            </div>
            <div class="col-3">
                <button class="p-link w-2rem h-2rem" @click="changeTheme('saga-green', 'light')">
                    <img src="assets/layout/images/themes/saga-green.png" class="w-2rem h-2rem" alt="Saga Green" />
                </button>
            </div>
            <div class="col-3">
                <button class="p-link w-2rem h-2rem" @click="changeTheme('saga-orange', 'light')">
                    <img src="assets/layout/images/themes/saga-orange.png" class="w-2rem h-2rem" alt="Saga Orange" />
                </button>
            </div>
            <div class="col-3">
                <button class="p-link w-2rem h-2rem" @click="changeTheme('saga-purple', 'light')">
                    <img src="assets/layout/images/themes/saga-purple.png" class="w-2rem h-2rem" alt="Saga Purple" />
                </button>
            </div>
            <div class="col-3">
                <button class="p-link w-2rem h-2rem" @click="changeTheme('vela-blue', 'dark')">
                    <img src="assets/layout/images/themes/vela-blue.png" class="w-2rem h-2rem" alt="Vela Blue" />
                </button>
            </div>
            <div class="col-3">
                <button class="p-link w-2rem h-2rem" @click="changeTheme('vela-green', 'dark')">
                    <img src="assets/layout/images/themes/vela-green.png" class="w-2rem h-2rem" alt="Vela Green" />
                </button>
            </div>
            <div class="col-3">
                <button class="p-link w-2rem h-2rem" @click="changeTheme('vela-orange', 'dark')">
                    <img src="assets/layout/images/themes/vela-orange.png" class="w-2rem h-2rem" alt="Vela Orange" />
                </button>
            </div>
            <div class="col-3">
                <button class="p-link w-2rem h-2rem" @click="changeTheme('vela-purple', 'dark')">
                    <img src="assets/layout/images/themes/vela-purple.png" class="w-2rem h-2rem" alt="Vela Purple" />
                </button>
            </div>
            <div class="col-3">
                <button class="p-link w-2rem h-2rem" @click="changeTheme('arya-blue', 'dark')">
                    <img src="assets/layout/images/themes/arya-blue.png" class="w-2rem h-2rem" alt="Arya Blue" />
                </button>
            </div>
            <div class="col-3">
                <button class="p-link w-2rem h-2rem" @click="changeTheme('arya-green', 'dark')">
                    <img src="assets/layout/images/themes/arya-green.png" class="w-2rem h-2rem" alt="Arya Green" />
                </button>
            </div>
            <div class="col-3">
                <button class="p-link w-2rem h-2rem" @click="changeTheme('arya-orange', 'dark')">
                    <img src="assets/layout/images/themes/arya-orange.png" class="w-2rem h-2rem" alt="Arya Orange" />
                </button>
            </div>
            <div class="col-3">
                <button class="p-link w-2rem h-2rem" @click="changeTheme('arya-purple', 'dark')">
                    <img src="assets/layout/images/themes/arya-purple.png" class="w-2rem h-2rem" alt="Arya Purple" />
                </button>
            </div>
        </div>
    </Sidebar>
</template>

<script setup>
import { ref } from 'vue';

const scales = ref([12, 13, 14, 15, 16]);
</script>

<style lang="scss" scoped></style>
