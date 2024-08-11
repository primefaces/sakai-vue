<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { getCurrentUser, getUsersWithActiveSession, updateUserInfo } from '../firebase/db/users';
import { getCampuses } from '../firebase/db/campuses';
import { getMajors } from '../firebase/db/majors';

const router = useRouter();
const toast = useToast();
const userInfo = ref(null);
const newUserInfo = ref(null);
const activeMAEs = ref([]);
const campuses = ref([]);
const majors = ref([]);


onMounted(async () => {
    activeMAEs.value = await getUsersWithActiveSession();
    userInfo.value = await getCurrentUser();
    newUserInfo.value = {
        "firstname": userInfo.value.firstname,
        "lastname": userInfo.value.lastname,
        "name": userInfo.value.name,
        "campus": userInfo.value.campus,
        "major": userInfo.value.major ?? userInfo.value.career,
        "career": userInfo.value.career,
        "area": userInfo.value.area,
        "email": userInfo.value.email,
    };
    campuses.value = await getCampuses(); 
    majors.value = await getMajors();
})

const showDialogPerfil = ref(false);
const saveProfileChanges = async () => {
    toast.add({ severity: 'info', summary: 'Guardando cambios', detail: 'Se están guardando los cambios en tu perfil', life: 3000 });
    try {
        newUserInfo.value.career = newUserInfo.value.major.id
        newUserInfo.value.area = newUserInfo.value.major.school
        await updateUserInfo(userInfo.value.uid, newUserInfo.value);
        userInfo.value = await getCurrentUser();
        newUserInfo.value = {
            "firstname": userInfo.value.firstname,
            "lastname": userInfo.value.lastname,
            "name": userInfo.value.name,
            "campus": userInfo.value.campus,
            "career": userInfo.value.career,
            "email": userInfo.value.email,
            "major": userInfo.value.major ?? userInfo.value.career,
            "area": userInfo.value.area,
        };
        toast.add({ severity: 'success', summary: 'Guardado exitoso', detail: 'Los cambios en tu perfil se guardaron con éxito', life: 3000 });

    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al guardar los cambios' });
    }
    showDialogPerfil.value = false;
}

const showDialogAnnouncement = ref(false);
const selectedAnnouncement = ref(null);

const openAnnouncementDialog = (announcement) => {
    showDialogAnnouncement.value = true;
    selectedAnnouncement.value = announcement;
}

const responsiveOptions = ref([
    {
        breakpoint: '1300px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1
    },
    {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1
    }
]);

const announcements = ref([
    // {
    //     title: 'Asesoría grupal',
    //     location: 'Aulas 4 - 304',
    //     date: '27/02/2024',
    // },
    // {
    //     title: 'Asesoría grupal',
    //     location: 'Aulas 4 - 304',
    //     date: '27/02/2024',
    // },
    // {
    //     title: 'Asesoría grupal',
    //     location: 'Aulas 4 - 304',
    //     date: '27/02/2024',
    // },
])

