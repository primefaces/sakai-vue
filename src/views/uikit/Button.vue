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
                <Button label="Primary" class="mr-2 mb-2" />
                <Button label="Secondary" class="p-button-secondary mr-2 mb-2" />
                <Button label="Success" class="p-button-success mr-2 mb-2" />
                <Button label="Info" class="p-button-info mr-2 mb-2" />
                <Button label="Warning" class="p-button-warning mr-2 mb-2" />
                <Button label="Danger" class="p-button-danger mr-2 mb-2" />
            </div>

            <div class="card">
                <h5>Text</h5>
                <Button label="Primary" class="p-button-text mr-2 mb-2" />
                <Button label="Secondary" class="p-button-secondary p-button-text mr-2 mb-2" />
                <Button label="Success" class="p-button-success p-button-text mr-2 mb-2" />
                <Button label="Info" class="p-button-info p-button-text mr-2 mb-2" />
                <Button label="Warning" class="p-button-warning p-button-text mr-2 mb-2" />
                <Button label="Help" class="p-button-help p-button-text mr-2 mb-2" />
                <Button label="Danger" class="p-button-danger p-button-text mr-2 mb-2" />
                <Button label="Plain" class="p-button-plain p-button-text mr-2 mb-2" />
            </div>

            <div class="card">
                <h5>Outlined</h5>
                <Button label="Primary" class="p-button-outlined mr-2 mb-2" />
                <Button label="Secondary" class="p-button-outlined p-button-secondary mr-2 mb-2" />
                <Button label="Success" class="p-button-outlined p-button-success mr-2 mb-2" />
                <Button label="Info" class="p-button-outlined p-button-info mr-2 mb-2" />
                <Button label="Warning" class="p-button-outlined p-button-warning mr-2 mb-2" />
                <Button label="Help" class="p-button-outlined p-button-help mr-2 mb-2" />
                <Button label="Danger" class="p-button-outlined p-button-danger mr-2 mb-2" />
            </div>

            <div class="card">
                <h5>Button Group</h5>
                <span class="p-buttonset">
                    <Button label="Save" icon="pi pi-check" />
                    <Button label="Delete" icon="pi pi-trash" />
                    <Button label="Cancel" icon="pi pi-times" />
                </span>
            </div>

            <div class="card">
                <h5>SplitButton</h5>
                <SplitButton label="Save" icon="pi pi-check" :model="items" class="p-button-secondary mr-2 mb-2"></SplitButton>
                <SplitButton label="Save" icon="pi pi-check" :model="items" class="p-button-success mr-2 mb-2"></SplitButton>
                <SplitButton label="Save" icon="pi pi-check" :model="items" class="p-button-info mr-2 mb-2"></SplitButton>
                <SplitButton label="Save" icon="pi pi-check" :model="items" class="p-button-warning mr-2 mb-2"></SplitButton>
                <SplitButton label="Save" icon="pi pi-check" :model="items" class="p-button-danger mr-2 mb-2"></SplitButton>
            </div>

            <div class="card">
                <h5>Templating</h5>
                <div class="flex flex-wrap gap-2">
                    <Button type="button" class="google">
                        <span class="flex align-items-center px-2 bg-purple-700 text-white">
                            <i className="pi pi-google"></i>
                        </span>
                        <span className="px-3 py-2 flex align-items-center text-white">Google</span>
                    </Button>
                    <Button type="button" class="twitter">
                        <span class="flex align-items-center px-2 bg-blue-500 text-white">
                            <i className="pi pi-twitter"></i>
                        </span>
                        <span className="px-3 py-2 flex align-items-center text-white">Twitter</span>
                    </Button>
                    <Button type="button" class="discord">
                        <span class="flex align-items-center px-2 bg-bluegray-800 text-white">
                            <i className="pi pi-discord"></i>
                        </span>
                        <span className="px-3 py-2 flex align-items-center text-white">Discord</span>
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
                <Button label="Primary" class="p-button-raised mr-2 mb-2" />
                <Button label="Secondary" class="p-button-raised p-button-secondary mr-2 mb-2" />
                <Button label="Success" class="p-button-raised p-button-success mr-2 mb-2" />
                <Button label="Info" class="p-button-raised p-button-info mr-2 mb-2" />
                <Button label="Warning" class="p-button-raised p-button-warning mr-2 mb-2" />
                <Button label="Danger" class="p-button-raised p-button-danger mr-2 mb-2" />
            </div>

            <div class="card">
                <h5>Rounded</h5>
                <Button label="Primary" class="p-button-rounded mr-2 mb-2" />
                <Button label="Secondary" class="p-button-rounded p-button-secondary mr-2 mb-2" />
                <Button label="Success" class="p-button-rounded p-button-success mr-2 mb-2" />
                <Button label="Info" class="p-button-rounded p-button-info mr-2 mb-2" />
                <Button label="Warning" class="p-button-rounded p-button-warning mr-2 mb-2" />
                <Button label="Danger" class="p-button-rounded p-button-danger mr-2 mb-2" />
            </div>

            <div class="card">
                <h5>Rounded Icons</h5>
                <Button icon="pi pi-star-fill" class="p-button-rounded mr-2 mb-2" />
                <Button icon="pi pi-bookmark" class="p-button-rounded p-button-secondary mr-2 mb-2" />
                <Button icon="pi pi-check" class="p-button-rounded p-button-success mr-2 mb-2" />
                <Button icon="pi pi-search" class="p-button-rounded p-button-info mr-2 mb-2" />
                <Button icon="pi pi-user" class="p-button-rounded p-button-warning mr-2 mb-2" />
                <Button icon="pi pi-sign-out" class="p-button-rounded p-button-danger mr-2 mb-2" />
            </div>

            <div class="card">
                <h5>Rounded Text</h5>
                <Button icon="pi pi-check" class="p-button-rounded p-button-text mr-2 mb-2" />
                <Button icon="pi pi-bookmark" class="p-button-rounded p-button-secondary p-button-text mr-2 mb-2" />
                <Button icon="pi pi-search" class="p-button-rounded p-button-success p-button-text mr-2 mb-2" />
                <Button icon="pi pi-user" class="p-button-rounded p-button-info p-button-text mr-2 mb-2" />
                <Button icon="pi pi-bell" class="p-button-rounded p-button-warning p-button-text mr-2 mb-2" />
                <Button icon="pi pi-heart" class="p-button-rounded p-button-help p-button-text mr-2 mb-2" />
                <Button icon="pi pi-times" class="p-button-rounded p-button-danger p-button-text mr-2 mb-2" />
                <Button icon="pi pi-filter" class="p-button-rounded p-button-plain p-button-text mr-2 mb-2" />
            </div>

            <div class="card">
                <h5>Rounded Outlined</h5>
                <Button icon="pi pi-check" class="p-button-rounded p-button-outlined mr-2 mb-2" />
                <Button icon="pi pi-bookmark" class="p-button-rounded p-button-secondary p-button-outlined mr-2 mb-2" />
                <Button icon="pi pi-search" class="p-button-rounded p-button-success p-button-outlined mr-2 mb-2" />
                <Button icon="pi pi-user" class="p-button-rounded p-button-info p-button-outlined mr-2 mb-2" />
                <Button icon="pi pi-bell" class="p-button-rounded p-button-warning p-button-outlined mr-2 mb-2" />
                <Button icon="pi pi-heart" class="p-button-rounded p-button-help p-button-outlined mr-2 mb-2" />
                <Button icon="pi pi-times" class="p-button-rounded p-button-danger p-button-outlined mr-2 mb-2" />
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

