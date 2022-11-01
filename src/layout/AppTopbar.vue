<template>
    <div class="layout-topbar">
        <a class="layout-topbar-logo">
            <img src="assets/layout/images/.svg" alt="logo" />
            <span>SAKAI</span>
        </a>

        <button class="p-link layout-menu-button layout-topbar-button">
            <i class="pi pi-bars"></i>
        </button>

        <button class="p-link layout-topbar-menu-button layout-topbar-button">
            <i class="pi pi-ellipsis-v"></i>
        </button>

        <div class="layout-topbar-menu">
            <button class="p-link layout-topbar-button">
                <i class="pi pi-calendar"></i>
                <span>Calendar</span>
            </button>
            <button class="p-link layout-topbar-button">
                <i class="pi pi-user"></i>
                <span>Profile</span>
            </button>
            <button class="p-link layout-topbar-button">
                <i class="pi pi-cog"></i>
                <span>Settings</span>
            </button>
        </div>
    </div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
