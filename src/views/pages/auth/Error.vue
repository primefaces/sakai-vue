<template>
    <div class="surface-0 flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="grid justify-content-center p-2 lg:p-0" style="min-width: 80%">
            <div class="col-12 mt-5 xl:mt-0 text-center">
                <img src="@/assets/layout/images/logo-error.svg" alt="Sakai logo" class="mb-5" style="width: 81px; height: 60px" />
            </div>
            <div class="col-12 xl:col-6" style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, rgba(233, 30, 99, 0.4) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="h-full w-full m-0 py-7 px-4" style="border-radius: 53px; background: linear-gradient(180deg, var(--surface-50) 38.9%, var(--surface-0))">
                    <div class="grid flex flex-column align-items-center">
                        <div class="flex justify-content-center align-items-center bg-pink-500 border-circle" style="height: 3.2rem; width: 3.2rem">
                            <i class="pi pi-fw pi-exclamation-circle text-2xl text-50"></i>
                        </div>
                        <h1 class="font-bold text-5xl text-900 mb-2">Error Occured</h1>
                        <span class="text-600">Requested resource is not available.</span>
                        <img src="@/assets/layout/images/asset-error.svg" alt="Error" class="mt-5" width="80%" />
                        <div class="col-12 mt-5 text-center">
                            <i class="pi pi-fw pi-arrow-left text-blue-500 mr-2" style="vertical-align: center"></i>
                            <router-link to="/" class="text-blue-500">Go to Dashboard</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
