<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed } from 'vue';

const { layoutConfig } = useLayout();

const smoothScroll = (id) => {
    document.querySelector(id).scrollIntoView({
        behavior: 'smooth'
    });
};

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});
</script>

<template>
    <div class="bg-surface-0 dark:bg-surface-900 flex justify-center">
        <div id="home" class="landing-wrapper overflow-hidden">
            <div
                class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex items-center justify-between relative lg:static mb-4">
                <a class="flex items-center" href="#"> <img :src="logoUrl" alt="Sakai Logo" height="50"
                        class="mr-0 lg:mr-2" /><span
                        class="text-surface-900 dark:text-surface-0 font-medium text-2xl leading-normal mr-20">SAKAI</span> </a>
                <a class="cursor-pointer block lg:hidden text-surface-700 dark:text-surface-100 p-ripple" v-ripple
                    v-styleclass="{ selector: '@next', enterClass: 'hidden', leaveToClass: 'hidden', hideOnOutsideClick: true }">
                    <i class="pi pi-bars text-4xl"></i>
                </a>
                <div class="items-center bg-surface-0 dark:bg-surface-900 grow justify-between hidden lg:flex absolute lg:static w-full left-0 px-12 lg:px-0 z-20"
                    style="top: 120px">
                    <ul
                        class="list-none p-0 m-0 flex lg:items-center select-none flex-col lg:flex-row cursor-pointer">
                        <li>
                            <a @click="smoothScroll('#hero')"
                                class="flex m-0 md:ml-8 px-0 py-4 text-surface-900 dark:text-surface-0 font-medium leading-normal p-ripple" v-ripple>
                                <span>Home</span>
                            </a>
                        </li>
                        <li>
                            <a @click="smoothScroll('#features')"
                                class="flex m-0 md:ml-8 px-0 py-4 text-surface-900 dark:text-surface-0 font-medium leading-normal p-ripple" v-ripple>
                                <span>Features</span>
                            </a>
                        </li>
                        <li>
                            <a @click="smoothScroll('#highlights')"
                                class="flex m-0 md:ml-8 px-0 py-4 text-surface-900 dark:text-surface-0 font-medium leading-normal p-ripple" v-ripple>
                                <span>Highlights</span>
                            </a>
                        </li>
                        <li>
                            <a @click="smoothScroll('#pricing')"
                                class="flex m-0 md:ml-8 px-0 py-4 text-surface-900 dark:text-surface-0 font-medium leading-normal p-ripple" v-ripple>
                                <span>Pricing</span>
                            </a>
                        </li>
                    </ul>
                    <div
                        class="flex justify-between lg:block border-t lg:border-t-0 border-surface py-4 lg:py-0 mt-4 lg:mt-0">
                        <Button label="Login"
                            class="p-button-text p-button-rounded border-0 font-light leading-tight text-blue-500"></Button>
                        <Button label="Register"
                            class="p-button-rounded border-0 ml-8 font-light text-white leading-tight bg-blue-500"></Button>
                    </div>
                </div>
            </div>

            <div id="hero" class="flex flex-col pt-6 px-6 lg:px-20 overflow-hidden"
                style="background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(238, 239, 175) 0%, rgb(195, 227, 250) 100%); clip-path: ellipse(150% 87% at 93% 13%)">
                <div class="mx-6 md:mx-20 mt-0 md:mt-6">
                    <h1 class="text-6xl font-bold text-gray-900 leading-tight"><span class="font-light block">Eu sem
                            integer</span>eget magna fermentum</h1>
                    <p class="font-normal text-2xl leading-normal md:mt-4 text-gray-700">Sed blandit libero volutpat sed
                        cras. Fames ac turpis egestas integer. Placerat in egestas erat...</p>
                    <Button label="Get Started"
                        class="p-button-rounded text-xl border-0 mt-8 bg-blue-500 font-normal text-white leading-normal px-4"></Button>
                </div>
                <div class="flex justify-center md:justify-end">
                    <img src="/demo/images/landing/screen-1.png" alt="Hero Image" class="w-9/12 md:w-auto" />
                </div>
            </div>

            <div id="features" class="py-6 px-6 lg:px-20 mt-8 mx-0 lg:mx-20">
                <div class="grid grid-cols-12 gap-4 justify-center">
                    <div class="col-span-12 text-center mt-20 mb-6">
                        <h2 class="text-surface-900 dark:text-surface-0 font-normal mb-2">Marvelous Features</h2>
                        <span class="text-surface-600 dark:text-surface-200 text-2xl">Placerat in egestas erat...</span>
                    </div>

                    <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
                        <div
                            style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2))">
                            <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
                                <div class="flex items-center justify-center bg-yellow-200 mb-4"
                                    style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-fw pi-users text-2xl text-yellow-700"></i>
                                </div>
                                <h5 class="mb-2 text-surface-900 dark:text-surface-0">Easy to Use</h5>
                                <span class="text-surface-600 dark:text-surface-200">Posuere morbi leo urna molestie.</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
                        <div
                            style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 226, 237, 0.2), rgba(251, 199, 145, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(172, 180, 223, 0.2))">
                            <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
                                <div class="flex items-center justify-center bg-cyan-200 mb-4"
                                    style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-fw pi-palette text-2xl text-cyan-700"></i>
                                </div>
                                <h5 class="mb-2 text-surface-900 dark:text-surface-0">Fresh Design</h5>
                                <span class="text-surface-600 dark:text-surface-200">Semper risus in hendrerit.</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pb-8 mt-6 lg:mt-0">
                        <div
                            style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 226, 237, 0.2), rgba(172, 180, 223, 0.2)), linear-gradient(180deg, rgba(172, 180, 223, 0.2), rgba(246, 158, 188, 0.2))">
                            <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
                                <div class="flex items-center justify-center bg-indigo-200"
                                    style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-fw pi-map text-2xl text-indigo-700"></i>
                                </div>
                                <h5 class="mb-2 text-surface-900 dark:text-surface-0">Well Documented</h5>
                                <span class="text-surface-600 dark:text-surface-200">Non arcu risus quis varius quam quisque.</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
                        <div
                            style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(187, 199, 205, 0.2), rgba(251, 199, 145, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(145, 210, 204, 0.2))">
                            <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
                                <div class="flex items-center justify-center bg-slate-200 mb-4"
                                    style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-fw pi-id-card text-2xl text-slate-700"></i>
                                </div>
                                <h5 class="mb-2 text-surface-900 dark:text-surface-0">Responsive Layout</h5>
                                <span class="text-surface-600 dark:text-surface-200">Nulla malesuada pellentesque elit.</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
                        <div
                            style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(187, 199, 205, 0.2), rgba(246, 158, 188, 0.2)), linear-gradient(180deg, rgba(145, 226, 237, 0.2), rgba(160, 210, 250, 0.2))">
                            <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
                                <div class="flex items-center justify-center bg-orange-200 mb-4"
                                    style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-fw pi-star text-2xl text-orange-700"></i>
                                </div>
                                <h5 class="mb-2 text-surface-900 dark:text-surface-0">Clean Code</h5>
                                <span class="text-surface-600 dark:text-surface-200">Condimentum lacinia quis vel eros.</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pb-8 mt-6 lg:mt-0">
                        <div
                            style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(251, 199, 145, 0.2), rgba(246, 158, 188, 0.2)), linear-gradient(180deg, rgba(172, 180, 223, 0.2), rgba(212, 162, 221, 0.2))">
                            <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
                                <div class="flex items-center justify-center bg-pink-200 mb-4"
                                    style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-fw pi-moon text-2xl text-pink-700"></i>
                                </div>
                                <h5 class="mb-2 text-surface-900 dark:text-surface-0">Dark Mode</h5>
                                <span class="text-surface-600 dark:text-surface-200">Convallis tellus id interdum velit laoreet.</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 mt-6 lg:mt-0">
                        <div
                            style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 210, 204, 0.2), rgba(160, 210, 250, 0.2)), linear-gradient(180deg, rgba(187, 199, 205, 0.2), rgba(145, 210, 204, 0.2))">
                            <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
                                <div class="flex items-center justify-center bg-teal-200 mb-4"
                                    style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-fw pi-shopping-cart text-2xl text-teal-700"></i>
                                </div>
                                <h5 class="mb-2 text-surface-900 dark:text-surface-0">Ready to Use</h5>
                                <span class="text-surface-600 dark:text-surface-200">Mauris sit amet massa vitae.</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 mt-6 lg:mt-0">
                        <div
                            style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 210, 204, 0.2), rgba(212, 162, 221, 0.2)), linear-gradient(180deg, rgba(251, 199, 145, 0.2), rgba(160, 210, 250, 0.2))">
                            <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
                                <div class="flex items-center justify-center bg-blue-200 mb-4"
                                    style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-fw pi-globe text-2xl text-blue-700"></i>
                                </div>
                                <h5 class="mb-2 text-surface-900 dark:text-surface-0">Modern Practices</h5>
                                <span class="text-surface-600 dark:text-surface-200">Elementum nibh tellus molestie nunc non.</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg-4 mt-6 lg:mt-0">
                        <div
                            style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(160, 210, 250, 0.2), rgba(212, 162, 221, 0.2)), linear-gradient(180deg, rgba(246, 158, 188, 0.2), rgba(212, 162, 221, 0.2))">
                            <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
                                <div class="flex items-center justify-center bg-purple-200 mb-4"
                                    style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-fw pi-eye text-2xl text-purple-700"></i>
                                </div>
                                <h5 class="mb-2 text-surface-900 dark:text-surface-0">Privacy</h5>
                                <span class="text-surface-600 dark:text-surface-200">Neque egestas congue quisque.</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 mt-20 mb-20 p-2 md:p-20"
                        style="border-radius: 20px; background: linear-gradient(0deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #efe1af 0%, #c3dcfa 100%)">
                        <div
                            class="flex flex-col justify-center items-center text-center px-4 py-4 md:py-0">
                            <h3 class="text-gray-900 mb-2">Joséphine Miller</h3>
                            <span class="text-gray-600 text-2xl">Peak Interactive</span>
                            <p class="text-gray-900 sm:line-height-2 md:line-height-4 text-2xl mt-6"
                                style="max-width: 800px">
                                “Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                                nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                                officia deserunt mollit anim id est laborum.”
                            </p>
                            <img src="/demo/images/landing/peak-logo.svg" class="mt-6" alt="Company logo" />
                        </div>
                    </div>
                </div>
            </div>

            <div id="highlights" class="py-6 px-6 lg:px-20 mx-0 my-12 lg:mx-20">
                <div class="text-center">
                    <h2 class="text-surface-900 dark:text-surface-0 font-normal mb-2">Powerful Everywhere</h2>
                    <span class="text-surface-600 dark:text-surface-200 text-2xl">Amet consectetur adipiscing elit...</span>
                </div>

                <div class="grid grid-cols-12 gap-4 mt-20 pb-2 md:pb-20">
                    <div class="flex justify-center col-span-12 lg:col-span-6 bg-purple-100 p-0 order-1 lg:order-none"
                        style="border-radius: 8px">
                        <img src="/demo/images/landing/mockup.svg" class="w-11/12" alt="mockup mobile" />
                    </div>

                    <div class="col-span-12 lg:col-span-6 my-auto flex flex-col lg:items-end text-center lg:text-right">
                        <div class="flex items-center justify-center bg-purple-200 self-center lg:self-end"
                            style="width: 4.2rem; height: 4.2rem; border-radius: 10px">
                            <i class="pi pi-fw pi-mobile text-5xl text-purple-700"></i>
                        </div>
                        <h2 class="leading-none text-surface-900 dark:text-surface-0 text-4xl font-normal">Congue Quisque Egestas</h2>
                        <span class="text-surface-700 dark:text-surface-100 text-2xl leading-normal ml-0 md:ml-2" style="max-width: 650px">Lectus arcu
                            bibendum at varius vel pharetra vel turpis nunc. Eget aliquet nibh praesent tristique magna
                            sit amet purus gravida. Sit amet mattis vulputate enim nulla aliquet.</span>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-4 my-20 pt-2 md:pt-20">
                    <div class="col-span-12 lg:col-span-6 my-auto flex flex-col text-center lg:text-left lg:items-start">
                        <div class="flex items-center justify-center bg-yellow-200 self-center lg:self-start"
                            style="width: 4.2rem; height: 4.2rem; border-radius: 10px">
                            <i class="pi pi-fw pi-desktop text-5xl text-yellow-700"></i>
                        </div>
                        <h2 class="leading-none text-surface-900 dark:text-surface-0 text-4xl font-normal">Celerisque Eu Ultrices</h2>
                        <span class="text-surface-700 dark:text-surface-100 text-2xl leading-normal mr-0 md:mr-2" style="max-width: 650px">Adipiscing
                            commodo elit at imperdiet dui. Viverra nibh cras pulvinar mattis nunc sed blandit libero.
                            Suspendisse in est ante in. Mauris pharetra et ultrices neque ornare aenean euismod
                            elementum nisi.</span>
                    </div>

                    <div class="flex justify-end order-1 sm:order-2 col-span-12 lg:col-span-6 bg-yellow-100 p-0"
                        style="border-radius: 8px">
                        <img src="/demo/images/landing/mockup-desktop.svg" class="w-11/12" alt="mockup" />
                    </div>
                </div>
            </div>

            <div id="pricing" class="py-6 px-6 lg:px-20 my-2 md:my-6">
                <div class="text-center">
                    <h2 class="text-surface-900 dark:text-surface-0 font-normal mb-2">Matchless Pricing</h2>
                    <span class="text-surface-600 dark:text-surface-200 text-2xl">Amet consectetur adipiscing elit...</span>
                </div>

                <div class="grid grid-cols-12 gap-4 justify-between mt-20 md:mt-0">
                    <div class="col-span-12 lg:col-span-4 p-0 md:p-4">
                        <div class="p-4 flex flex-col border-surface-200 dark:border-surface-600 pricing-card cursor-pointer border-2 hover:border-primary duration-300 transition-all"
                            style="border-radius: 10px">
                            <h3 class="text-surface-900 dark:text-surface-0 text-center my-8">Free</h3>
                            <img src="/demo/images/landing/free.svg" class="w-10/12 h-10 mx-auto" alt="free" />
                            <div class="my-8 text-center">
                                <span class="text-5xl font-bold mr-2 text-surface-900 dark:text-surface-0">$0</span>
                                <span class="text-surface-600 dark:text-surface-200">per month</span>
                                <Button label="Get Started"
                                    class="block mx-auto mt-6 p-button-rounded border-0 ml-4 font-light leading-tight bg-blue-500 text-white"></Button>
                            </div>
                            <Divider class="w-full bg-surface-200"></Divider>
                            <ul class="my-8 list-none p-0 flex text-surface-900 dark:text-surface-0 flex-col">
                                <li class="py-2">
                                    <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                    <span class="text-xl leading-normal">Responsive Layout</span>
                                </li>
                                <li class="py-2">
                                    <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                    <span class="text-xl leading-normal">Unlimited Push Messages</span>
                                </li>
                                <li class="py-2">
                                    <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                    <span class="text-xl leading-normal">50 Support Ticket</span>
                                </li>
                                <li class="py-2">
                                    <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                    <span class="text-xl leading-normal">Free Shipping</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="col-span-12 lg:col-span-4 p-0 md:p-4 mt-6 md:mt-0">
                        <div class="p-4 flex flex-col border-surface-200 dark:border-surface-600 pricing-card cursor-pointer border-2 hover:border-primary duration-300 transition-all"
                            style="border-radius: 10px">
                            <h3 class="text-surface-900 dark:text-surface-0 text-center my-8">Startup</h3>
                            <img src="/demo/images/landing/startup.svg" class="w-10/12 h-10 mx-auto" alt="startup" />
                            <div class="my-8 text-center">
                                <span class="text-5xl font-bold mr-2 text-surface-900 dark:text-surface-0">$1</span>
                                <span class="text-surface-600 dark:text-surface-200">per month</span>
                                <Button label="Try Free"
                                    class="block mx-auto mt-6 p-button-rounded border-0 ml-4 font-light leading-tight bg-blue-500 text-white"></Button>
                            </div>
                            <Divider class="w-full bg-surface-200"></Divider>
                            <ul class="my-8 list-none p-0 flex text-surface-900 dark:text-surface-0 flex-col">
                                <li class="py-2">
                                    <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                    <span class="text-xl leading-normal">Responsive Layout</span>
                                </li>
                                <li class="py-2">
                                    <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                    <span class="text-xl leading-normal">Unlimited Push Messages</span>
                                </li>
                                <li class="py-2">
                                    <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                    <span class="text-xl leading-normal">50 Support Ticket</span>
                                </li>
                                <li class="py-2">
                                    <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                    <span class="text-xl leading-normal">Free Shipping</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="col-span-12 lg:col-span-4 p-0 md:p-4 mt-6 md:mt-0">
                        <div class="p-4 flex flex-col border-surface-200 dark:border-surface-600 pricing-card cursor-pointer border-2 hover:border-primary duration-300 transition-all"
                            style="border-radius: 10px">
                            <h3 class="text-surface-900 dark:text-surface-0 text-center my-8">Enterprise</h3>
                            <img src="/demo/images/landing/enterprise.svg" class="w-10/12 h-10 mx-auto" alt="enterprise" />
                            <div class="my-8 text-center">
                                <span class="text-5xl font-bold mr-2 text-surface-900 dark:text-surface-0">$999</span>
                                <span class="text-surface-600 dark:text-surface-200">per month</span>
                                <Button label="Get a Quote"
                                    class="block mx-auto mt-6 p-button-rounded border-0 ml-4 font-light leading-tight bg-blue-500 text-white"></Button>
                            </div>
                            <Divider class="w-full bg-surface-200"></Divider>
                            <ul class="my-8 list-none p-0 flex text-surface-900 dark:text-surface-0 flex-col">
                                <li class="py-2">
                                    <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                    <span class="text-xl leading-normal">Responsive Layout</span>
                                </li>
                                <li class="py-2">
                                    <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                    <span class="text-xl leading-normal">Unlimited Push Messages</span>
                                </li>
                                <li class="py-2">
                                    <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                    <span class="text-xl leading-normal">50 Support Ticket</span>
                                </li>
                                <li class="py-2">
                                    <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                    <span class="text-xl leading-normal">Free Shipping</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div class="py-6 px-6 mx-0 mt-20 lg:mx-20">
                <div class="grid grid-cols-12 gap-4 justify-between">
                    <div class="col-span-12 md:col-span-2" style="margin-top: -1.5rem">
                        <a @click="smoothScroll('#home')"
                            class="flex flex-wrap items-center justify-center md:justify-start md:mb-0 mb-4 cursor-pointer">
                            <img :src="logoUrl" alt="footer sections" width="50" height="50" class="mr-2" />
                            <h4 class="font-medium text-3xl text-surface-900 dark:text-surface-0">SAKAI</h4>
                        </a>
                    </div>

                    <div class="col-span-12 md:col-span-10 lg:col-span-7">
                        <div class="grid grid-cols-12 gap-4 text-center md:text-left">
                            <div class="col-span-12 md:col-span-3">
                                <h4 class="font-medium text-2xl leading-normal mb-4 text-surface-900 dark:text-surface-0">Company</h4>
                                <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100">About Us</a>
                                <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100">News</a>
                                <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100">Investor
                                    Relations</a>
                                <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100">Careers</a>
                                <a class="leading-normal text-xl block cursor-pointer text-surface-700 dark:text-surface-100">Media Kit</a>
                            </div>

                            <div class="col-span-12 md:col-span-3 mt-6 md:mt-0">
                                <h4 class="font-medium text-2xl leading-normal mb-4 text-surface-900 dark:text-surface-0">Resources</h4>
                                <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100">Get Started</a>
                                <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100">Learn</a>
                                <a class="leading-normal text-xl block cursor-pointer text-surface-700 dark:text-surface-100">Case Studies</a>
                            </div>

                            <div class="col-span-12 md:col-span-3 mt-6 md:mt-0">
                                <h4 class="font-medium text-2xl leading-normal mb-4 text-surface-900 dark:text-surface-0">Community</h4>
                                <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100">Discord</a>
                                <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100">Events<img
                                        src="/demo/images/landing/new-badge.svg" class="ml-2" /></a>
                                <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100">FAQ</a>
                                <a class="leading-normal text-xl block cursor-pointer text-surface-700 dark:text-surface-100">Blog</a>
                            </div>

                            <div class="col-span-12 md:col-span-3 mt-6 md:mt-0">
                                <h4 class="font-medium text-2xl leading-normal mb-4 text-surface-900 dark:text-surface-0">Legal</h4>
                                <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100">Brand Policy</a>
                                <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100">Privacy Policy</a>
                                <a class="leading-normal text-xl block cursor-pointer text-surface-700 dark:text-surface-100">Terms of Service</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<!-- <style scoped>
#hero {
    background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #eeefaf 0%, #c3e3fa 100%);
    height: 700px;
    overflow: hidden;
}

@media screen and (min-width: 768px) {
    #hero {
        -webkit-clip-path: ellipse(150% 87% at 93% 13%);
        clip-path: ellipse(150% 87% at 93% 13%);
        height: 530px;
    }
}

@media screen and (min-width: 1300px) {
    #hero > img {
        position: absolute;
    }

    #hero > div > p {
        max-width: 450px;
    }
}

@media screen and (max-width: 1300px) {
    #hero {
        height: 600px;
    }

    #hero > img {
        position: static;
        transform: scale(1);
        margin-left: auto;
    }

    #hero > div {
        width: 100%;
    }

    #hero > div > p {
        width: 100%;
        max-width: 100%;
    }
}
</style> -->
