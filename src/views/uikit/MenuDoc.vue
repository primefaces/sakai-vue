<script setup>
import { ref } from 'vue';

const menu = ref(null);
const contextMenu = ref(null);

const nestedMenuitems = ref([
    {
        label: 'Customers',
        icon: 'pi pi-fw pi-table',
        items: [
            {
                label: 'New',
                icon: 'pi pi-fw pi-user-plus',
                items: [
                    {
                        label: 'Customer',
                        icon: 'pi pi-fw pi-plus'
                    },
                    {
                        label: 'Duplicate',
                        icon: 'pi pi-fw pi-copy'
                    }
                ]
            },
            {
                label: 'Edit',
                icon: 'pi pi-fw pi-user-edit'
            }
        ]
    },
    {
        label: 'Orders',
        icon: 'pi pi-fw pi-shopping-cart',
        items: [
            {
                label: 'View',
                icon: 'pi pi-fw pi-list'
            },
            {
                label: 'Search',
                icon: 'pi pi-fw pi-search'
            }
        ]
    },
    {
        label: 'Shipments',
        icon: 'pi pi-fw pi-envelope',
        items: [
            {
                label: 'Tracker',
                icon: 'pi pi-fw pi-compass'
            },
            {
                label: 'Map',
                icon: 'pi pi-fw pi-map-marker'
            },
            {
                label: 'Manage',
                icon: 'pi pi-fw pi-pencil'
            }
        ]
    },
    {
        label: 'Profile',
        icon: 'pi pi-fw pi-user',
        items: [
            {
                label: 'Settings',
                icon: 'pi pi-fw pi-cog'
            },
            {
                label: 'Billing',
                icon: 'pi pi-fw pi-file'
            }
        ]
    },
    {
        label: 'Quit',
        icon: 'pi pi-fw pi-sign-out'
    }
]);
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
const breadcrumbItems = ref([{ label: 'Computer' }, { label: 'Notebook' }, { label: 'Accessories' }, { label: 'Backpacks' }, { label: 'Item' }]);
const nestedRouteItems = ref([
    {
        label: 'Personal',
        to: '/uikit/menu'
    },
    {
        label: 'Seat',
        to: '/uikit/menu/seat'
    },
    {
        label: 'Payment',
        to: '/uikit/menu/payment'
    },
    {
        label: 'Confirmation',
        to: '/uikit/menu/confirmation'
    }
]);
const tieredMenuItems = ref([
    {
        label: 'Customers',
        icon: 'pi pi-fw pi-table',
        items: [
            {
                label: 'New',
                icon: 'pi pi-fw pi-user-plus',
                items: [
                    {
                        label: 'Customer',
                        icon: 'pi pi-fw pi-plus'
                    },
                    {
                        label: 'Duplicate',
                        icon: 'pi pi-fw pi-copy'
                    }
                ]
            },
            {
                label: 'Edit',
                icon: 'pi pi-fw pi-user-edit'
            }
        ]
    },
    {
        label: 'Orders',
        icon: 'pi pi-fw pi-shopping-cart',
        items: [
            {
                label: 'View',
                icon: 'pi pi-fw pi-list'
            },
            {
                label: 'Search',
                icon: 'pi pi-fw pi-search'
            }
        ]
    },
    {
        label: 'Shipments',
        icon: 'pi pi-fw pi-envelope',
        items: [
            {
                label: 'Tracker',
                icon: 'pi pi-fw pi-compass'
            },
            {
                label: 'Map',
                icon: 'pi pi-fw pi-map-marker'
            },
            {
                label: 'Manage',
                icon: 'pi pi-fw pi-pencil'
            }
        ]
    },
    {
        label: 'Profile',
        icon: 'pi pi-fw pi-user',
        items: [
            {
                label: 'Settings',
                icon: 'pi pi-fw pi-cog'
            },
            {
                label: 'Billing',
                icon: 'pi pi-fw pi-file'
            }
        ]
    },
    {
        separator: true
    },
    {
        label: 'Quit',
        icon: 'pi pi-fw pi-sign-out'
    }
]);
const overlayMenuItems = ref([
    {
        label: 'Save',
        icon: 'pi pi-save'
    },
    {
        label: 'Update',
        icon: 'pi pi-refresh'
    },
    {
        label: 'Delete',
        icon: 'pi pi-trash'
    },
    {
        separator: true
    },
    {
        label: 'Home',
        icon: 'pi pi-home'
    }
]);
const menuitems = ref([
    {
        label: 'Customers',
        items: [
            {
                label: 'New',
                icon: 'pi pi-fw pi-plus'
            },
            {
                label: 'Edit',
                icon: 'pi pi-fw pi-user-edit'
            }
        ]
    },
    {
        label: 'Orders',
        items: [
            {
                label: 'View',
                icon: 'pi pi-fw pi-list'
            },
            {
                label: 'Search',
                icon: 'pi pi-fw pi-search'
            }
        ]
    }
]);
const contextMenuItems = ref([
    {
        label: 'Save',
        icon: 'pi pi-save'
    },
    {
        label: 'Update',
        icon: 'pi pi-refresh'
    },
    {
        label: 'Delete',
        icon: 'pi pi-trash'
    },
    {
        separator: true
    },
    {
        label: 'Options',
        icon: 'pi pi-cog'
    }
]);
const megamenuItems = ref([
    {
        label: 'Fashion',
        icon: 'pi pi-fw pi-tag',
        items: [
            [
                {
                    label: 'Woman',
                    items: [{ label: 'Woman Item' }, { label: 'Woman Item' }, { label: 'Woman Item' }]
                },
                {
                    label: 'Men',
                    items: [{ label: 'Men Item' }, { label: 'Men Item' }, { label: 'Men Item' }]
                }
            ],
            [
                {
                    label: 'Kids',
                    items: [{ label: 'Kids Item' }, { label: 'Kids Item' }]
                },
                {
                    label: 'Luggage',
                    items: [{ label: 'Luggage Item' }, { label: 'Luggage Item' }, { label: 'Luggage Item' }]
                }
            ]
        ]
    },
    {
        label: 'Electronics',
        icon: 'pi pi-fw pi-desktop',
        items: [
            [
                {
                    label: 'Computer',
                    items: [{ label: 'Computer Item' }, { label: 'Computer Item' }]
                },
                {
                    label: 'Camcorder',
                    items: [{ label: 'Camcorder Item' }, { label: 'Camcorder Item' }, { label: 'Camcorder Item' }]
                }
            ],
            [
                {
                    label: 'TV',
                    items: [{ label: 'TV Item' }, { label: 'TV Item' }]
                },
                {
                    label: 'Audio',
                    items: [{ label: 'Audio Item' }, { label: 'Audio Item' }, { label: 'Audio Item' }]
                }
            ],
            [
                {
                    label: 'Sports.7',
                    items: [{ label: 'Sports.7.1' }, { label: 'Sports.7.2' }]
                }
            ]
        ]
    },
    {
        label: 'Furniture',
        icon: 'pi pi-fw pi-image',
        items: [
            [
                {
                    label: 'Living Room',
                    items: [{ label: 'Living Room Item' }, { label: 'Living Room Item' }]
                },
                {
                    label: 'Kitchen',
                    items: [{ label: 'Kitchen Item' }, { label: 'Kitchen Item' }, { label: 'Kitchen Item' }]
                }
            ],
            [
                {
                    label: 'Bedroom',
                    items: [{ label: 'Bedroom Item' }, { label: 'Bedroom Item' }]
                },
                {
                    label: 'Outdoor',
                    items: [{ label: 'Outdoor Item' }, { label: 'Outdoor Item' }, { label: 'Outdoor Item' }]
                }
            ]
        ]
    },
    {
        label: 'Sports',
        icon: 'pi pi-fw pi-star',
        items: [
            [
                {
                    label: 'Basketball',
                    items: [{ label: 'Basketball Item' }, { label: 'Basketball Item' }]
                },
                {
                    label: 'Football',
                    items: [{ label: 'Football Item' }, { label: 'Football Item' }, { label: 'Football Item' }]
                }
            ],
            [
                {
                    label: 'Tennis',
                    items: [{ label: 'Tennis Item' }, { label: 'Tennis Item' }]
                }
            ]
        ]
    }
]);
const panelMenuitems = ref([
    {
        label: 'Customers',
        icon: 'pi pi-fw pi-table',
        items: [
            {
                label: 'New',
                icon: 'pi pi-fw pi-user-plus',
                items: [
                    {
                        label: 'Customer',
                        icon: 'pi pi-fw pi-plus'
                    },
                    {
                        label: 'Duplicate',
                        icon: 'pi pi-fw pi-copy'
                    }
                ]
            },
            {
                label: 'Edit',
                icon: 'pi pi-fw pi-user-edit'
            }
        ]
    },
    {
        label: 'Orders',
        icon: 'pi pi-fw pi-shopping-cart',
        items: [
            {
                label: 'View',
                icon: 'pi pi-fw pi-list'
            },
            {
                label: 'Search',
                icon: 'pi pi-fw pi-search'
            }
        ]
    },
    {
        label: 'Shipments',
        icon: 'pi pi-fw pi-envelope',
        items: [
            {
                label: 'Tracker',
                icon: 'pi pi-fw pi-compass'
            },
            {
                label: 'Map',
                icon: 'pi pi-fw pi-map-marker'
            },
            {
                label: 'Manage',
                icon: 'pi pi-fw pi-pencil'
            }
        ]
    },
    {
        label: 'Profile',
        icon: 'pi pi-fw pi-user',
        items: [
            {
                label: 'Settings',
                icon: 'pi pi-fw pi-cog'
            },
            {
                label: 'Billing',
                icon: 'pi pi-fw pi-file'
            }
        ]
    }
]);

