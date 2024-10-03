<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import ConfirmDialog from 'primevue/confirmdialog';
import { 
    clearAllUsersWeekSchedule, 
    checkAndUpdateUserRole,  
    updateUserToMae,
    saveScheduleSubjectsExperience,
    updatePoints
} from '../firebase/db/users';

const toast = useToast();
const confirm = useConfirm();


const displayUploadDialog = ref(false);
const displayAddUserDialog = ref(false);
const displayUpdatePointsDialog = ref(false);
const selectedFile = ref(null);

const newMatricula = ref('');
const newRole = ref(null);
const newStatus = ref(null);

const roles = [
    { label: 'MAE', value: 'mae' },
    { label: 'Coordi', value: 'coordi' },
    { label: 'Publi', value: 'publi' },
    { label: 'Tecnología', value: 'tec' },
    { label: 'Usuario', value: 'user' }
];
const statuses = [
    { label: 'Becario', value: 'becario' },
    { label: 'Voluntario', value: 'voluntario' },
    { label: 'Estudiante', value: 'estudiante' }
];

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

const openUploadDialog = () => {
    displayUploadDialog.value = true;
};

// Función para manejar la carga del archivo o la actualización de roles sin archivo
const handleFileUpload = () => {
    confirm.require({
        message: '¿Estás seguro de que deseas cambiar el rol a "ex mae" para los usuarios elegibles usando el archivo Excel?',
        header: 'Confirmación de Actualización de Rol',
        icon: 'pi pi-exclamation-circle',
        acceptLabel: 'Sí, actualizar roles',
        rejectLabel: 'Cancelar',
        acceptClass: 'p-button-warning',
        accept: async () => {
            try {
                if (selectedFile.value) {
                    // Si hay un archivo seleccionado, actualizar roles con el archivo
                    await checkAndUpdateUserRole(selectedFile.value); 
                } else {
                    // Si no hay archivo, actualizar roles sin archivo
                    await checkAndUpdateUserRole(null);
                }
                toast.add({ severity: 'success', summary: 'Éxito', detail: 'Se han actualzado los maes inactivos a exmaes.', life: 3000 });
                displayUploadDialog.value = false; 
            } catch (error) {
                console.error("Error al actualizar roles:", error);
                toast.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al intentar actualizar los maes inactivos.', life: 3000 });
            }
        },
        reject: () => {
            toast.add({ severity: 'info', summary: 'Cancelado', detail: 'No se han realizado cambios.', life: 3000 });
            displayUploadDialog.value = false; 
        }
    });
};

// Manejar el cambio en el input de archivo
const onFileChange = (event) => {
    selectedFile.value = event.target.files[0];
};

// Función para cerrar el diálogo
const closeDialog = () => {
    toast.add({ severity: 'info', summary: 'Cancelado', detail: 'No se han realizado cambios.', life: 3000 });
    displayUploadDialog.value = false;
    displayAddUserDialog.value = false;
    displayUpdatePointsDialog.value = false;
};

// Función para abrir el diálogo de agregar mae
const openAddUserDialog = () => {
    displayAddUserDialog.value = true;
};

// Función para manejar la adición de mae
const handleAddUser = async () => {
    if (!newMatricula.value || !newRole.value || !newStatus.value) {
        toast.add({ severity: 'warn', summary: 'Advertencia', detail: 'Todos los campos son obligatorios.', life: 3000 });
        return;
    }

    confirm.require({
        message: '¿Estás seguro de que deseas agregar mae o editar el rol del usuario con esta matrícula ?',
        header: 'Confirmación de agregar mae o editar rol',
        icon: 'pi pi-exclamation-circle',
        acceptLabel: 'Sí, agregar mae o editar rol',
        rejectLabel: 'Cancelar',
        acceptClass: 'p-button-success',
        accept: async () => {
            try {
                await updateUserToMae({
                    matricula: newMatricula.value,
                    role: newRole.value,
                    status: newStatus.value
                });
                toast.add({ severity: 'success', summary: 'Éxito', detail: 'Mae agregado exitosamente.', life: 3000 });
                displayAddUserDialog.value = false; // Cerrar el diálogo
                newMatricula.value = '';
                newRole.value = null;
                newStatus.value = null;
            } catch (error) {
                console.error("Error al agregar mae o editar rol:", error);
                toast.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al intentar agregar mae o editar el rol.', life: 3000 });
            }
        },
        reject: () => {
            toast.add({ severity: 'info', summary: 'Cancelado', detail: 'No se han realizado cambios.', life: 3000 });
            displayAddUserDialog.value = false; // Cerrar el diálogo
        }
    });
};


