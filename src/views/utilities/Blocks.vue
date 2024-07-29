<script setup>
import { ref } from 'vue';
const block1 = ref(` <div class="grid grid-cols-12 gap-4 grid-nogutter bg-surface-0 dark:bg-surface-950 text-surface-800 dark:text-surface-50">
    <div class="col-span-12 md:col-span-6 p-12 text-center md:text-left flex items-center ">
        <section>
            <span class="block text-6xl font-bold mb-1">Create the screens your</span>
            <div class="text-6xl text-primary font-bold mb-4">your visitors deserve to see</div>
            <p class="mt-0 mb-6 text-surface-700 dark:text-surface-100 leading-normal">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

            <Button label="Learn More" type="button" class="mr-4 p-button-raised"></Button>
            <Button label="Live Demo" type="button" class="p-button-outlined"></Button>
        </section>
    </div>
    <div class="col-span-12 md:col-span-6 overflow-hidden">
        <img src="/demo/images/blocks/hero/hero-1.png" alt="Image" class="md:ml-auto block md:h-full" style="clip-path: polygon(8% 0, 100% 0%, 100% 100%, 0 100%)">
    </div>
 </div>`);

const block2 = ref(` <div class="bg-surface-0 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20 text-center">
    <div class="mb-4 font-bold text-2xl">
        <span class="text-surface-900 dark:text-surface-0">One Product, </span>
        <span class="text-blue-600">Many Solutions</span>
    </div>
    <div class="text-surface-700 dark:text-surface-100 text-sm mb-12">Ac turpis egestas maecenas pharetra convallis posuere morbi leo urna.</div>
    <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12 md:col-span-4 mb-6 px-8">
            <span class="p-4 shadow mb-4 inline-block bg-surface-0 dark:bg-surface-900" style="border-radius: 10px">
                <i class="pi pi-desktop text-4xl text-blue-500"></i>
            </span>
            <div class="text-surface-900 dark:text-surface-0 mb-4 font-medium">Built for Developers</div>
            <span class="text-surface-700 dark:text-surface-100 text-sm leading-normal">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</span>
        </div>
        <div class="col-span-12 md:col-span-4 mb-6 px-8">
            <span class="p-4 shadow mb-4 inline-block bg-surface-0 dark:bg-surface-900" style="border-radius: 10px">
                <i class="pi pi-lock text-4xl text-blue-500"></i>
            </span>
            <div class="text-surface-900 dark:text-surface-0 mb-4 font-medium">End-to-End Encryption</div>
            <span class="text-surface-700 dark:text-surface-100 text-sm leading-normal">Risus nec feugiat in fermentum posuere urna nec. Posuere sollicitudin aliquam ultrices sagittis.</span>
        </div>
        <div class="col-span-12 md:col-span-4 mb-6 px-8">
            <span class="p-4 shadow mb-4 inline-block bg-surface-0 dark:bg-surface-900" style="border-radius: 10px">
                <i class="pi pi-check-circle text-4xl text-blue-500"></i>
            </span>
            <div class="text-surface-900 dark:text-surface-0 mb-4 font-medium">Easy to Use</div>
            <span class="text-surface-700 dark:text-surface-100 text-sm leading-normal">Ornare suspendisse sed nisi lacus sed viverra tellus. Neque volutpat ac tincidunt vitae semper.</span>
        </div>
        <div class="col-span-12 md:col-span-4 mb-6 px-8">
            <span class="p-4 shadow mb-4 inline-block bg-surface-0 dark:bg-surface-900" style="border-radius: 10px">
                <i class="pi pi-globe text-4xl text-blue-500"></i>
            </span>
            <div class="text-surface-900 dark:text-surface-0 mb-4 font-medium">Fast & Global Support</div>
            <span class="text-surface-700 dark:text-surface-100 text-sm leading-normal">Fermentum et sollicitudin ac orci phasellus egestas tellus rutrum tellus.</span>
        </div>
        <div class="col-span-12 md:col-span-4 mb-6 px-8">
            <span class="p-4 shadow mb-4 inline-block bg-surface-0 dark:bg-surface-900" style="border-radius: 10px">
                <i class="pi pi-github text-4xl text-blue-500"></i>
            </span>
            <div class="text-surface-900 dark:text-surface-0 mb-4 font-medium">Open Source</div>
            <span class="text-surface-700 dark:text-surface-100 text-sm leading-normal">Nec tincidunt praesent semper feugiat. Sed adipiscing diam donec adipiscing tristique risus nec feugiat. </span>
        </div>
        <div class="col-span-12 md:col-span-4 md:mb-6 mb-0 px-4">
            <span class="p-4 shadow mb-4 inline-block bg-surface-0 dark:bg-surface-900" style="border-radius: 10px">
                <i class="pi pi-shield text-4xl text-blue-500"></i>
            </span>
            <div class="text-surface-900 dark:text-surface-0 mb-4 font-medium">Trusted Securitty</div>
            <span class="text-surface-700 dark:text-surface-100 text-sm leading-normal">Mattis rhoncus urna neque viverra justo nec ultrices. Id cursus metus aliquam eleifend.</span>
        </div>
    </div>
 </div>`);

