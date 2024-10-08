import { createRouter, createWebHashHistory } from 'vue-router';
import { getCurrentUser } from '../firebase/db/users';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            children: [
                {
                    path: '/',
                    name: 'landing',
                    component: () => import('@/views/pages/Landing.vue')
                }
            ]
        },
        {
            path: '/',
            component: AppLayout,
            meta: {
                requiresAuth: true
            },
            children: [
                {
                    path: '/inicio',
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
                        roles: ['admin', 'coordi', 'mae','tec']
                    }
                },
                {
                    path: '/leaderboard',
                    name: 'leaderboard',
                    component: () => import('@/views/Leaderboard.vue'),
                    meta: {
                        roles: ['admin', 'coordi', 'mae','tec']
                    }
                },
                {
                    path: '/asesorias',
                    name: 'asesorias',
                    component: () => import('@/views/Asesorias.vue'),
                    meta: {
                        roles: ['admin', 'coordi', 'mae','tec']
                    }
                },
                {
                    path: '/coordi',
                    name: 'coordi',
                    component: () => import('@/views/Coordi.vue'),
                    meta: {
                        roles: ['admin', 'coordi','tec']
                    }
                },
                {
                    path: '/gestionAnuncios',
                    name: 'gestionAnuncios',
                    component: () => import('@/views/GestionAnuncios.vue'),
                    meta: {
                        roles: ['admin', 'coordi','tec']
                    }
                },
                {
                    path: '/admin/asesorias',
                    name: 'adminasesorias',
                    component: () => import('@/views/AdminAsesorias.vue'),
                    meta: {
                        roles: ['admin','tec']
                    }
                },
                {
                    path: '/admin/usuarios',
                    name: 'adminusuarios',
                    component: () => import('@/views/AdminUsers.vue'),
                    meta: {
                        roles: ['admin' ,'tec']
                    }
                },
                {
                    path: '/admin/materias',
                    name: 'adminmaterias',
                    component: () => import('@/views/AdminSubjects.vue'),
                    meta: {
                        roles: ['admin','tec']
                    }
                },
                {
                    path: '/admin/funciones',
                    name: 'adminfunciones',
                    component: () => import('@/views/AdminFunciones.vue'),
                    meta: {
                        roles: ['admin','tec']
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
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },
        {
            path: '/auth',
            children: [
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
                    name: 'access',
                    component: () => import('@/views/pages/auth/Access.vue')
                },
                {
                    path: '/auth/error',
                    name: 'error',
                    component: () => import('@/views/pages/auth/Error.vue')
                }
            ]
        }
    ]
});

router.beforeEach((to, from, next) => {
    if (!to.matched.some((record) => record.meta.requiresAuth)) {
        // Ruta no requiere autenticación
        return next();
    }

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe(); // Desuscribirse para evitar fugas de memoria

        if (!user) {
            // El usuario no está autenticado, redirigir al login sin alertas
            return next("/auth/login");
        }

        // El usuario está autenticado
        const { role } = await getCurrentUser();

        if (!to.meta.roles) {
            // La ruta no requiere roles específicos
            return next();
        }

        if (to.meta.roles.includes(role)) {
            // El usuario tiene privilegios para esta ruta
            return next();
        } else {
            // El usuario no tiene privilegios para esta ruta
            // Redirigir a una página sin mostrar alert
            return next("/pages/notfound");
        }
    });
});

export default router;