const confirmSaveExperience = () => {
    confirm.require({
        message: '¿Estás seguro de que deseas guardar la experiencia  de horario y materiaspara los usuarios?',
        header: 'Confirmación de guardar experiencia',
        icon: 'pi pi-exclamation-circle',
        acceptLabel: 'Sí, guardar',
        rejectLabel: 'Cancelar',
        acceptClass: 'p-button-success',
        accept: async () => {
            try {
                await saveScheduleSubjectsExperience(); 
                toast.add({ severity: 'success', summary: 'Éxito', detail: 'Experiencia guardada exitosamente.', life: 3000 });
            } catch (error) {
                console.error("Error al guardar la experiencia:", error);
                toast.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al intentar guardar la experiencia.', life: 3000 });
            }
        },
        reject: () => {
            toast.add({ severity: 'info', summary: 'Cancelado', detail: 'No se han realizado cambios.', life: 3000 });
        }
    });
};

const userId = ref('');
const newPoints = ref(null)

const openUpdatePointsDialog = () => {
    displayUpdatePointsDialog.value = true;
};

const handleUpdatePoints = async () => {
    if (!userId.value || newPoints.value === null) { // Verifica si es null o indefinido
        toast.add({ severity: 'warn', summary: 'Advertencia', detail: 'Todos los campos son obligatorios.', life: 3000 });
        return;
    }

    confirm.require({
        message: `¿Estás seguro de que deseas actualizar los puntos de este usuario a ${newPoints.value}?`,
        header: 'Confirmación de Actualización de Puntos',
        icon: 'pi pi-exclamation-circle',
        acceptLabel: 'Sí, actualizar puntos',
        rejectLabel: 'Cancelar',
        acceptClass: 'p-button-success',
        accept: async () => {
            try {
                await updatePoints(userId.value, parseInt(newPoints.value)); // Asegúrate de convertir a entero
                toast.add({ severity: 'success', summary: 'Éxito', detail: 'Puntos actualizados exitosamente.', life: 3000 });
                displayUpdatePointsDialog.value = false; // Cerrar el diálogo
                userId.value = '';
                newPoints.value = null; // Restablecer a 0
            } catch (error) {
                console.error("Error al actualizar puntos:", error);
                toast.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al intentar actualizar los puntos.', life: 3000 });
            }
        },
        reject: () => {
            toast.add({ severity: 'info', summary: 'Cancelado', detail: 'No se han realizado cambios.', life: 3000 });
            displayUpdatePointsDialog.value = false; // Cerrar el diálogo
        }
    });
};

</script>

