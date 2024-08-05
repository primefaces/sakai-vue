<script setup>
import { ref } from 'vue';

const items = ref([
    {
        label: 'Update',
        icon: 'pi pi-refresh'
    },
    {
        label: 'Delete',
        icon: 'pi pi-times'
    },
    {
        separator: true
    },
    {
        label: 'Home',
        icon: 'pi pi-home'
    }
]);

const loading = ref([false, false, false]);

function load(index) {
    loading.value[index] = true;
    setTimeout(() => (loading.value[index] = false), 1000);
}
</script>

<template>
    <div class="flex flex-col md:flex-row gap-8">
        <div class="md:w-1/2">
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Default</div>
                <div class="flex flex-wrap gap-2">
                    <Button label="Submit"></Button>
                    <Button label="Disabled" :disabled="true"></Button>
                    <Button label="Link" class="p-button-link" />
                </div>
            </div>
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Severities</div>
                <div class="flex flex-wrap gap-2">
                    <Button label="Primary" />
                    <Button label="Secondary" severity="secondary" />
                    <Button label="Success" severity="success" />
                    <Button label="Info" severity="info" />
                    <Button label="Warn" severity="warn" />
                    <Button label="Help" severity="help" />
                    <Button label="Danger" severity="danger" />
                    <Button label="Contrast" severity="contrast" />
                </div>
            </div>
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Text</div>
                <div class="flex flex-wrap gap-2">
                    <Button label="Primary" text />
                    <Button label="Secondary" severity="secondary" text />
                    <Button label="Success" severity="success" text />
                    <Button label="Info" severity="info" text />
                    <Button label="Warn" severity="warn" text />
                    <Button label="Help" severity="help" text />
                    <Button label="Danger" severity="danger" text />
                    <Button label="Plain" plain text />
                </div>
            </div>
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Outlined</div>
                <div class="flex flex-wrap gap-2">
                    <Button label="Primary" outlined />
                    <Button label="Secondary" severity="secondary" outlined />
                    <Button label="Success" severity="success" outlined />
                    <Button label="Info" severity="info" outlined />
                    <Button label="warn" severity="warn" outlined />
                    <Button label="Help" severity="help" outlined />
                    <Button label="Danger" severity="danger" outlined />
                    <Button label="Contrast" severity="contrast" outlined />
                </div>
            </div>
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Group</div>
                <div class="flex flex-wrap gap-2">
                    <ButtonGroup>
                        <Button label="Save" icon="pi pi-check" />
                        <Button label="Delete" icon="pi pi-trash" />
                        <Button label="Cancel" icon="pi pi-times" />
                    </ButtonGroup>
                </div>
            </div>
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">SplitButton</div>
                <div class="flex flex-wrap gap-2">
                    <SplitButton label="Save" :model="items"></SplitButton>
                    <SplitButton label="Save" :model="items" severity="secondary"></SplitButton>
                    <SplitButton label="Save" :model="items" severity="success"></SplitButton>
                    <SplitButton label="Save" :model="items" severity="info"></SplitButton>
                    <SplitButton label="Save" :model="items" severity="warn"></SplitButton>
                    <SplitButton label="Save" :model="items" severity="help"></SplitButton>
                    <SplitButton label="Save" :model="items" severity="danger"></SplitButton>
                    <SplitButton label="Save" :model="items" severity="contrast"></SplitButton>
                </div>
            </div>
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Templating</div>
                <div class="flex flex-wrap gap-2">
                    <Button type="button">
                        <img alt="logo" src="/demo/images/logo-white.svg" style="width: 1.5rem" />
                    </Button>
                    <Button type="button" outlined severity="success">
                        <img alt="logo" src="/demo/images/logo.svg" style="width: 1.5rem" />
                        <span class="ml-2 text-bold">PrimeVue</span>
                    </Button>
                </div>
            </div>
        </div>
        <div class="md:w-1/2">
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Icons</div>
                <div class="flex flex-wrap gap-2">
                    <Button icon="pi pi-star-fill" class="mr-2 mb-2"></Button>
                    <Button label="Bookmark" icon="pi pi-bookmark" class="mr-2 mb-2"></Button>
                    <Button label="Bookmark" icon="pi pi-bookmark" iconPos="right" class="mr-2 mb-2"></Button>
                </div>
            </div>
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Raised</div>
                <div class="flex flex-wrap gap-2">
                    <Button label="Primary" raised />
                    <Button label="Secondary" severity="secondary" raised />
                    <Button label="Success" severity="success" raised />
                    <Button label="Info" severity="info" raised />
                    <Button label="Warn" severity="warn" raised />
                    <Button label="Help" severity="help" raised />
                    <Button label="Danger" severity="danger" raised />
                    <Button label="Contrast" severity="contrast" raised />
                </div>
            </div>
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Rounded</div>
                <div class="flex flex-wrap gap-2">
                    <Button label="Primary" rounded />
                    <Button label="Secondary" severity="secondary" rounded />
                    <Button label="Success" severity="success" rounded />
                    <Button label="Info" severity="info" rounded />
                    <Button label="Warn" severity="warn" rounded />
                    <Button label="Help" severity="help" rounded />
                    <Button label="Danger" severity="danger" rounded />
                    <Button label="Contrast" severity="contrast" rounded />
                </div>
            </div>
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Rounded Icons</div>
                <div class="flex flex-wrap gap-2">
                    <Button icon="pi pi-check" rounded />
                    <Button icon="pi pi-bookmark" severity="secondary" rounded />
                    <Button icon="pi pi-search" severity="success" rounded />
                    <Button icon="pi pi-user" severity="info" rounded />
                    <Button icon="pi pi-bell" severity="warn" rounded />
                    <Button icon="pi pi-heart" severity="help" rounded />
                    <Button icon="pi pi-times" severity="danger" rounded />
                </div>
            </div>
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Rounded Text</div>
                <div class="flex flex-wrap gap-2">
                    <Button icon="pi pi-check" text raised rounded />
                    <Button icon="pi pi-bookmark" severity="secondary" text raised rounded />
                    <Button icon="pi pi-search" severity="success" text raised rounded />
                    <Button icon="pi pi-user" severity="info" text raised rounded />
                    <Button icon="pi pi-bell" severity="warn" text raised rounded />
                    <Button icon="pi pi-heart" severity="help" text raised rounded />
                    <Button icon="pi pi-times" severity="danger" text raised rounded />
                </div>
            </div>
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Rounded Outlined</div>
                <div class="flex flex-wrap gap-2">
                    <Button icon="pi pi-check" rounded outlined />
                    <Button icon="pi pi-bookmark" severity="secondary" rounded outlined />
                    <Button icon="pi pi-search" severity="success" rounded outlined />
                    <Button icon="pi pi-user" severity="info" rounded outlined />
                    <Button icon="pi pi-bell" severity="warn" rounded outlined />
                    <Button icon="pi pi-heart" severity="help" rounded outlined />
                    <Button icon="pi pi-times" severity="danger" rounded outlined />
                </div>
            </div>
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Loading</div>
                <div class="flex flex-wrap gap-2">
                    <Button type="button" class="mr-2 mb-2" label="Search" icon="pi pi-search" :loading="loading[0]" @click="load(0)" />
                    <Button type="button" class="mr-2 mb-2" label="Search" icon="pi pi-search" iconPos="right" :loading="loading[1]" @click="load(1)" />
                    <Button type="button" class="mr-2 mb-2" icon="pi pi-search" :loading="loading[2]" @click="load(2)" />
                    <Button type="button" class="mr-2 mb-2" label="Search" :loading="loading[3]" @click="load(3)" />
                </div>
            </div>
        </div>
    </div>
</template>