const block3 = ref(` <div class="bg-surface-50 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20">
    <div class="text-surface-900 dark:text-surface-0 font-bold text-6xl mb-6 text-center">Pricing Plans</div>
    <div class="text-surface-700 dark:text-surface-100 text-xl mb-12 text-center leading-normal">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit numquam eligendi quos.</div>

    <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12 lg:col-span-4">
            <div class="p-4 h-full">
                <div class="shadow p-4 h-full flex flex-col bg-surface-0 dark:bg-surface-900" style="border-radius: 6px">
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Basic</div>
                    <div class="text-surface-600 dark:text-surface-200">Plan description</div>
                    <hr class="my-4 mx-0 border-t border-0 border-surface" />
                    <div class="flex items-center">
                        <span class="font-bold text-2xl text-surface-900 dark:text-surface-0">$9</span>
                        <span class="ml-2 font-medium text-surface-600 dark:text-surface-200">per month</span>
                    </div>
                    <hr class="my-4 mx-0 border-t border-0 border-surface" />
                    <ul class="list-none p-0 m-0 grow">
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span>Arcu vitae elementum</span>
                        </li>
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span>Dui faucibus in ornare</span>
                        </li>
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span>Morbi tincidunt augue</span>
                        </li>
                    </ul>
                    <hr class="mb-4 mx-0 border-t border-0 border-surface mt-auto" />
                    <Button label="Buy Now" class="p-4 w-full mt-auto"></Button>
                </div>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-4">
            <div class="p-4 h-full">
                <div class="shadow p-4 h-full flex flex-col bg-surface-0 dark:bg-surface-900" style="border-radius: 6px">
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Premium</div>
                    <div class="text-surface-600 dark:text-surface-200">Plan description</div>
                    <hr class="my-4 mx-0 border-t border-0 border-surface" />
                    <div class="flex items-center">
                        <span class="font-bold text-2xl text-surface-900 dark:text-surface-0">$29</span>
                        <span class="ml-2 font-medium text-surface-600 dark:text-surface-200">per month</span>
                    </div>
                    <hr class="my-4 mx-0 border-t border-0 border-surface" />
                    <ul class="list-none p-0 m-0 grow">
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span>Arcu vitae elementum</span>
                        </li>
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span>Dui faucibus in ornare</span>
                        </li>
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span>Morbi tincidunt augue</span>
                        </li>
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span>Duis ultricies lacus sed</span>
                        </li>
                    </ul>
                    <hr class="mb-4 mx-0 border-t border-0 border-surface" />
                    <Button label="Buy Now" class="p-4 w-full"></Button>
                </div>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-4">
            <div class="p-4 h-full">
                <div class="shadow p-4 flex flex-col bg-surface-0 dark:bg-surface-900" style="border-radius: 6px">
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Enterprise</div>
                    <div class="text-surface-600 dark:text-surface-200">Plan description</div>
                    <hr class="my-4 mx-0 border-t border-0 border-surface" />
                    <div class="flex items-center">
                        <span class="font-bold text-2xl text-surface-900 dark:text-surface-0">$49</span>
                        <span class="ml-2 font-medium text-surface-600 dark:text-surface-200">per month</span>
                    </div>
                    <hr class="my-4 mx-0 border-t border-0 border-surface" />
                    <ul class="list-none p-0 m-0 grow">
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span>Arcu vitae elementum</span>
                        </li>
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span>Dui faucibus in ornare</span>
                        </li>
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span>Morbi tincidunt augue</span>
                        </li>
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span>Duis ultricies lacus sed</span>
                        </li>
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span>Imperdiet proin</span>
                        </li>
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span>Nisi scelerisque</span>
                        </li>
                    </ul>
                    <hr class="mb-4 mx-0 border-t border-0 border-surface" />
                    <Button label="Buy Now" class="p-4 w-full p-button-outlined"></Button>
                </div>
            </div>
        </div>
    </div>
 </div>`);

const block4 = ref(` <div class="bg-surface-0 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20">
    <div class="text-surface-700 dark:text-surface-100 text-center">
        <div class="text-blue-600 font-bold mb-4"><i class="pi pi-discord"></i>&nbsp;POWERED BY DISCORD</div>
        <div class="text-surface-900 dark:text-surface-0 font-bold text-5xl mb-4">Join Our Design Community</div>
        <div class="text-surface-700 dark:text-surface-100 text-2xl mb-8">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit numquam eligendi quos.</div>
        <Button label="Join Now" icon="pi pi-discord" class="font-bold px-8 py-4 p-button-raised p-button-rounded whitespace-nowrap"></Button>
    </div>
 </div>`);

const block5 = ref(` <div class="bg-slate-900 text-gray-100 p-4 flex justify-between lg:justify-center items-center flex-wrap">
    <div class="font-bold mr-20">🔥 Hot Deals!</div>
    <div class="items-center hidden lg:flex">
        <span class="leading-normal">Libero voluptatum atque exercitationem praesentium provident odit.</span>
    </div>
    <a class="flex items-center ml-2 mr-20">
        <a class="text-white" href="#"><span class="underline font-bold">Learn More</span></a>
    </a>
    <a v-ripple class="flex items-center no-underline justify-center rounded-full text-gray-50 hover:bg-slate-700 cursor-pointer transition-colors duration-150 p-ripple" style="width:2rem; height: 2rem">
        <i class="pi pi-times"></i>
    </a>
 </div>`);

