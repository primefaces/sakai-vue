<script setup>
import { getAnnouncements } from '@/firebase/db/annoucement'; 
import {
  formatDate,
  formatTime
} from '@/utils/AnunciosUtils';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router'; 
import { onMounted, ref } from 'vue';

const anuncios = ref([]);
const currentAnuncio = ref({});
const currentIndex = ref(-1);
const toast = useToast();
const router = useRouter(); 

onMounted(async () => {
  anuncios.value  = await  getAnnouncements()
  nextAnuncio()
  autoAdvance();
});

const scrollToSection = (id) => {
      const element = document.getElementById(id);
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    }
    
    const nextAnuncio = () => {
  if (currentIndex.value < anuncios.value.length - 1) {
    currentIndex.value++;
  } else {
    currentIndex.value = 0;
  }
  currentAnuncio.value = anuncios.value[currentIndex.value];
};

const prevAnuncio = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  } else {
    currentIndex.value = anuncios.value.length - 1; 
  }
  currentAnuncio.value = anuncios.value[currentIndex.value];
};

const autoAdvance = () => {
  setInterval(() => {
    nextAnuncio();
  }, 5000);
};

const goToAsesoria = async (asesoria) => {
  if (!asesoria || !asesoria.id) return; 

  try {
    toast.add({ severity: 'info', summary: 'Navegando', detail: 'Dirigiendo al inicio', life: 3000 });
    
    await router.push({ 
      name: 'asesoriasGrupales', 
      query: { asesoriaId: asesoria.id }
    });
    
    toast.add({ severity: 'success', summary: 'Navegación exitosa', detail: 'Recuerda iniciar sesión para ver los anuncios', life: 3000 });
  } catch (error) {
    console.log(error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al intentar navegar a la asesoría' });
  }
};

</script>


<template>
    <div class="sticky top-0 p-2 drop-shadow-sm w-full align-center topbar border-round-bottom-3xl" :style="{background: '#EFF3F8'}">
        <div class="md:w-10 mx-auto flex p-2" :style="{justifyContent: 'space-between', alignItems: 'center', background: '#EFF3F8'}">

            <button class="p-0 m-0 h-100 w-100 bg-transparent border-transparent w-2 md:w-1" @click="scrollToSection('target-start')">
                <img class="w-full h-full object-cover" src="../../../public/layout/images/logo-maes.svg" alt="logo" />
            </button>

            <div class="flex gap-4">
                <Button
                    label="Misión"
                    class="bg-transparent p-button-lg font-bold custom-bold-button hidden lg:block"
                    :style="{ color: '#0d294c', border: 'none' }"
                    @click="scrollToSection('target-mision')"
                />
                <Button
                    label="Anuncios"
                    class="bg-transparent p-button-lg font-bold custom-bold-button hidden lg:block"
                    :style="{ color: '#0d294c', border: 'none' }"
                    @click="scrollToSection('target-anuncios')"
                />
                <Button
                    label="Asesorías"
                    class="bg-transparent p-button-lg font-bold custom-bold-button hidden lg:block"
                    :style="{ color: '#0d294c', border: 'none' }"
                    @click="scrollToSection('target-asesorias')"
                />
            </div>

            <div class="">
                <a href="#/auth/login">
                    <Button
                        label="Iniciar Sesión"
                        icon="pi pi-sign-in"
                        iconPos="right"
                        class="sm:p-button-icon-only"
                    />
                </a>
            </div>
        </div>
    </div>

    <div class="page" :style="{background: '#EFF3F8'}" id="target-start">
        <div class="drop-shadow-sm" :style="{background: '#FFFFFF', paddingBottom: '5em', borderRadius: '5em'}">
            <div class="z-0 mb-5 md:p-6 md:h-screen titleScreen flex" :style="{ background: 'linear-gradient(to right, #779AC4, #29AB93)' }">
                <div class="inline-flex">
                    <div class="flex-shrink-0 whitespace-nowrap p-4">
                        <h1 class="w-12 text-white">
                            <span class="custom-text md:text-8xl">ASESORÍAS</span> <br> <span class="custom-text-2 md:text-8xl">DE ALUMNOS <br> PARA ALUMNOS</span>
                        </h1>
                    </div>
                    <div class="flex-grow flex items-end overflow-hidden">
                        <img src="../../assets/img/maelanding.png" class="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
            
            <div class="text-center pb-3" id="target-mision">
                <span class="text-5xl md:text-7xl gradient-text">
                    Misión
                </span>
            </div>
            
            <div class="w-10 mx-auto">
                <div class="md:flex gap-5 border-round-3xl text-white px-5 text-center" :style="{ background: 'linear-gradient(to right, #779AC4, #29AB93)', alignItems: 'center', justifyContent: 'center'}">
                    <img class="object-contain w-5 md:w-3" :style="{verticalAlign: 'middle'}" src="../../assets/img/mae_hat.png" />
                    <p class="font-medium text-justify text-2xl md:text-3xl">
                        Nuestra misión es impulsar el desempeño académico de los alumnos del Tecnológico de Monterrey mediante asesorías personalizadas, tanto presenciales como virtuales, a través de un programa diseñado para fortalecer sus habilidades y conocimientos.
                    </p>
                </div>
            </div>

        </div>

        <div  :style="{paddingBottom: '5em', paddingTop: '2em'}">
            <div class="text-center pb-3" id="target-anuncios">
                <span class="text-5xl md:text-7xl gradient-text">
                    Anuncios
                </span>
            </div>
            <div class="flex   w-full  md:w-10 mx-auto flex-wrap border-round-3xl text-white md:h-20rem " :style="{ background: 'linear-gradient(to right, #779AC4, #29AB93)' }">
                <div class="relative w-full md:w-4 border-round-left-3xl">
                <span class="overlay">
                    <Button
                    label="◀"
                    class="text-xl border-none bg-transparent btn-left hidden lg:block absolute top-1/2 transform -translate-y-1/2"
                    @click="prevAnuncio"
                    />
                    <span v-if="currentAnuncio.imageUrl">
                    <img
                        class="w-full h-20rem clip-diagonal border-round-top-3xl md:border-round-left-3xl"
                        :src="currentAnuncio.imageUrl"
                    />
                    </span>
                </span>
                </div>

                <div class="w-full md:w-8 text-center p-4 flex justify-between items-center">
                <div class="grid place-content-center lg:hidden">
                    <Button
                    label="◀"
                    class="m-0 p-0 text-xl border-none bg-transparent"
                    @click="prevAnuncio"
                    />
                </div>

                <div class="flex-1 text-left">
                    <h2 v-if="currentAnuncio.type === 'Asesoría'" class="text-white text-4xl font-bold text-center m-auto mb-2">Asesorías grupales</h2>
                    <p v-if="currentAnuncio.type === 'Asesoría'" class="font-medium ml-5 text-2xl mb-1" >
                    Materia: {{ currentAnuncio.subject.name }}
                    </p>
                    <p v-if="currentAnuncio.type === 'Asesoría'" class="font-medium ml-5 text-2xl mb-1">
                    Fecha: {{ formatDate(currentAnuncio.dateTime) }}, {{ formatTime(currentAnuncio.startTime, false) }} - {{ formatTime(currentAnuncio.endTime, true) }}
                    </p>
                    <p v-if="currentAnuncio.type === 'Asesoría'" class="font-medium ml-5 text-2xl mb-1">
                    Ubicación: {{ currentAnuncio.location }}
                    </p>

                    <h2 v-if="currentAnuncio.type !== 'Asesoría' " class="text-white text-4xl font-bold m-auto text-center mb-2">
                    {{ currentAnuncio.title }}
                    </h2>
                    <p v-if="currentAnuncio.type !== 'Asesoría'" class="font-medium ml-5 text-2xl ">
                    {{ currentAnuncio.description }}
                    </p>

                    <p v-if="currentAnuncio.type === 'Asesoría'" 
                    class="text-white text-3xl font-bold ml-5 text-right mr-5 cursor-pointer"
                    @click="goToAsesoria(currentAnuncio)">
                    Pre-registro <i class="pi pi-arrow-right text-3xl font-bold"></i>
                    </p>
                    
                    
                    <a :href="`#/asesoriasGrupales`" class="no-blue-link">
                    <p v-if="currentAnuncio.type !== 'Asesoría' && currentAnuncio.type !== 'otro'"  class="text-white text-3xl font-bold ml-5 text-right mr-5 ">
                        Saber más <i class="pi pi-arrow-right text-3xl font-bold "></i>
                    </p>  
                    </a>
                
                </div>

                <div class="grid place-content-center md:mr-2 ml-2">
                    <Button
                    label="▶"
                    class="m-0 p-0 text-xl border-none bg-transparent"
                    @click="nextAnuncio"
                    />
                </div>
                </div>
            </div>
        
            
        </div>

        <div class="drop-shadow-sm" :style="{background: '#FFFFFF', paddingTop:'4em', paddingBottom: '4em', borderRadius: '5em'}">
            
            <div class="text-center pb-5" id="target-asesorias">
                <span class="text-5xl md:text-7xl font-bold" :style="{color: '#6B6B6B'}">
                    ¡Estudiemos juntos!
                </span><br>
                <span class="text-xl md:text-4xl font-bold" :style="{color: '#8F8F8F'}">
                    Asesorias 1 a 1 de lo que necesites
                </span>
            </div>

            <div class="w-10 mx-auto sm:flex gap-5">
                <div class="mb-5 p-5 border-round-3xl w-full md:w-4 text-white font-bold text-3xl flex gap-5" :style="{ background: 'linear-gradient(to right, #D96464, #F2C685)', alignItems: 'center', justifyContent: 'space-between'}">
                    <p> Escuela de Humanidades y Educación</p>
                    <img class="object-contain w-5" src="../../assets/img/iconos-landing/pencil.png">
                </div>
                <div class="mb-5 p-5 border-round-3xl w-full md:w-4 text-white font-bold text-3xl flex gap-5" :style="{ background: 'linear-gradient(to right, #E8C56A, #72CB6A)', alignItems: 'center', justifyContent: 'space-between'}">
                    <p> Escuela de Negocios</p>
                    <img class="object-contain w-5" src="../../assets/img/iconos-landing/suitcase.png">
                </div>
                <div class="mb-5 p-5 border-round-3xl w-full md:w-4 text-white font-bold text-3xl flex gap-5" :style="{ background: 'linear-gradient(to right, #81C9E3, #4453D7)', alignItems: 'center', justifyContent: 'space-between'}">
                    <p> Escuela de Ingenieria y Ciencias</p>
                    <img class="object-contain w-5" src="../../assets/img/iconos-landing/gear.png">
                </div>
            </div>

            <div class="w-10 mx-auto sm:flex gap-5">
                <div class="mb-5 p-5 border-round-3xl w-full md:w-4 text-white font-bold text-3xl flex gap-5" :style="{ background: 'linear-gradient(to right, #E59F5F, #F0E796)', alignItems: 'center', justifyContent: 'space-between'}">
                    <p> Escuela de Arquitectura y Diseño</p>
                    <img class="object-contain w-5" src="../../assets/img/iconos-landing/paint.png">
                </div>
                <div class="mb-5 p-5 border-round-3xl w-full md:w-4 text-white font-bold text-3xl flex gap-5" :style="{ background: 'linear-gradient(to right, #8FC57C, #7AD9D3)', alignItems: 'center', justifyContent: 'space-between'}">
                    <p> Escuela de Medicina y Ciencias de la Salud</p>
                    <img class="object-contain w-5" src="../../assets/img/iconos-landing/heart.png">
                </div>
                <div class="mb-5 p-5 border-round-3xl w-full md:w-4 text-white font-bold text-3xl flex gap-5" :style="{ background: 'linear-gradient(to right, #4C57BD, #A073BB)', alignItems: 'center', justifyContent: 'space-between'}">
                    <p> Escuela de Ciencias Sociales y Gobierno</p>
                    <img class="object-contain w-5" src="../../assets/img/iconos-landing/book.png">
                </div>
            </div>


        </div>

        <div class="border-round-top-3xl py-5" :style="{background: '#102F55'}">
            <div class=" w-10 mx-auto md:flex" :style="{justifyContent: 'space-between', alignItems: 'center'}">
                <div class="text-white">
                    <span class="font-bold text-4xl">maes.mx</span><br>
                    <span class="font-bold text-xl">Mentores Académicos de Excelencia</span>
                </div>

                <div class="flex w-8 pt-2 md:w-3 gap-2 navBarButtons">
                    <a class="flex w-1" :style="{alignItems: 'center'}" href="https://www.youtube.com/@maestec7575" target="_blank">
                        <img class="w-full" src="../../assets/img/redes/youtube.png">
                    </a>
                    <a class="flex w-1" :style="{alignItems: 'center'}" href="https://www.instagram.com/maestec" target="_blank">
                        <img class="w-full" src="../../assets/img/redes/instagram.png">
                    </a>
                    <a class="flex w-1" :style="{alignItems: 'center'}" href="https://www.tiktok.com/@maes.tec" target="_blank">
                        <img class="w-full" src="../../assets/img/redes/tiktok.png">
                    </a>
                    <a class="flex w-1" :style="{alignItems: 'center'}" href="" target="_blank">
                        <img class="w-full" src="../../assets/img/redes/discord.png">
                    </a>
                </div>
            </div>
        </div>
        
    </div>
    


</template>

<style scoped>
    
    .gradient-text {
        background: linear-gradient(to right, #779AC4, #29AB93);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        color: transparent;
        font-weight: bolder;
    }

    .topbar {
        z-index: 1000;
    }

    @media (min-width: 320px){
        .navBarButtons{
            justify-content: flex-start;
        }

        .smHidden{
            display: none;
        }

        .mdHidden{
            display: block;
        }

        .titleScreen {
            height: '10vh';
            border-radius: '15px';
            color: '#fff';
            border: 'none';
        }
        .custom-text {
            font-family: 'Montserrat', sans-serif;
            font-weight: 900;
            font-size: 1.5rem;
        }
        .custom-text-2 {
            font-family: 'Montserrat', sans-serif;
            font-weight: 700;
            font-size: 1.5rem;
        }
    }
    @media (min-width: 768px){
        .navBarButtons{
            justify-content: flex-end;
        }

        .smHidden{
            display: block;
        }

        .mdHidden{
            display: none;
        }

        .titleScreen {
            border-radius: '15px';
            color: '#fff';
            border: 'none';
            clip-path: inset(0px 0px 15vh 0px round 0 0 30% 40%);
        }

        .custom-text {
            font-family: 'Montserrat', sans-serif;
            font-weight: 900;
            font-style: italic;
        }
        .custom-text-2 {
            font-family: 'Montserrat', sans-serif;
            font-weight: 900;
        }

    }
    @media (min-width: 968px) {
        .btn-left {
            position: absolute;
            top: 40%;
            left: 0;
            z-index: 10; 
            color: white; 
            
        }
        .arrow{
            filter: brightness(0.8);
        }

        .clip-diagonal {
            clip-path: polygon(0 0, 85% 0, 100% 100%, 0 100%);
            
        }
        .botones{
            margin-top: auto;
        }
    }
        
        

    .no-blue-link {
        color: inherit;
        text-decoration: none;
    }

    .no-blue-link:visited {
        color: inherit;
    }

    .no-blue-link:hover {
        color: inherit;
    }

    .no-blue-link:active {
        color: inherit;
    }  

</style>