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

const load = (index) => {
    loading.value[index] = true;
    setTimeout(() => (loading.value[index] = false), 1000);
};
</script>

<template>
    <div class="grid">
        <div class="col-12 md:col-6">
            <div class="card">
                <h5>Default</h5>
                <Button label="Submit" class="mr-2 mb-2"></Button>
                <Button label="Disabled" class="mr-2 mb-2" :disabled="true"></Button>
                <Button label="Link" class="p-button-link mr-2 mb-2" />
            </div>

            <div class="card">
                <h5>Severities</h5>
                <Button label="Primary" class="mb-2 mr-2" />
                <Button label="Secondary" severity="secondary" class="mb-2 mr-2" />
                <Button label="Success" severity="success" class="mb-2 mr-2" />
                <Button label="Info" severity="info" class="mb-2 mr-2" />
                <Button label="Warning" severity="warning" class="mb-2 mr-2" />
                <Button label="Help" severity="help" class="mb-2 mr-2" />
                <Button label="Danger" severity="danger" class="mb-2 mr-2" />
                <Button label="Contrast" severity="contrast" class="mb-2 mr-2" />
            </div>

            <div class="card">
                <h5>Text</h5>
                <Button label="Primary" text class="mb-2 mr-2" />
                <Button label="Secondary" severity="secondary" text class="mb-2 mr-2" />
                <Button label="Success" severity="success" text class="mb-2 mr-2" />
                <Button label="Info" severity="info" text class="mb-2 mr-2" />
                <Button label="Warning" severity="warning" text class="mb-2 mr-2" />
                <Button label="Help" severity="help" text class="mb-2 mr-2" />
                <Button label="Danger" severity="danger" text class="mb-2 mr-2" />
                <Button label="Plain" plain text class="mb-2 mr-2" />
            </div>

            <div class="card">
                <h5>Outlined</h5>
                <Button label="Primary" outlined class="mb-2 mr-2" />
                <Button label="Secondary" severity="secondary" outlined class="mb-2 mr-2" />
                <Button label="Success" severity="success" outlined class="mb-2 mr-2" />
                <Button label="Info" severity="info" outlined class="mb-2 mr-2" />
                <Button label="Warning" severity="warning" outlined class="mb-2 mr-2" />
                <Button label="Help" severity="help" outlined class="mb-2 mr-2" />
                <Button label="Danger" severity="danger" outlined class="mb-2 mr-2" />
                <Button label="Contrast" severity="contrast" outlined class="mb-2 mr-2" />
            </div>

            <div class="card">
                <h5>Button Group</h5>
                <ButtonGroup>
                    <Button label="Save" icon="pi pi-check" />
                    <Button label="Delete" icon="pi pi-trash" />
                    <Button label="Cancel" icon="pi pi-times" />
                </ButtonGroup>
            </div>

            <div class="card">
                <h5>SplitButton</h5>
                <SplitButton label="Save" :model="items" class="mb-2 mr-2"></SplitButton>
                <SplitButton label="Save" :model="items" severity="secondary" class="mb-2 mr-2"></SplitButton>
                <SplitButton label="Save" :model="items" severity="success" class="mb-2 mr-2"></SplitButton>
                <SplitButton label="Save" :model="items" severity="info" class="mb-2 mr-2"></SplitButton>
                <SplitButton label="Save" :model="items" severity="warning" class="mb-2 mr-2"></SplitButton>
                <SplitButton label="Save" :model="items" severity="help" class="mb-2 mr-2"></SplitButton>
                <SplitButton label="Save" :model="items" severity="danger" class="mb-2 mr-2"></SplitButton>
                <SplitButton label="Save" :model="items" severity="contrast" class="mb-2 mr-2"></SplitButton>
            </div>

            <div class="card">
                <h5>Templating</h5>
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

        <div class="col-12 md:col-6">
            <div class="card">
                <h5>Icons</h5>
                <Button icon="pi pi-star-fill" class="mr-2 mb-2"></Button>
                <Button label="Bookmark" icon="pi pi-bookmark" class="mr-2 mb-2"></Button>
                <Button label="Bookmark" icon="pi pi-bookmark" iconPos="right" class="mr-2 mb-2"></Button>
            </div>

            <div class="card">
                <h5>Raised</h5>
                <Button label="Primary" raised class="mb-2 mr-2" />
                <Button label="Secondary" severity="secondary" raised class="mb-2 mr-2" />
                <Button label="Success" severity="success" raised class="mb-2 mr-2" />
                <Button label="Info" severity="info" raised class="mb-2 mr-2" />
                <Button label="Warning" severity="warning" raised class="mb-2 mr-2" />
                <Button label="Help" severity="help" raised class="mb-2 mr-2" />
                <Button label="Danger" severity="danger" raised class="mb-2 mr-2" />
                <Button label="Contrast" severity="contrast" raised class="mb-2 mr-2" />
            </div>

            <div class="card">
                <h5>Rounded</h5>
                <Button label="Primary" rounded class="mb-2 mr-2" />
                <Button label="Secondary" severity="secondary" rounded class="mb-2 mr-2" />
                <Button label="Success" severity="success" rounded class="mb-2 mr-2" />
                <Button label="Info" severity="info" rounded class="mb-2 mr-2" />
                <Button label="Warning" severity="warning" rounded class="mb-2 mr-2" />
                <Button label="Help" severity="help" rounded class="mb-2 mr-2" />
                <Button label="Danger" severity="danger" rounded class="mb-2 mr-2" />
                <Button label="Contrast" severity="contrast" rounded class="mb-2 mr-2" />
            </div>

            <div class="card">
                <h5>Rounded Icons</h5>
                <Button icon="pi pi-check" rounded class="mb-2 mr-2" />
                <Button icon="pi pi-bookmark" severity="secondary" rounded class="mb-2 mr-2" />
                <Button icon="pi pi-search" severity="success" rounded class="mb-2 mr-2" />
                <Button icon="pi pi-user" severity="info" rounded class="mb-2 mr-2" />
                <Button icon="pi pi-bell" severity="warning" rounded class="mb-2 mr-2" />
                <Button icon="pi pi-heart" severity="help" rounded class="mb-2 mr-2" />
                <Button icon="pi pi-times" severity="danger" rounded class="mb-2 mr-2" />
            </div>

            <div class="card">
                <h5>Rounded Text</h5>
                <Button icon="pi pi-check" text raised rounded class="mb-2 mr-2" />
                <Button icon="pi pi-bookmark" severity="secondary" text raised rounded class="mb-2 mr-2" />
                <Button icon="pi pi-search" severity="success" text raised rounded class="mb-2 mr-2" />
                <Button icon="pi pi-user" severity="info" text raised rounded class="mb-2 mr-2" />
                <Button icon="pi pi-bell" severity="warning" text raised rounded class="mb-2 mr-2" />
                <Button icon="pi pi-heart" severity="help" text raised rounded class="mb-2 mr-2" />
                <Button icon="pi pi-times" severity="danger" text raised rounded class="mb-2 mr-2" />
            </div>

            <div class="card">
                <h5>Rounded Outlined</h5>
                <Button icon="pi pi-check" rounded outlined class="mb-2 mr-2" />
                <Button icon="pi pi-bookmark" severity="secondary" rounded outlined class="mb-2 mr-2" />
                <Button icon="pi pi-search" severity="success" rounded outlined class="mb-2 mr-2" />
                <Button icon="pi pi-user" severity="info" rounded outlined class="mb-2 mr-2" />
                <Button icon="pi pi-bell" severity="warning" rounded outlined class="mb-2 mr-2" />
                <Button icon="pi pi-heart" severity="help" rounded outlined class="mb-2 mr-2" />
                <Button icon="pi pi-times" severity="danger" rounded outlined class="mb-2 mr-2" />
            </div>

            <div class="card">
                <h5>Loading</h5>
                <Button type="button" class="mr-2 mb-2" label="Search" icon="pi pi-search" :loading="loading[0]" @click="load(0)" />
                <Button type="button" class="mr-2 mb-2" label="Search" icon="pi pi-search" iconPos="right" :loading="loading[1]" @click="load(1)" />
                <Button type="button" class="mr-2 mb-2" icon="pi pi-search" :loading="loading[2]" @click="load(2)" />
                <Button type="button" class="mr-2 mb-2" label="Search" :loading="loading[3]" @click="load(3)" />
            </div>
        </div>
    </div>
</template>
