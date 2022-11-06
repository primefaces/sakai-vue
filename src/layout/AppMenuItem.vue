<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const emit = defineEmits(['submenu:opened']);
const route = useRoute();
const show = ref(true);
const props = defineProps({
    item: {
        type: Object,
        default: () => ({})
    },
    index: {
        type: Number,
        default: 0
    },
    root: {
        type: Boolean,
        default: true
    },
    active: {
        type: Boolean,
        default: false
    }
});
const activeSubmenu = ref(null);
onMounted(() => {
    if (!props.root) {
        show.value = false;
    }
    console.log(props.item);
});
const itemClick = (event, item, index) => {
    if (item.disabled) {
        event.preventDefault();
        return;
    }
    if (!item.to && !item.url) {
        if (item.items) {
            show.value = !show.value;

            activeSubmenu.value = show.value ? index : null;
            emit('submenu:opened');
        }
        event.preventDefault();
    }
    //execute command
    if (item.command) {
        item.command({ originalEvent: event, item: item });
    }

    /*     activeIndex.value = index === activeIndex.value ? null : index; 

    /*     emit('menuitem-click', {
        originalEvent: event,
        item: item
    }); */
};

const checkActiveRoute = (item) => {
    return route.path === item.to;
};
</script>

<template>
    <li :class="{ 'layout-root-menuitem': root, 'active-menuitem': checkActiveRoute(item, root) }">
        <div v-if="root && item.visible !== false" class="layout-menuitem-root-text">{{ item.label }}</div>
        <a v-if="(!item.to || item.items) && item.visible !== false" :href="item.url" @click="itemClick($event, item, index)" :class="item.class" :target="item.target" tabindex="0">
            <i :class="item.icon" class="layout-menuitem-icon"></i>
            <span class="layout-menuitem-text">{{ item.label }}</span>
            <i class="pi pi-fw pi-angle-down layout-submenu-toggler" v-if="item.items"></i>
        </a>
        <router-link v-if="item.to && !item.items && item.visible !== false" @click="itemClick($event, item, index)" :class="[item.class, { 'active-route': checkActiveRoute(item) }]" tabindex="0" :to="item.to">
            <i :class="item.icon" class="layout-menuitem-icon"></i>
            <span class="layout-menuitem-text">{{ item.label }}</span>
            <i class="pi pi-fw pi-angle-down layout-submenu-toggler" v-if="item.items"></i>
        </router-link>
        <Transition v-if="item.items && item.visible !== false" name="layout-submenu">
            <ul v-show="show" class="layout-submenu">
                <app-menu-item v-for="(child, i) in item.items" :key="child" :index="i" :item="child" :root="false"></app-menu-item>
            </ul>
        </Transition>
    </li>
</template>

<style lang="scss" scoped></style>
