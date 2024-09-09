<script setup>
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm'; // Importamos Confirm
import { clearAllUsersWeekSchedule }  from '../firebase/db/users';

const toast = useToast();
const confirm = useConfirm();

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
                await clearAllUsersWeekSchedule(); // Llama a la función para limpiar weekSchedule
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
</script>


<template>
    <div class="flex relative flex-column gap-4">
        <div class="flex-1">
            <h1 class="text-6xl font-bold mb-5 text-center sm:text-left text-primary">Funciones especiales</h1>
        </div>
        
        <div class="card p-4 shadow-2">
            <Button 
                label="Eliminar horarios de los maes" 
                icon="pi pi-trash" 
                class="p-button-danger p-button-rounded p-button-lg"
                @click="confirmDelete" 
            />
        </div>

        
        <ConfirmDialog />
    </div>
</template>