<style lang="scss" scoped>
.google {
    background: linear-gradient(to left, var(--purple-600) 50%, var(--purple-700) 50%);
    background-size: 200% 100%;
    background-position: right bottom;
    transition: background-position 0.5s ease-out;
    border-color: var(--purple-700);
    display: flex;
    align-items: stretch;
    padding: 0;

    &:enabled:hover {
        background: linear-gradient(to left, var(--purple-600) 50%, var(--purple-700) 50%);
        background-size: 200% 100%;
        background-position: left bottom;
        border-color: var(--purple-700);
    }

    &:focus {
        box-shadow: 0 0 0 1px var(--purple-400);
    }
}

.twitter {
    background: linear-gradient(to left, var(--blue-400) 50%, var(--blue-500) 50%);
    background-size: 200% 100%;
    background-position: right bottom;
    transition: background-position 0.5s ease-out;
    border-color: var(--blue-500);
    padding: 0;
    display: flex;
    align-items: stretch;

    &:enabled:hover {
        background: linear-gradient(to left, var(--blue-400) 50%, var(--blue-500) 50%);
        background-size: 200% 100%;
        background-position: left bottom;
        border-color: var(--blue-500);
    }

    &:focus {
        box-shadow: 0 0 0 1px var(--blue-200);
    }
}