const block6 = ref(` <div class="bg-surface-0 dark:bg-surface-950 px-6 py-8 md:px-12 lg:px-20">
    <ul class="list-none p-0 m-0 flex items-center font-medium mb-4">
        <li>
            <a class="text-surface-500 dark:text-surface-300 no-underline leading-normal cursor-pointer">Application</a>
        </li>
        <li class="px-2">
            <i class="pi pi-angle-right text-surface-500 dark:text-surface-300 leading-normal"></i>
        </li>
        <li>
            <span class="text-surface-900 dark:text-surface-0 leading-normal">Analytics</span>
        </li>
    </ul>
    <div class="flex items-start flex-col lg:justify-between lg:flex-row">
        <div>
            <div class="font-medium text-3xl text-surface-900 dark:text-surface-0">Customers</div>
            <div class="flex items-center text-surface-700 dark:text-surface-100 flex-wrap">
                <div class="mr-8 flex items-center mt-4">
                    <i class="pi pi-users mr-2"></i>
                    <span>332 Active Users</span>
                </div>
                <div class="mr-8 flex items-center mt-4">
                    <i class="pi pi-globe mr-2"></i>
                    <span>9402 Sessions</span>
                </div>
                <div class="flex items-center mt-4">
                    <i class="pi pi-clock mr-2"></i>
                    <span>2.32m Avg. Duration</span>
                </div>
            </div>
        </div>
        <div class="mt-4 lg:mt-0">
            <Button label="Add" class="p-button-outlined mr-2" icon="pi pi-user-plus"></Button>
            <Button label="Save" icon="pi pi-check"></Button>
        </div>
    </div>
 </div>`);

const block7 = ref(` <div class="bg-surface-50 dark:bg-surface-950 px-6 py-8 md:px-12 lg:px-20">
    <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12 md:col-span-6 lg:col-span-3">
            <div class="bg-surface-0 dark:bg-surface-900 shadow p-4 rounded-border">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-surface-500 dark:text-surface-300 font-medium mb-4">Orders</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">152</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 rounded-border" style="width:2.5rem;height:2.5rem">
                        <i class="pi pi-shopping-cart text-blue-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">24 new </span>
                <span class="text-surface-500 dark:text-surface-300">since last visit</span>
            </div>
        </div>
        <div class="col-span-12 md:col-span-6 lg:col-span-3">
            <div class="bg-surface-0 dark:bg-surface-900 shadow p-4 rounded-border">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-surface-500 dark:text-surface-300 font-medium mb-4">Revenue</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">$2.100</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 rounded-border" style="width:2.5rem;height:2.5rem">
                        <i class="pi pi-map-marker text-orange-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">%52+ </span>
                <span class="text-surface-500 dark:text-surface-300">since last week</span>
            </div>
        </div>
        <div class="col-span-12 md:col-span-6 lg:col-span-3">
            <div class="bg-surface-0 dark:bg-surface-900 shadow p-4 rounded-border">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-surface-500 dark:text-surface-300 font-medium mb-4">Customers</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">28441</div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 rounded-border" style="width:2.5rem;height:2.5rem">
                        <i class="pi pi-inbox text-cyan-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">520  </span>
                <span class="text-surface-500 dark:text-surface-300">newly registered</span>
            </div>
        </div>
        <div class="col-span-12 md:col-span-6 lg:col-span-3">
            <div class="bg-surface-0 dark:bg-surface-900 shadow p-4 rounded-border">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-surface-500 dark:text-surface-300 font-medium mb-4">Comments</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">152 Unread</div>
                    </div>
                    <div class="flex items-center justify-center bg-purple-100 rounded-border" style="width:2.5rem;height:2.5rem">
                        <i class="pi pi-comment text-purple-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">85 </span>
                <span class="text-surface-500 dark:text-surface-300">responded</span>
            </div>
        </div>
    </div>
 </div>`);

const block8 = ref(` <div class="bg-surface-0 dark:bg-surface-900 p-6 shadow rounded-border w-full lg:w-6/12">
    <div class="text-center mb-8">
        <img src="/demo/images/blocks/logos/hyper.svg" alt="Image" height="50" class="mb-4">
        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Welcome Back</div>
        <span class="text-surface-600 dark:text-surface-200 font-medium leading-normal">Don't have an account?</span>
        <a class="font-medium no-underline ml-2 text-blue-500 cursor-pointer">Create today!</a>
    </div>

    <div>
        <label for="email1" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">Email</label>
        <InputText id="email1" type="text" class="w-full mb-4" />

        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">Password</label>
        <InputText id="password1" type="password" class="w-full mb-4" />

        <div class="flex items-center justify-between mb-12">
            <div class="flex items-center">
                <Checkbox id="rememberme1" :binary="true" v-model="checked" class="mr-2"></Checkbox>
                <label for="rememberme1">Remember me</label>
            </div>
            <a class="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Forgot password?</a>
        </div>

        <Button label="Sign In" icon="pi pi-user" class="w-full"></Button>
    </div>
 </div>`);