const currentDay = ref(["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][new Date().getDay()]);

const isZoomLink = (location) => {
    const zoomRegex = /https.*zoom/;
    return zoomRegex.test(location);
}
</script>

<template>
    <div class="md:flex">
        <div>
            <h1 class="text-black text-6xl font-bold text-center sm:text-left">Bienvenid@</h1>
            <div v-if="userInfo">
                <h2 class="text-black text-4xl font-semibold text-center sm:text-left">{{ userInfo.name }}</h2>
                <div class="">
                    <p class="text-lg font-medium text-center sm:text-left">
                        <i class="pi pi-envelope font-medium" />
                        {{ userInfo.email }}
                    </p>
                    <p class="text-center sm:text-left">
                        <i class="pi pi-book font-medium" />
                        {{ userInfo.career }} @ {{ userInfo.campus }}
                        <Button @click="showDialogPerfil = !showDialogPerfil" link icon="pi pi-pencil" label="Editar" class="mb-0 ml-2 p-1" />
                    </p>
                </div>
            </div>
        </div>
        <div v-if="announcements.length > 0" class="md:w-9">
            <Carousel :value="announcements" :numVisible="3" :numScroll="1" class="w-full" :autoplayInterval="announcements.length > 3 ? 5000 : null " :responsiveOptions="responsiveOptions" circular>
                <template #item="slotProps">
                    <div class="border-1 surface-border border-round-2xl m-2 p-3 bg-white">
                        <div class="mb-3 font-medium">{{slotProps.data.title}}</div>
                        <div class="flex justify-content-between align-items-center">
                            <Skeleton size="5rem" class="mr-2"></Skeleton>
                            <div>
                                <p>{{slotProps.data.location}}</p>
                                <p>{{slotProps.data.date}}</p>
                            </div>
                        </div>
                        <div class="flex justify-content-center mt-3">
                            <Button @click="openAnnouncementDialog(slotProps.data)" label="Registrarse" icon="pi pi-user-plus" raised />
                        </div>
                    </div>
                </template>
            </Carousel>
        </div>
        <div v-else class="md:w-9 flex justify-content-center align-items-center">
            <Card class="md:w-4 my-2 sm:my-0">
                <template #content>
                    <p class="m-0 text-center text-xl font-semibold">
                        ¡Espera nuevos avisos pronto!
                    </p>
                </template>
            </Card>
        </div>

    </div>
    <Dialog v-if="newUserInfo" v-model:visible="showDialogPerfil" modal header="Editar perfil" class="md:w-3">
        <label for="email">Correo</label>
        <InputText id="email" v-model="newUserInfo.email" disabled filled placeholder="Disabled" class="w-full mb-4" />
        <label for="firstname">Nombre</label>
        <InputText id="firstname" v-model="newUserInfo.firstname" placeholder="Nombre" class="w-full mb-4" />
        <label for="lastname">Apellido</label>
        <InputText id="lastname" v-model="newUserInfo.lastname" placeholder="Apellido" class="w-full mb-4" />
        <label for="career">Carrera</label>
        <Dropdown v-model="newUserInfo.major" :options="majors" filter optionLabel="name" placeholder="Carrera" checkmark :highlightOnSelect="false" class="w-12 mb-4" />
        <label for="campus">Campus</label>
        <Dropdown v-model="newUserInfo.campus" :options="campuses" optionValue="id" filter optionLabel="name" placeholder="Campus" checkmark :highlightOnSelect="false" class="w-12 mb-4" />

        <div class="flex justify-content-end gap-2">
            <Button type="button" label="Cerrar" severity="secondary" @click="showDialogPerfil = false"></Button>
            <Button type="button" label="Guardar cambios " @click="saveProfileChanges"></Button>
        </div>
    </Dialog>
    <Dialog v-model:visible="showDialogAnnouncement" modal header="Registrarse" class="w-3">
        <!-- <label for="email">Correo</label>
        <InputText id="email" v-model="newUserInfo.email" disabled filled placeholder="Disabled" class="w-full mb-4" />
        <label for="firstname">Nombre</label>
        <InputText id="firstname" v-model="newUserInfo.firstname" placeholder="Nombre" class="w-full mb-4" />
        <label for="lastname">Apellido</label>
        <InputText id="lastname" v-model="newUserInfo.lastname" placeholder="Nombre" class="w-full mb-4" />
        <label for="career">Carrera</label>
        <Dropdown v-model="newUserInfo.career" :options="majors" optionValue="id" filter optionLabel="name" placeholder="Carrera" checkmark :highlightOnSelect="false" class="w-12 mb-4" />
        <label for="campus">Campus</label>
        <Dropdown v-model="newUserInfo.campus" :options="campuses" optionValue="id" filter optionLabel="name" placeholder="Campus" checkmark :highlightOnSelect="false" class="w-12 mb-4" />

        <div class="flex justify-content-end gap-2">
            <Button type="button" label="Cerrar" severity="secondary" @click="showDialogPerfil = false"></Button>
            <Button type="button" label="Guardar cambios " @click="saveProfileChanges"></Button>
        </div> -->
    </Dialog>

    <hr>
    <div class="grid" v-if="activeMAEs.length > 0">
    <span v-for="mae in activeMAEs" :key="mae.uid" class="col-12 md:col-6 lg:col-6 xl:col-4">
        <div class="p-0 w-full h-full border-round-xl bg-white shadow-1 hover:shadow-3 transition-duration-300 transition-ease-out">
            <div class="flex border-round-top-xl bg-primary">
                <div class="pl-4 p-2">
                    <p class="text-2xl font-semibold uppercase">{{ mae.uid }}</p>
                </div>
                <div class="ml-auto pr-4 p-2">
                    <p class="text-2xl font-semibold text-end uppercase">{{ mae.career }}</p>
                </div>
            </div>

            <div class="flex p-3 gap-3">
                <img v-if="true" :src="mae.profilePictureUrl" alt="Foto de perfil"
                    class="border-circle h-6rem w-6rem">
                <Skeleton v-else shape="circle" size="5rem"></Skeleton>
                <div class="relative w-full">
                    <!-- Contenedor del texto con manejo de desbordamiento -->
                    <a :href="`/#/mae/${mae.uid}`"
                        class="font-semibold text-xl text-black-alpha-90 hover:underline hover:text-primary truncate"
                        style="display: block; max-width: 80%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
                        {{ mae.name }}
                    </a>
                    <div class="absolute bottom-0 w-full">
                        <p v-if="mae.activeSession.location" class="truncate" 
                            style="max-width: 80%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
                            <template v-if="isZoomLink(mae.activeSession.location)">
                                <a :href="mae.activeSession.location" target="_blank" rel="noopener noreferrer">
                                    Liga de zoom
                                </a>
                            </template>
                            <template v-else>
                                {{ mae.activeSession.location }}
                            </template>
                        </p>
                        <Tag v-if="mae.weekSchedule[currentDay]" class="text-md w-6rem" severity="success" :value="`${mae.weekSchedule[currentDay][0]['start']} - ${mae.weekSchedule[currentDay][0]['end']}`" />
                    </div>
                </div>
            </div>
        </div>
    </span>
</div>
<div v-else class="flex align-content-center h-full" style="min-height: 300px">
    <h1 class="flex align-items-center justify-content-center w-full text-center">
        <span>No hay MAEs conectados por ahora 😔 <br> Consulta los <router-link to="horarios">horarios</router-link> para saber cuando podemos ayudarte ❤️</span>
    </h1>
</div>

</template>

<style>
.translate {
    transition: transform 0.3s ease-in-out;
    /* Apply a 0.3s transition with ease-in-out timing function */
    cursor: pointer;
}

.translate:hover {
    transform: translateY(-10px);
    /* Moves the element up by 1 pixel on hover */
}</style>