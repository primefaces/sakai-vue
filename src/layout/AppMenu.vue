<script setup>
import { ref, onMounted } from 'vue';
import { getCurrentUser } from '../firebase/db/users'

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Estudiante',
        items: [
            { label: 'Inicio', icon: 'pi pi-fw pi-home', to: '/inicio' },
            { label: 'Horarios', icon: 'pi pi-fw pi-clock', to: '/horarios' },
            // { label: 'MAE', icon: 'pi pi-fw pi-user', to: '/mae' },
            // { label: 'Dashboard (Template)', icon: 'pi pi-fw pi-home', to: '/dashboard' }
        ]
    },
]);

onMounted(async () => {
    const { role, uid } = await getCurrentUser();

    // if (['user', 'mae', 'Academic', 'coordi', 'subjectCoordi', 'admin'].includes(role)) {
    //     model.value.push({
    //         label: 'Estudiante',
    //         items: [
    //             { label: 'Inicio', icon: 'pi pi-fw pi-home', to: '/inicio' },
    //             { label: 'Horarios', icon: 'pi pi-fw pi-clock', to: '/horarios' },
                
    //         ]
    //     })
    // }

    if (['mae', 'coordi', 'subjectCoordi', 'admin'].includes(role)) {
        model.value.push({
            label: 'MAE',
            items: [
                { label: 'Mi perfil', icon: 'pi pi-fw pi-user-edit', to: `/mae/${uid}` },
                { label: 'Coordinador', icon: 'pi pi-fw pi-info', to: '/coordi' },
            ]
        })
    }

    if (['admin'].includes(role)) {
        model.value.push({
            label: 'Administrador',
            items: [
                { label: 'Asesorías', icon: 'pi pi-fw pi-list', to: '/admin/asesorias' },
                { label: 'Usuarios', icon: 'pi pi-fw pi-users', to: '/admin/usuarios' },
                { label: 'Materias', icon: 'pi pi-fw pi-book', to: '/admin/materias' },
            ]
        })
    }

    model.value.push({
        label: 'Maeteca',
        items: [
            { label: 'Maeteca', icon: 'pi pi-fw pi-desktop', to: '/biblioteca' },
        ]
    })
})
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