const block9 = ref(` <div class="bg-surface-0 dark:bg-surface-950">
    <div class="font-medium text-3xl text-surface-900 dark:text-surface-0 mb-4">Movie Information</div>
    <div class="text-surface-500 dark:text-surface-300 mb-8">Morbi tristique blandit turpis. In viverra ligula id nulla hendrerit rutrum.</div>
    <ul class="list-none p-0 m-0">
        <li class="flex items-center py-4 px-2 border-t border-surface flex-wrap">
            <div class="text-surface-500 dark:text-surface-300 w-6/12 md:w-2/12 font-medium">Title</div>
            <div class="text-surface-900 dark:text-surface-0 w-full md:w-8/12 md:order-none order-1">Heat</div>
            <div class="w-6/12 md:w-2/12 flex justify-end">
                <Button label="Edit" icon="pi pi-pencil" class="p-button-text"></Button>
            </div>
        </li>
        <li class="flex items-center py-4 px-2 border-t border-surface flex-wrap">
            <div class="text-surface-500 dark:text-surface-300 w-6/12 md:w-2/12 font-medium">Genre</div>
            <div class="text-surface-900 dark:text-surface-0 w-full md:w-8/12 md:order-none order-1">
                <Chip label="Crime" class="mr-2"></Chip>
                <Chip label="Drama" class="mr-2"></Chip>
                <Chip label="Thriller"></Chip>
            </div>
            <div class="w-6/12 md:w-2/12 flex justify-end">
                <Button label="Edit" icon="pi pi-pencil" class="p-button-text"></Button>
            </div>
        </li>
        <li class="flex items-center py-4 px-2 border-t border-surface flex-wrap">
            <div class="text-surface-500 dark:text-surface-300 w-6/12 md:w-2/12 font-medium">Director</div>
            <div class="text-surface-900 dark:text-surface-0 w-full md:w-8/12 md:order-none order-1">Michael Mann</div>
            <div class="w-6/12 md:w-2/12 flex justify-end">
                <Button label="Edit" icon="pi pi-pencil" class="p-button-text"></Button>
            </div>
        </li>
        <li class="flex items-center py-4 px-2 border-t border-surface flex-wrap">
            <div class="text-surface-500 dark:text-surface-300 w-6/12 md:w-2/12 font-medium">Actors</div>
            <div class="text-surface-900 dark:text-surface-0 w-full md:w-8/12 md:order-none order-1">Robert De Niro, Al Pacino</div>
            <div class="w-6/12 md:w-2/12 flex justify-end">
                <Button label="Edit" icon="pi pi-pencil" class="p-button-text"></Button>
            </div>
        </li>
        <li class="flex items-center py-4 px-2 border-t border-b border-surface flex-wrap">
            <div class="text-surface-500 dark:text-surface-300 w-6/12 md:w-2/12 font-medium">Plot</div>
            <div class="text-surface-900 dark:text-surface-0 w-full md:w-8/12 md:order-none order-1 leading-normal">
                A group of professional bank robbers start to feel the heat from police
                when they unknowingly leave a clue at their latest heist.</div>
            <div class="w-6/12 md:w-2/12 flex justify-end">
                <Button label="Edit" icon="pi pi-pencil" class="p-button-text"></Button>
            </div>
        </li>
    </ul>
 </div>`);

const block10 = ref(` <div class="bg-surface-0 dark:bg-surface-900 p-6 shadow rounded-border">
    <div class="text-3xl font-medium text-surface-900 dark:text-surface-0 mb-4">Card Title</div>
    <div class="font-medium text-surface-500 dark:text-surface-300 mb-4">Vivamus id nisl interdum, blandit augue sit amet, eleifend mi.</div>
    <div style="height: 150px" class="border-2 border-dashed border-surface"></div>
 </div>`);

const checked = ref(false);
</script>