<template>
    <div class="flex flex-column align-items-center gap-4 p-6 surface-ground">
        <h1 class="text-4xl font-bold text-center text-primary mb-5">Funciones especiales</h1>

        <div class="flex justify-content-center w-full">
            <Button 
                label="Eliminar horarios de los maes" 
                icon="pi pi-trash" 
                class="p-button-danger p-button-rounded p-button-lg w-full md:w-6"
                @click="confirmDelete" 
            />
        </div>

        <div class="flex justify-content-center w-full mt-4">
            <Button 
                label="Actualizar roles de 'mae' a 'ex mae'" 
                icon="pi pi-user-edit" 
                class="p-button-warning p-button-rounded p-button-lg w-full md:w-6"
                @click="openUploadDialog" 
            />
        </div>

        <div class="flex justify-content-center w-full mt-4">
            <Button 
                label="Agregar Mae/Editar Rol" 
                icon="pi pi-user-plus" 
                class="p-button-success p-button-rounded p-button-lg w-full md:w-6"
                @click="openAddUserDialog" 
            />
        </div>

        <div class="flex justify-content-center w-full mt-4">
            <Button 
                label="Guardar experiencia de horario/materias" 
                icon="pi pi-save" 
                class="p-button-info p-button-rounded p-button-lg w-full md:w-6"
                @click="confirmSaveExperience" 
            />
        </div>

        <div class="flex justify-content-center w-full mt-4">
            <Button 
                label="Actualizar Puntos" 
                icon="pi pi-user-edit" 
                class="p-button-experience p-button-rounded p-button-lg w-full md:w-6"
                @click="openUpdatePointsDialog" 
            />
        </div>

        <!-- Diálogo para carga de archivo -->
        <Dialog 
            v-model:visible="displayUploadDialog" 
            header="¿Estas seguro de actualizar los mae a exmae?" 
            modal 
            :style="{ width: '50vw' }" 
            :closable="true" 
            :dismissable-mask="true"
        >
            <div class="flex flex-column align-items-center gap-4">
                <input 
                    type="file" 
                    accept=".xlsx, .xls" 
                    @change="onFileChange"
                />
                <small >Este archivo es opcional. Si no se selecciona, se actualizarán los roles sin el archivo.</small>
                <Button 
                    label="Actualizar roles" 
                    icon="pi pi-check" 
                    class="p-button-success p-button-rounded"
                    @click="handleFileUpload"
                />
                <Button 
                    label="Cancelar" 
                    icon="pi pi-times" 
                    class="p-button-secondary p-button-rounded"
                    @click="closeDialog"
                />
            </div>
        </Dialog>

        <!-- Diálogo para agregar mae -->
        <Dialog 
            v-model:visible="displayAddUserDialog" 
            header="Agregar Mae o Editar Rol" 
            modal 
            :style="{ width: '50vw' }" 
            :closable="true" 
            :dismissable-mask="true"
        >
            <div class="flex flex-column align-items-center gap-4">
                <InputText 
                    v-model="newMatricula" 
                    placeholder="Ingrese matrícula"
                    class="w-full"
                />
                <Dropdown 
                    v-model="newRole" 
                    :options="roles" 
                    optionLabel="label" 
                    placeholder="Selecciona rol"
                    class="w-full"
                />
                <Dropdown 
                    v-model="newStatus" 
                    :options="statuses" 
                    optionLabel="label" 
                    placeholder="Selecciona estatus"
                    class="w-full"
                />

                <Button 
                    label="Agregar Mae o Editar Rol" 
                    icon="pi pi-check" 
                    class="p-button-success p-button-rounded"
                    @click="handleAddUser"
                />

                <Button 
                    label="Cancelar" 
                    icon="pi pi-times" 
                    class="p-button-secondary p-button-rounded"
                    @click="closeDialog"
                />
            </div>
        </Dialog>

        <!-- Diálogo para actualizar puntos -->
        <Dialog 
            v-model:visible="displayUpdatePointsDialog" 
            header="Actualizar Puntos del Usuario" 
            modal 
            :style="{ width: '50vw' }" 
            :closable="true" 
            :dismissable-mask="true"
        >
            <div class="flex flex-column align-items-center gap-4">
                <InputText 
                    v-model="userId" 
                    placeholder="Ingrese matricula del mae"
                    class="w-full"
                />
                <InputText 
                    v-model="newPoints" 
                    placeholder="Ingrese nuevos puntos"
                    class="w-full"
                />
                <Button 
                    label="Actualizar Puntos" 
                    icon="pi pi-check" 
                    class="p-button-success p-button-rounded"
                    @click="handleUpdatePoints"
                />
                <Button 
                    label="Cancelar" 
                    icon="pi pi-times" 
                    class="p-button-secondary p-button-rounded"
                    @click="closeDialog"
                />
            </div>
        </Dialog>

        <ConfirmDialog />
    </div>
</template>

<style scoped>
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

.p-button-success {
    background-color: #28a745;
    border-color: #28a745;
}

.p-button-experience {
    background-color: #6f42c1; 
    border-color: #6f42c1; 
}

.p-inputtext, .p-dropdown {
    width: 100%;
    max-width: 300px;
}
</style>