.discord {
    background: linear-gradient(to left, var(--bluegray-700) 50%, var(--bluegray-800) 50%);
    background-size: 200% 100%;
    background-position: right bottom;
    transition: background-position 0.5s ease-out;
    border-color: var(--bluegray-800);
    padding: 0;
    display: flex;
    align-items: stretch;

    &:enabled:hover {
        background: linear-gradient(to left, var(--bluegray-700) 50%, var(--bluegray-800) 50%);
        background-size: 200% 100%;
        background-position: left bottom;
        border-color: var(--bluegray-800);
    }

    &:focus {
        box-shadow: 0 0 0 1px var(--purple-500);
    }
}

.template-button .p-button.twitter {
    background: linear-gradient(to left, var(--blue-400) 50%, var(--blue-500) 50%);
    background-size: 200% 100%;
    background-position: right bottom;
    transition: background-position 0.5s ease-out;
    color: #fff;
    border-color: var(--blue-500);
}
.template-button .p-button.twitter:hover {
    background-position: left bottom;
}
.template-button .p-button.twitter i {
    background-color: var(--blue-500);
}
.template-button .p-button.twitter:focus {
    box-shadow: 0 0 0 1px var(--blue-200);
}
.template-button .p-button.slack {
    background: linear-gradient(to left, var(--orange-400) 50%, var(--orange-500) 50%);
    background-size: 200% 100%;
    background-position: right bottom;
    transition: background-position 0.5s ease-out;
    color: #fff;
    border-color: var(--orange-500);
}
.template-button .p-button.slack:hover {
    background-position: left bottom;
}
.template-button .p-button.slack i {
    background-color: var(--orange-500);
}
.template-button .p-button.slack:focus {
    box-shadow: 0 0 0 1px var(--orange-200);
}
.template-button .p-button.amazon {
    background: linear-gradient(to left, var(--yellow-400) 50%, var(--yellow-500) 50%);
    background-size: 200% 100%;
    background-position: right bottom;
    transition: background-position 0.5s ease-out;
    color: #000;
    border-color: var(--yellow-500);
}
.template-button .p-button.amazon:hover {
    background-position: left bottom;
}
.template-button .p-button.amazon i {
    background-color: var(--yellow-500);
}
.template-button .p-button.amazon:focus {
    box-shadow: 0 0 0 1px var(--yellow-200);
}
.template-button .p-button.discord {
    background: linear-gradient(to left, var(--bluegray-700) 50%, var(--bluegray-800) 50%);
    background-size: 200% 100%;
    background-position: right bottom;
    transition: background-position 0.5s ease-out;
    color: #fff;
    border-color: var(--bluegray-800);
}
.template-button .p-button.discord:hover {
    background-position: left bottom;
}
.template-button .p-button.discord i {
    background-color: var(--bluegray-800);
}
.template-button .p-button.discord:focus {
    box-shadow: 0 0 0 1px var(--bluegray-500);
}
@media screen and (max-width: 960px) {
    -button .p-button {
        margin-bottom: 0.5rem;
    }
    -button .p-button:not(.p-button-icon-only) {
        display: flex;
        flex-wrap: wrap;
    }
    -button .p-buttonset .p-button {
        margin-bottom: 0;
    }
}
</style>