const toggleMenu = (event) => {
    menu.value.toggle(event);
};

const onContextRightClick = (event) => {
    contextMenu.value.show(event);
};
</script>

<template>
    <div class="card">
        <h5 class="mb-2">Menubar</h5>
        <Menubar :model="nestedMenuitems">
            <template #end>
                <IconField iconPosition="left">
                    <InputIcon class="pi pi-search" />
                    <InputText type="text" placeholder="Search" />
                </IconField>
            </template>
        </Menubar>
    </div>

    <div class="card">
        <h5 class="mb-2">Breadcrumb</h5>
        <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" />
    </div>

    <div class="flex flex-col md:flex-row gap-4">
        <div class="md:w-1/2">
            <div class="card">
                <h5 class="mb-2">Stepper</h5>
                <Stepper value="1">
                    <StepList>
                        <Step value="1">Header I</Step>
                        <Step value="2">Header II</Step>
                        <Step value="3">Header III</Step>
                    </StepList>
                    <StepPanels>
                        <StepPanel v-slot="{ activateCallback }" value="1">
                            <div class="flex flex-col h-48">
                                <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">Content I</div>
                            </div>
                            <div class="flex pt-6 justify-end">
                                <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="activateCallback('2')" />
                            </div>
                        </StepPanel>
                        <StepPanel v-slot="{ activateCallback }" value="2">
                            <div class="flex flex-col h-48">
                                <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">Content II</div>
                            </div>
                            <div class="flex pt-6 justify-between">
                                <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback('1')" />
                                <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="activateCallback('3')" />
                            </div>
                        </StepPanel>
                        <StepPanel v-slot="{ activateCallback }" value="3">
                            <div class="flex flex-col h-48">
                                <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">Content III</div>
                            </div>
                            <div class="pt-6">
                                <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback('2')" />
                            </div>
                        </StepPanel>
                    </StepPanels>
                </Stepper>
            </div>
        </div>
        <div class="md:w-1/2">
            <div class="card">
                <h5 class="mb-2">Tabs</h5>
                <Tabs value="0">
                    <TabList>
                        <Tab value="0">Header I</Tab>
                        <Tab value="1">Header II</Tab>
                        <Tab value="2">Header III</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel value="0">
                            <p class="m-0">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
                                id est laborum.
                            </p>
                        </TabPanel>
                        <TabPanel value="1">
                            <p class="m-0">
                                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
                            </p>
                        </TabPanel>
                        <TabPanel value="2">
                            <p class="m-0">
                                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt
                                in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo
                                minus.
                            </p>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
        </div>
    </div>

    <div class="flex flex-col md:flex-row gap-4 mt-6">
        <div class="md:w-1/3">
            <div class="card">
                <h5 class="mb-2">Tiered Menu</h5>
                <TieredMenu :model="tieredMenuItems" />
            </div>
        </div>
        <div class="md:w-1/3">
            <div class="card">
                <h5 class="mb-2">Plain Menu</h5>
                <Menu :model="menuitems" />
            </div>
        </div>
        <div class="md:w-1/3">
            <div class="card">
                <h5 class="mb-2">Overlay Menu</h5>

                <Menu ref="menu" :model="overlayMenuItems" :popup="true" />
                <Button type="button" label="Options" icon="pi pi-angle-down" @click="toggleMenu" style="width: auto" />
            </div>

            <div class="card" @contextmenu="onContextRightClick">
                <h5 class="mb-2">ContextMenu</h5>
                Right click to display.
                <ContextMenu ref="contextMenu" :model="contextMenuItems" />
            </div>
        </div>
    </div>

    <div class="flex flex-col md:flex-row gap-4 mt-6">
        <div class="md:w-1/2">
            <div class="card">
                <h5 class="mb-2">MegaMenu - Horizontal</h5>
                <MegaMenu :model="megamenuItems" />

                <h5 class="mb-2 mt-8">MegaMenu - Vertical</h5>
                <MegaMenu :model="megamenuItems" orientation="vertical" />
            </div>
        </div>
        <div class="md:w-1/2">
            <div class="card">
                <h5 class="mb-2">PanelMenu</h5>
                <PanelMenu :model="panelMenuitems" />
            </div>
        </div>
    </div>
</template>
