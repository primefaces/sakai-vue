<script setup>

const scrollToSection = (id) => {
      const element = document.getElementById(id);
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    }
    
    
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
                        <img src="https://i.imgur.com/7WIAUHo.png" class="w-full h-full object-cover" />
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

        <div class="" :style="{paddingBottom: '5em', paddingTop: '2em'}">
            <div class="text-center pb-3" id="target-anuncios">
                <span class="text-5xl md:text-7xl gradient-text">
                    Anuncios
                </span>
            </div>

            <div class="flex w-10 mx-auto flex-wrap border-round-3xl text-white " :style="{ background: 'linear-gradient(to right, #779AC4, #29AB93)'}">
                <div class="relative w-full md:w-4 border-round-left-3xl">
                    <span class="overlay">
                        <Button
                        label="◀"
                        class="text-xl border-none bg-transparent btn-left hidden lg:block"
                        />
                        <img class="w-full h-full clip-diagonal border-round-top-3xl md:border-round-left-3xl arrow" :style="{objectFit: 'cover'}" src="https://i.imgur.com/C6psSY1.png" />
                    </span>
                </div>
                <div class="w-full md:w-8 text-center p-4 flex gap-5">
                    <div class="w-1 grid grid-cols-1 place-content-center lg:hidden mt-1">
                        <Button
                        label="◀"
                        class="m-0 p-0 text-xl border-none bg-transparent mt-1 ml-2"
                        />
                    </div>
                    <div>
                        <h2 class="text-white text-4xl md:text-5xl font-bold">
                            Asesorías Grupales
                        </h2>
                        <p class="font-medium text-left ml-5 text-2xl md:text-3xl">
                            ¿Tienes dudas? ¡Únete a nuestras asesorías grupales! Ofrecemos sesiones cada semana de las materias más populares. ¡No te quedes atrás!
                        </p>
                        <p class="text-white text-3xl md:text-4xl font-bold text-right">
                            Saber más <i class="pi pi-arrow-right text-2xl font-bold"></i>
                        </p>
                    </div>
                    <div class="mt-1 grid grid-cols-1 place-content-center mr-2">
                        <Button
                        label="▶"
                        class="m-0 p-0 text-xl border-none bg-transparent"
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
                    <img class="object-contain w-5" src="../../assets/img/pencil.png">
                </div>
                <div class="mb-5 p-5 border-round-3xl w-full md:w-4 text-white font-bold text-3xl flex gap-5" :style="{ background: 'linear-gradient(to right, #E8C56A, #72CB6A)', alignItems: 'center', justifyContent: 'space-between'}">
                    <p> Escuela de Negocios</p>
                    <img class="object-contain w-5" src="../../assets/img/suitcase.png">
                </div>
                <div class="mb-5 p-5 border-round-3xl w-full md:w-4 text-white font-bold text-3xl flex gap-5" :style="{ background: 'linear-gradient(to right, #81C9E3, #4453D7)', alignItems: 'center', justifyContent: 'space-between'}">
                    <p> Escuela de Ingenieria y Ciencias</p>
                    <img class="object-contain w-5" src="../../assets/img/gear.png">
                </div>
            </div>

            <div class="w-10 mx-auto sm:flex gap-5">
                <div class="mb-5 p-5 border-round-3xl w-full md:w-4 text-white font-bold text-3xl flex gap-5" :style="{ background: 'linear-gradient(to right, #E59F5F, #F0E796)', alignItems: 'center', justifyContent: 'space-between'}">
                    <p> Escuela de Arquitectura y Diseño</p>
                    <img class="object-contain w-5" src="../../assets/img/paint.png">
                </div>
                <div class="mb-5 p-5 border-round-3xl w-full md:w-4 text-white font-bold text-3xl flex gap-5" :style="{ background: 'linear-gradient(to right, #8FC57C, #7AD9D3)', alignItems: 'center', justifyContent: 'space-between'}">
                    <p> Escuela de Medicina y Ciencias de la Salud</p>
                    <img class="object-contain w-5" src="../../assets/img/heart.png">
                </div>
                <div class="mb-5 p-5 border-round-3xl w-full md:w-4 text-white font-bold text-3xl flex gap-5" :style="{ background: 'linear-gradient(to right, #4C57BD, #A073BB)', alignItems: 'center', justifyContent: 'space-between'}">
                    <p> Escuela de Ciencias Sociales y Gobierno</p>
                    <img class="object-contain w-5" src="../../assets/img/book.png">
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
    img {
        object-fit: scale-down;
    }

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
    }

    
    

    

</style>