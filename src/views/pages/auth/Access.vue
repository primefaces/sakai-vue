<script setup>
import AppConfig from '@/layout/AppConfig.vue';
</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <img src="/demo/images/access/logo-orange.svg" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" />
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, rgba(247, 149, 48, 0.4) 10%, rgba(247, 149, 48, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center" style="border-radius: 53px">
                    <div class="grid flex flex-column align-items-center">
                        <div class="flex justify-content-center align-items-center bg-orange-500 border-circle" style="width: 3.2rem; height: 3.2rem">
                            <i class="text-50 pi pi-fw pi-lock text-2xl"></i>
                        </div>
                        <h1 class="text-900 font-bold text-4xl lg:text-5xl mb-2">Access Denied</h1>
                        <span class="text-600 mb-5">You do not have the necessary permisions. Please contact admins.</span>
                        <img src="/demo/images/access/asset-access.svg" alt="Access denied" class="mb-5" width="80%" />
                        <div class="col-12 mt-5 text-center">
                            <i class="pi pi-fw pi-arrow-left text-blue-500 mr-2" style="vertical-align: center"></i>
                            <router-link to="/" class="text-blue-500">Go to Dashboard</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>
