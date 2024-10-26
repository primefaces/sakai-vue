<script setup>
import { ref } from 'vue'

import AppMenuItem from './AppMenuItem.vue'

const model = ref([
    {
        label: 'Меню',
        items: [{ label: 'Личный кабинет', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: 'Мои',
        items: [
            { label: 'Сертификаты', icon: 'pi pi-fw pi-id-card', to: '/my/certs' },
            { label: 'Обучения и курсы', icon: 'pi pi-fw pi-id-card', to: '/my/lessons' },
            { label: 'Календарь', icon: 'pi pi-fw pi-id-card', to: '/my/calendar' },
            { label: 'Корпоративный Чат', icon: 'pi pi-fw pi-id-card', to: '/my/chat' },
        ]
    },
    {
        label: 'Сервисы',
        icon: 'pi pi-fw pi-briefcase',
        to: '/pages',
        items: [
            {
                label: 'Портал компании',
                icon: 'pi pi-fw pi-globe',
                to: '/landing'
            },
            {
                label: 'Авторизация',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Логин',
                        icon: 'pi pi-fw pi-sign-in',
                        to: '/auth/login'
                    },
                    {
                        label: 'Страница ошибки',
                        icon: 'pi pi-fw pi-times-circle',
                        to: '/auth/error'
                    },
                    {
                        label: 'Приватная зона',
                        icon: 'pi pi-fw pi-lock',
                        to: '/auth/access'
                    }
                ]
            },
        ]
    },

    {
        label: 'Начало работы',
        items: [
            {
                label: 'Техподдержка',
                icon: 'pi pi-fw pi-book',
                to: '/documentation'
            },
        ]
    }
])
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
