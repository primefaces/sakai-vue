<script setup>
import { ref, onMounted } from 'vue';
import { getCurrentUser } from '../firebase/db/users'

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Estudiante',
        items: [
            
            { label: 'Inicio', icon: 'pi pi-fw pi-home', to: '/inicio' },
            { label: 'Maes activos', icon: 'pi pi-fw pi-globe', to: '/maesactivos' },
            { label: 'Horarios', icon: 'pi pi-fw pi-clock', to: '/horarios' },
            { label: 'Asesorías grupales', icon: 'pi pi-fw pi-calendar', to: '/asesoriasGrupales' },
            { label: 'Sala de honor', icon: 'pi pi-fw pi-plus', to: '/halloffame' },

        ]
    },
]);

onMounted(async () => {
    const { role, uid } = await getCurrentUser();

   

    if (['admin', 'tec'].includes(role)) {
        const adminItems = [
            
            { label: 'Usuarios', icon: 'pi pi-fw pi-users', to: '/admin/usuarios' },
            { label: 'Materias', icon: 'pi pi-fw pi-pencil', to: '/admin/materias' }
        ];

        if (role === 'admin') {
            adminItems.push(
                { label: 'Asesorías', icon: 'pi pi-fw pi-list', to: '/admin/asesorias' },
                { label: 'Funciones', icon: 'pi pi-fw pi-key', to: '/admin/funciones' },
                { label: 'Dashboard', icon: 'pi pi-fw pi-chart-bar', to: '/admin/dashboard' }
            );
        }

        model.value.push({
            label: 'Administrador',
            items: adminItems
        });
    }

    
    
    if (['publi','mae', 'coordi', 'subjectCoordi', 'admin','tec'].includes(role)) {
        model.value.push({
            label: 'MAE',
            items: [
                { label: 'Mi perfil', icon: 'pi pi-fw pi-user-edit', to: `/mae/${uid}` },
                { label: 'Leaderboard', icon: 'pi pi-fw pi-star', to: '/leaderboard'},
                { label: 'Mis asesorías', icon:'pi pi-fw pi-book', to: '/misasesorias'},
                { label: 'Mis evaluaciones', icon:'pi pi-fw pi-heart', to: '/misevaluaciones'},
                { label: 'Asistencia grupales', icon:'pi pi-fw pi-th-large', to: '/asistenciaGrupales'},
            ]
        })
    }

    if (['coordi', 'subjectCoordi', 'admin','tec'].includes(role)) {
        model.value.push({
            label: 'Coordi',
            items: [
                { label: 'Asistencia', icon: 'pi pi-fw pi-check-square', to: '/coordi' },
                { label: 'Gestión de anuncios', icon: 'pi pi-fw pi-cog', to: '/gestionAnuncios' },
                
            ]
        })
    }

    // model.value.push({
    //     label: 'Maeteca',
    //     items: [
    //         { label: 'Maeteca', icon: 'pi pi-fw pi-desktop', to: '/biblioteca' },
    //     ]
    // })
})
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item.label">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
