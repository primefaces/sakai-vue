<script setup>
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm'; // Importamos Confirm
import { clearAllUsersWeekSchedule, checkAndUpdateUserRole } from '../firebase/db/users'; // Importamos la nueva función

const toast = useToast();
const confirm = useConfirm();

// Función para eliminar weekSchedule
const confirmDelete = () => {
    confirm.require({
        message: '¿Estás seguro de que deseas eliminar el contenido de los horarios para todos los maes?',
        header: 'Confirmación de Eliminación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí, eliminar',
        rejectLabel: 'Cancelar',
        acceptClass: 'p-button-danger',
        accept: async () => {
            try {
                await clearAllUsersWeekSchedule(); 
                toast.add({ severity: 'success', summary: 'Éxito', detail: 'Se ha limpiado el horario de todos los maes.', life: 3000 });
            } catch (error) {
                console.error("Error al limpiar weekSchedule:", error);
                toast.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al intentar limpiar los horarios de los maes.', life: 3000 });
            }
        },
        reject: () => {
            toast.add({ severity: 'info', summary: 'Cancelado', detail: 'No se han realizado cambios.', life: 3000 });
        }
    });
};

// Función para actualizar los roles
const confirmUpdateRoles = () => {
    confirm.require({
        message: '¿Estás seguro de que deseas cambiar el rol a "ex mae" para los usuarios elegibles?',
        header: 'Confirmación de Actualización de Rol',
        icon: 'pi pi-exclamation-circle',
        acceptLabel: 'Sí, actualizar roles',
        rejectLabel: 'Cancelar',
        acceptClass: 'p-button-warning',
        accept: async () => {
            try {
                await checkAndUpdateUserRole(); // Llamamos la función de actualización de roles
                toast.add({ severity: 'success', summary: 'Éxito', detail: 'Roles actualizados correctamente.', life: 3000 });
            } catch (error) {
                console.error("Error al actualizar roles:", error);
                toast.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al intentar actualizar los roles.', life: 3000 });
            }
        },
        reject: () => {
            toast.add({ severity: 'info', summary: 'Cancelado', detail: 'No se han realizado cambios.', life: 3000 });
        }
    });
};
</script>

<template>
    <div class="flex flex-column align-items-center gap-4 p-6 surface-ground">
        <!-- Título -->
        <h1 class="text-4xl font-bold text-center text-primary mb-5">Funciones especiales</h1>

        <!-- Botón para eliminar horarios -->
        <div class="flex justify-content-center w-full">
            <Button 
                label="Eliminar horarios de los maes" 
                icon="pi pi-trash" 
                class="p-button-danger p-button-rounded p-button-lg w-full md:w-6"
                @click="confirmDelete" 
            />
        </div>

        <!-- Botón para actualizar roles -->
        <div class="flex justify-content-center w-full">
            <Button 
                label="Actualizar roles de 'mae' a 'ex mae'" 
                icon="pi pi-user-edit" 
                class="p-button-warning p-button-rounded p-button-lg w-full md:w-6"
                @click="confirmUpdateRoles" 
            />
        </div>

        <ConfirmDialog />
    </div>
</template>

<style scoped>
/* Estilos personalizados con PrimeFlex */
.surface-ground {
    background-color: #f9fafb;
    min-height: 100vh;
}

h1 {
    color: #007bff;
}

.p-button-danger {
    background-color: #dc3545;
    border-color: #dc3545;
}

.p-button-warning {
    background-color: #ffc107;
    border-color: #ffc107;
}
</style>