<template>
    <div>
        <BlockViewer header="Hero" :code="block1" free>
            <div class="grid grid-cols-12 gap-4 grid-nogutter bg-surface-0 dark:bg-surface-950 text-surface-800 dark:text-surface-50">
                <div class="col-span-12 md:col-span-6 p-12 text-center md:text-left flex items-center">
                    <section>
                        <span class="block text-6xl font-bold mb-1">Create the screens your</span>
                        <div class="text-6xl text-primary font-bold mb-4">your visitors deserve to see</div>
                        <p class="mt-0 mb-6 text-surface-700 dark:text-surface-100 leading-normal">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

                        <Button label="Learn More" type="button" class="mr-4 p-button-raised"></Button>
                        <Button label="Live Demo" type="button" class="p-button-outlined"></Button>
                    </section>
                </div>
                <div class="col-span-12 md:col-span-6 overflow-hidden">
                    <img src="/demo/images/blocks/hero/hero-1.png" alt="Image" class="md:ml-auto block md:h-full" style="clip-path: polygon(8% 0, 100% 0%, 100% 100%, 0 100%)" />
                </div>
            </div>
        </BlockViewer>

        <BlockViewer header="Feature" :code="block2" free>
            <div class="bg-surface-0 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20 text-center">
                <div class="mb-4 font-bold text-2xl">
                    <span class="text-surface-900 dark:text-surface-0">One Product, </span>
                    <span class="text-blue-600">Many Solutions</span>
                </div>
                <div class="text-surface-700 dark:text-surface-100 text-sm mb-12">Ac turpis egestas maecenas pharetra convallis posuere morbi leo urna.</div>
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-12 md:col-span-4 mb-6 px-8">
                        <span class="p-4 shadow mb-4 inline-block bg-surface-0 dark:bg-surface-900" style="border-radius: 10px">
                            <i class="pi pi-desktop text-4xl text-blue-500"></i>
                        </span>
                        <div class="text-surface-900 dark:text-surface-0 mb-4 font-medium">Built for Developers</div>
                        <span class="text-surface-700 dark:text-surface-100 text-sm leading-normal">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</span>
                    </div>
                    <div class="col-span-12 md:col-span-4 mb-6 px-8">
                        <span class="p-4 shadow mb-4 inline-block bg-surface-0 dark:bg-surface-900" style="border-radius: 10px">
                            <i class="pi pi-lock text-4xl text-blue-500"></i>
                        </span>
                        <div class="text-surface-900 dark:text-surface-0 mb-4 font-medium">End-to-End Encryption</div>
                        <span class="text-surface-700 dark:text-surface-100 text-sm leading-normal">Risus nec feugiat in fermentum posuere urna nec. Posuere sollicitudin aliquam ultrices sagittis.</span>
                    </div>
                    <div class="col-span-12 md:col-span-4 mb-6 px-8">
                        <span class="p-4 shadow mb-4 inline-block bg-surface-0 dark:bg-surface-900" style="border-radius: 10px">
                            <i class="pi pi-check-circle text-4xl text-blue-500"></i>
                        </span>
                        <div class="text-surface-900 dark:text-surface-0 mb-4 font-medium">Easy to Use</div>
                        <span class="text-surface-700 dark:text-surface-100 text-sm leading-normal">Ornare suspendisse sed nisi lacus sed viverra tellus. Neque volutpat ac tincidunt vitae semper.</span>
                    </div>
                    <div class="col-span-12 md:col-span-4 mb-6 px-8">
                        <span class="p-4 shadow mb-4 inline-block bg-surface-0 dark:bg-surface-900" style="border-radius: 10px">
                            <i class="pi pi-globe text-4xl text-blue-500"></i>
                        </span>
                        <div class="text-surface-900 dark:text-surface-0 mb-4 font-medium">Fast & Global Support</div>
                        <span class="text-surface-700 dark:text-surface-100 text-sm leading-normal">Fermentum et sollicitudin ac orci phasellus egestas tellus rutrum tellus.</span>
                    </div>
                    <div class="col-span-12 md:col-span-4 mb-6 px-8">
                        <span class="p-4 shadow mb-4 inline-block bg-surface-0 dark:bg-surface-900" style="border-radius: 10px">
                            <i class="pi pi-github text-4xl text-blue-500"></i>
                        </span>
                        <div class="text-surface-900 dark:text-surface-0 mb-4 font-medium">Open Source</div>
                        <span class="text-surface-700 dark:text-surface-100 text-sm leading-normal">Nec tincidunt praesent semper feugiat. Sed adipiscing diam donec adipiscing tristique risus nec feugiat. </span>
                    </div>
                    <div class="col-span-12 md:col-span-4 md:mb-6 mb-0 px-4">
                        <span class="p-4 shadow mb-4 inline-block bg-surface-0 dark:bg-surface-900" style="border-radius: 10px">
                            <i class="pi pi-shield text-4xl text-blue-500"></i>
                        </span>
                        <div class="text-surface-900 dark:text-surface-0 mb-4 font-medium">Trusted Securitty</div>
                        <span class="text-surface-700 dark:text-surface-100 text-sm leading-normal">Mattis rhoncus urna neque viverra justo nec ultrices. Id cursus metus aliquam eleifend.</span>
                    </div>
                </div>
            </div>
        </BlockViewer>

        <BlockViewer header="Pricing" :code="block3" free>
            <div class="bg-surface-50 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20">
                <div class="text-surface-900 dark:text-surface-0 font-bold text-6xl mb-6 text-center">Pricing Plans</div>
                <div class="text-surface-700 dark:text-surface-100 text-xl mb-12 text-center leading-normal">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit numquam eligendi quos.</div>

                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-12 lg:col-span-4">
                        <div class="p-4 h-full">
                            <div class="shadow p-4 h-full flex flex-col bg-surface-0 dark:bg-surface-900" style="border-radius: 6px">
                                <div class="text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Basic</div>
                                <div class="text-surface-600 dark:text-surface-200">Plan description</div>
                                <hr class="my-4 mx-0 border-t border-0 border-surface" />
                                <div class="flex items-center">
                                    <span class="font-bold text-2xl text-surface-900 dark:text-surface-0">$9</span>
                                    <span class="ml-2 font-medium text-surface-600 dark:text-surface-200">per month</span>
                                </div>
                                <hr class="my-4 mx-0 border-t border-0 border-surface" />
                                <ul class="list-none p-0 m-0 grow">
                                    <li class="flex items-center mb-4">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span>Arcu vitae elementum</span>
                                    </li>
                                    <li class="flex items-center mb-4">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span>Dui faucibus in ornare</span>
                                    </li>
                                    <li class="flex items-center mb-4">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span>Morbi tincidunt augue</span>
                                    </li>
                                </ul>
                                <hr class="mb-4 mx-0 border-t border-0 border-surface mt-auto" />
                                <Button label="Buy Now" class="p-4 w-full mt-auto"></Button>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 lg:col-span-4">
                        <div class="p-4 h-full">
                            <div class="shadow p-4 h-full flex flex-col bg-surface-0 dark:bg-surface-900" style="border-radius: 6px">
                                <div class="text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Premium</div>
                                <div class="text-surface-600 dark:text-surface-200">Plan description</div>
                                <hr class="my-4 mx-0 border-t border-0 border-surface" />
                                <div class="flex items-center">
                                    <span class="font-bold text-2xl text-surface-900 dark:text-surface-0">$29</span>
                                    <span class="ml-2 font-medium text-surface-600 dark:text-surface-200">per month</span>
                                </div>
                                <hr class="my-4 mx-0 border-t border-0 border-surface" />
                                <ul class="list-none p-0 m-0 grow">
                                    <li class="flex items-center mb-4">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span>Arcu vitae elementum</span>
                                    </li>
                                    <li class="flex items-center mb-4">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span>Dui faucibus in ornare</span>
                                    </li>
                                    <li class="flex items-center mb-4">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span>Morbi tincidunt augue</span>
                                    </li>
                                    <li class="flex items-center mb-4">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span>Duis ultricies lacus sed</span>
                                    </li>
                                </ul>
                                <hr class="mb-4 mx-0 border-t border-0 border-surface" />
                                <Button label="Buy Now" class="p-4 w-full"></Button>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 lg:col-span-4">
                        <div class="p-4 h-full">
                            <div class="shadow p-4 flex flex-col bg-surface-0 dark:bg-surface-900" style="border-radius: 6px">
                                <div class="text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Enterprise</div>
                                <div class="text-surface-600 dark:text-surface-200">Plan description</div>
                                <hr class="my-4 mx-0 border-t border-0 border-surface" />
                                <div class="flex items-center">
                                    <span class="font-bold text-2xl text-surface-900 dark:text-surface-0">$49</span>
                                    <span class="ml-2 font-medium text-surface-600 dark:text-surface-200">per month</span>
                                </div>
                                <hr class="my-4 mx-0 border-t border-0 border-surface" />
                                <ul class="list-none p-0 m-0 grow">
                                    <li class="flex items-center mb-4">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span>Arcu vitae elementum</span>
                                    </li>
                                    <li class="flex items-center mb-4">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span>Dui faucibus in ornare</span>
                                    </li>
                                    <li class="flex items-center mb-4">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span>Morbi tincidunt augue</span>
                                    </li>
                                    <li class="flex items-center mb-4">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span>Duis ultricies lacus sed</span>
                                    </li>
                                    <li class="flex items-center mb-4">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span>Imperdiet proin</span>
                                    </li>
                                    <li class="flex items-center mb-4">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span>Nisi scelerisque</span>
                                    </li>
                                </ul>
                                <hr class="mb-4 mx-0 border-t border-0 border-surface" />
                                <Button label="Buy Now" class="p-4 w-full p-button-outlined"></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BlockViewer>

        <BlockViewer header="Call to Action" :code="block4" free>
            <div class="bg-surface-0 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20">
                <div class="text-surface-700 dark:text-surface-100 text-center">
                    <div class="text-blue-600 font-bold mb-4"><i class="pi pi-discord"></i>&nbsp;POWERED BY DISCORD</div>
                    <div class="text-surface-900 dark:text-surface-0 font-bold text-5xl mb-4">Join Our Design Community</div>
                    <div class="text-surface-700 dark:text-surface-100 text-2xl mb-8">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit numquam eligendi quos.</div>
                    <Button label="Join Now" icon="pi pi-discord" class="font-bold px-8 py-4 p-button-raised p-button-rounded whitespace-nowrap"></Button>
                </div>
            </div>
        </BlockViewer>

        <BlockViewer header="Banner" :code="block5" containerClass="bg-surface-0 dark:bg-surface-950 py-20" free>
            <div class="bg-slate-900 text-gray-100 p-4 flex justify-between lg:justify-center items-center flex-wrap">
                <div class="font-bold mr-20">🔥 Hot Deals!</div>
                <div class="items-center hidden lg:flex">
                    <span class="leading-normal">Libero voluptatum atque exercitationem praesentium provident odit.</span>
                </div>
                <a class="flex items-center ml-2 mr-20">
                    <a class="text-white" href="#"><span class="underline font-bold">Learn More</span></a>
                </a>
                <a v-ripple class="flex items-center no-underline justify-center rounded-full text-gray-50 hover:bg-slate-700 cursor-pointer transition-colors duration-150 p-ripple" style="width: 2rem; height: 2rem">
                    <i class="pi pi-times"></i>
                </a>
            </div>
        </BlockViewer>

        <BlockViewer header="Page Heading" :code="block6" free>
            <div class="bg-surface-0 dark:bg-surface-950 px-6 py-8 md:px-12 lg:px-20">
                <ul class="list-none p-0 m-0 flex items-center font-medium mb-4">
                    <li>
                        <a class="text-surface-500 dark:text-surface-300 no-underline leading-normal cursor-pointer">Application</a>
                    </li>
                    <li class="px-2">
                        <i class="pi pi-angle-right text-surface-500 dark:text-surface-300 leading-normal"></i>
                    </li>
                    <li>
                        <span class="text-surface-900 dark:text-surface-0 leading-normal">Analytics</span>
                    </li>
                </ul>
                <div class="flex items-start flex-col lg:justify-between lg:flex-row">
                    <div>
                        <div class="font-medium text-3xl text-surface-900 dark:text-surface-0">Customers</div>
                        <div class="flex items-center text-surface-700 dark:text-surface-100 flex-wrap">
                            <div class="mr-8 flex items-center mt-4">
                                <i class="pi pi-users mr-2"></i>
                                <span>332 Active Users</span>
                            </div>
                            <div class="mr-8 flex items-center mt-4">
                                <i class="pi pi-globe mr-2"></i>
                                <span>9402 Sessions</span>
                            </div>
                            <div class="flex items-center mt-4">
                                <i class="pi pi-clock mr-2"></i>
                                <span>2.32m Avg. Duration</span>
                            </div>
                        </div>
                    </div>
                    <div class="mt-4 lg:mt-0">
                        <Button label="Add" class="p-button-outlined mr-2" icon="pi pi-user-plus"></Button>
                        <Button label="Save" icon="pi pi-check"></Button>
                    </div>
                </div>
            </div>
        </BlockViewer>

        <BlockViewer header="Stats" :code="block7" free>
            <div class="bg-surface-50 dark:bg-surface-950 px-6 py-8 md:px-12 lg:px-20">
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-12 md:col-span-6 lg:col-span-3">
                        <div class="bg-surface-0 dark:bg-surface-900 shadow p-4 rounded-border">
                            <div class="flex justify-between mb-4">
                                <div>
                                    <span class="block text-surface-500 dark:text-surface-300 font-medium mb-4">Orders</span>
                                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">152</div>
                                </div>
                                <div class="flex items-center justify-center bg-blue-100 rounded-border" style="width: 2.5rem; height: 2.5rem">
                                    <i class="pi pi-shopping-cart text-blue-500 text-xl"></i>
                                </div>
                            </div>
                            <span class="text-green-500 font-medium">24 new </span>
                            <span class="text-surface-500 dark:text-surface-300">since last visit</span>
                        </div>
                    </div>
                    <div class="col-span-12 md:col-span-6 lg:col-span-3">
                        <div class="bg-surface-0 dark:bg-surface-900 shadow p-4 rounded-border">
                            <div class="flex justify-between mb-4">
                                <div>
                                    <span class="block text-surface-500 dark:text-surface-300 font-medium mb-4">Revenue</span>
                                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">$2.100</div>
                                </div>
                                <div class="flex items-center justify-center bg-orange-100 rounded-border" style="width: 2.5rem; height: 2.5rem">
                                    <i class="pi pi-map-marker text-orange-500 text-xl"></i>
                                </div>
                            </div>
                            <span class="text-green-500 font-medium">%52+ </span>
                            <span class="text-surface-500 dark:text-surface-300">since last week</span>
                        </div>
                    </div>
                    <div class="col-span-12 md:col-span-6 lg:col-span-3">
                        <div class="bg-surface-0 dark:bg-surface-900 shadow p-4 rounded-border">
                            <div class="flex justify-between mb-4">
                                <div>
                                    <span class="block text-surface-500 dark:text-surface-300 font-medium mb-4">Customers</span>
                                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">28441</div>
                                </div>
                                <div class="flex items-center justify-center bg-cyan-100 rounded-border" style="width: 2.5rem; height: 2.5rem">
                                    <i class="pi pi-inbox text-cyan-500 text-xl"></i>
                                </div>
                            </div>
                            <span class="text-green-500 font-medium">520 </span>
                            <span class="text-surface-500 dark:text-surface-300">newly registered</span>
                        </div>
                    </div>
                    <div class="col-span-12 md:col-span-6 lg:col-span-3">
                        <div class="bg-surface-0 dark:bg-surface-900 shadow p-4 rounded-border">
                            <div class="flex justify-between mb-4">
                                <div>
                                    <span class="block text-surface-500 dark:text-surface-300 font-medium mb-4">Comments</span>
                                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">152 Unread</div>
                                </div>
                                <div class="flex items-center justify-center bg-purple-100 rounded-border" style="width: 2.5rem; height: 2.5rem">
                                    <i class="pi pi-comment text-purple-500 text-xl"></i>
                                </div>
                            </div>
                            <span class="text-green-500 font-medium">85 </span>
                            <span class="text-surface-500 dark:text-surface-300">responded</span>
                        </div>
                    </div>
                </div>
            </div>
        </BlockViewer>

        <BlockViewer header="Sign-In" :code="block8" containerClass="bg-surface-50 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20 flex items-center justify-center" free>
            <div class="bg-surface-0 dark:bg-surface-900 p-6 shadow rounded-border w-full lg:w-6/12">
                <div class="text-center mb-8">
                    <img src="/demo/images/blocks/logos/hyper.svg" alt="Image" height="50" class="mb-4" />
                    <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Welcome Back</div>
                    <span class="text-surface-600 dark:text-surface-200 font-medium leading-normal">Don't have an account?</span>
                    <a class="font-medium no-underline ml-2 text-blue-500 cursor-pointer">Create today!</a>
                </div>

                <div>
                    <label for="email1" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">Email</label>
                    <InputText id="email1" type="text" class="w-full mb-4" />

                    <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">Password</label>
                    <InputText id="password1" type="password" class="w-full mb-4" />

                    <div class="flex items-center justify-between mb-12">
                        <div class="flex items-center">
                            <Checkbox id="rememberme1" :binary="true" v-model="checked" class="mr-2"></Checkbox>
                            <label for="rememberme1">Remember me</label>
                        </div>
                        <a class="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Forgot password?</a>
                    </div>

                    <Button label="Sign In" icon="pi pi-user" class="w-full"></Button>
                </div>
            </div>
        </BlockViewer>

        <BlockViewer header="Description List" :code="block9" containerClass="bg-surface-0 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20" free>
            <div class="bg-surface-0 dark:bg-surface-950">
                <div class="font-medium text-3xl text-surface-900 dark:text-surface-0 mb-4">Movie Information</div>
                <div class="text-surface-500 dark:text-surface-300 mb-8">Morbi tristique blandit turpis. In viverra ligula id nulla hendrerit rutrum.</div>
                <ul class="list-none p-0 m-0">
                    <li class="flex items-center py-4 px-2 border-t border-surface flex-wrap">
                        <div class="text-surface-500 dark:text-surface-300 w-6/12 md:w-2/12 font-medium">Title</div>
                        <div class="text-surface-900 dark:text-surface-0 w-full md:w-8/12 md:order-none order-1">Heat</div>
                        <div class="w-6/12 md:w-2/12 flex justify-end">
                            <Button label="Edit" icon="pi pi-pencil" class="p-button-text"></Button>
                        </div>
                    </li>
                    <li class="flex items-center py-4 px-2 border-t border-surface flex-wrap">
                        <div class="text-surface-500 dark:text-surface-300 w-6/12 md:w-2/12 font-medium">Genre</div>
                        <div class="text-surface-900 dark:text-surface-0 w-full md:w-8/12 md:order-none order-1">
                            <Chip label="Crime" class="mr-2"></Chip>
                            <Chip label="Drama" class="mr-2"></Chip>
                            <Chip label="Thriller"></Chip>
                        </div>
                        <div class="w-6/12 md:w-2/12 flex justify-end">
                            <Button label="Edit" icon="pi pi-pencil" class="p-button-text"></Button>
                        </div>
                    </li>
                    <li class="flex items-center py-4 px-2 border-t border-surface flex-wrap">
                        <div class="text-surface-500 dark:text-surface-300 w-6/12 md:w-2/12 font-medium">Director</div>
                        <div class="text-surface-900 dark:text-surface-0 w-full md:w-8/12 md:order-none order-1">Michael Mann</div>
                        <div class="w-6/12 md:w-2/12 flex justify-end">
                            <Button label="Edit" icon="pi pi-pencil" class="p-button-text"></Button>
                        </div>
                    </li>
                    <li class="flex items-center py-4 px-2 border-t border-surface flex-wrap">
                        <div class="text-surface-500 dark:text-surface-300 w-6/12 md:w-2/12 font-medium">Actors</div>
                        <div class="text-surface-900 dark:text-surface-0 w-full md:w-8/12 md:order-none order-1">Robert De Niro, Al Pacino</div>
                        <div class="w-6/12 md:w-2/12 flex justify-end">
                            <Button label="Edit" icon="pi pi-pencil" class="p-button-text"></Button>
                        </div>
                    </li>
                    <li class="flex items-center py-4 px-2 border-t border-b border-surface flex-wrap">
                        <div class="text-surface-500 dark:text-surface-300 w-6/12 md:w-2/12 font-medium">Plot</div>
                        <div class="text-surface-900 dark:text-surface-0 w-full md:w-8/12 md:order-none order-1 leading-normal">
                            A group of professional bank robbers start to feel the heat from police when they unknowingly leave a clue at their latest heist.
                        </div>
                        <div class="w-6/12 md:w-2/12 flex justify-end">
                            <Button label="Edit" icon="pi pi-pencil" class="p-button-text"></Button>
                        </div>
                    </li>
                </ul>
            </div>
        </BlockViewer>

        <BlockViewer header="Card" :code="block10" containerClass="px-6 py-20 md:px-12 lg:px-20" free>
            <div class="bg-surface-0 dark:bg-surface-900 p-6 shadow rounded-border">
                <div class="text-3xl font-medium text-surface-900 dark:text-surface-0 mb-4">Card Title</div>
                <div class="font-medium text-surface-500 dark:text-surface-300 mb-4">Vivamus id nisl interdum, blandit augue sit amet, eleifend mi.</div>
                <div style="height: 150px" class="border-2 border-dashed border-surface"></div>
            </div>
        </BlockViewer>
    </div>
</template>
