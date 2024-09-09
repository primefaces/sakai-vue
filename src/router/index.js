import { createRouter, createWebHashHistory } from 'vue-router';
import { getCurrentUser } from '../firebase/db/users';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            meta: {
                requiresAuth: true
            },
            children: [
                {
                    path: '/',
                    name: 'inicio',
                    component: () => import('@/views/Inicio.vue')
                },
                {
                    path: '/maesactivos',
                    name: 'maesactivos',
                    component: () => import('@/views/MaesActivos.vue')
                },
                {
                    path: '/horarios',
                    name: 'horarios',
                    component: () => import('@/views/Horarios.vue')
                },
                {
                    path: '/asesoriasgrupales',
                    name: 'asesoriasgrupales',
                    component: () => import('@/views/AsesoriasGrupales.vue')
                },
                {
                    path: '/mae/:id',
                    name: 'perfil',
                    component: () => import('@/views/PerfilMAE.vue')
                },
                {
                    path: '/biblioteca',
                    name: 'biblioteca',
                    component: () => import('@/views/Biblioteca.vue')
                },
                {
                    path: '/profile',
                    name: 'maeprofile',
                    component: () => import('@/views/ConfiguracionMAE.vue'),
                    meta: {
                        roles: ['admin', 'coordi', 'mae']
                    }
                },
                {
                    path: '/coordi',
                    name: 'coordi',
                    component: () => import('@/views/Coordi.vue'),
                    meta: {
                        roles: ['admin', 'coordi']
                    }
                },
                {
                    path: '/admin/asesorias',
                    name: 'adminasesorias',
                    component: () => import('@/views/AdminAsesorias.vue'),
                    meta: {
                        roles: ['admin']
                    }
                },
                {
                    path: '/admin/usuarios',
                    name: 'adminusuarios',
                    component: () => import('@/views/AdminUsers.vue'),
                    meta: {
                        roles: ['admin']
                    }
                },
                {
                    path: '/admin/materias',
                    name: 'adminmaterias',
                    component: () => import('@/views/AdminSubjects.vue'),
                    meta: {
                        roles: ['admin']
                    }
                },
                {
                    path: '/admin/funciones',
                    name: 'adminfunciones',
                    component: () => import('@/views/AdminFunciones.vue'),
                    meta: {
                        roles: ['admin']
                    }
                },
                /* 
                    TEMPLATE
                */
                {
                    path: '/documentation',
                    name: 'documentation',
                    component: () => import('@/views/utilities/Documentation.vue')
                }
            ]
        },
        // {
        //     path: '/landing',
        //     name: 'landing',
        //     component: () => import('@/views/pages/Landing.vue')
        // },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/register',
            name: 'register',
            component: () => import('@/views/pages/auth/Register.vue')
        },
        {
            path: '/auth/password-reset',
            name: 'password-reset',
            component: () => import('@/views/pages/auth/PasswordReset.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

router.beforeEach((to, from, next) => {
    if (!to.matched.some((record) => record.meta.requiresAuth)) {
        // Route does not require authentication
        return next();
    }

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe(); // Unsubscribe to avoid memory leaks

        if (!user) {
            // User is not signed in
            
            alert("No tienes acceso a esta página. Por favor inicia sesión");
            return next("/auth/login");
        }

        // User is signed in
        const { role } = await getCurrentUser()

        if (!to.meta.roles) {
            // Route does not require roles
            return next();
        }

        if (to.meta.roles.includes(role)) {
            // User has roule privilege
            return next();
        }
        else {
            // User does not have roule privilege
            alert("No tienes acceso a esta página");
        }
    });
});

export default router;