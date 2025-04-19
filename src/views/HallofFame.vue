<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';

// Carousel data and controls
const activeIndex = ref(0);
const autoplayInterval = ref(null);
const transitionActive = ref(false);

// Format name function to ensure it's limited to 2 blocks
const formatName = (name) => {
  if (!name) return '';
  const words = name.split(' ');
  return words.slice(0, 2).join(' '); // Limit to two words
};

// Dummy data for honor students
const honorStudents = ref([
  {
    id: 1,
    name: 'María González López del Valle',
    photoURL: null,
    career: 'Ingeniería en Sistemas',
    points: 3500,
    achievements: ['Mejor Promedio', 'Excelencia Académica']
  },
  {
    id: 2,
    name: 'Carlos Alberto Rodríguez Hernández',
    photoURL: null,
    career: 'Medicina',
    points: 3200,
    achievements: ['Investigación Destacada']
  },
  {
    id: 3,
    name: 'Ana Martínez',
    photoURL: null,
    career: 'Derecho',
    points: 3100,
    achievements: ['Líder Estudiantil']
  },
  {
    id: 4,
    name: 'Jorge Alejandro Hernández Gutiérrez',
    photoURL: null,
    career: 'Arquitectura',
    points: 2950,
    achievements: ['Proyecto Innovador']
  },
  {
    id: 5,
    name: 'Sofía Isabela Castro Ramírez',
    photoURL: null,
    career: 'Psicología',
    points: 2800,
    achievements: ['Servicio Comunitario']
  },
  {
    id: 6,
    name: 'Luis Fernando Morales',
    photoURL: null,
    career: 'Economía',
    points: 2750,
    achievements: ['Mejor Orador']
  }
]);

// Group students in threes for the carousel
const groupedStudents = computed(() => {
  const groups = [];
  for (let i = 0; i < honorStudents.value.length; i += 3) {
    groups.push(honorStudents.value.slice(i, i + 3));
  }
  return groups;
});

// Carousel controls
const nextSlide = () => {
  if (transitionActive.value) return;
  transitionActive.value = true;
  activeIndex.value = (activeIndex.value + 1) % groupedStudents.value.length;
  setTimeout(() => {
    transitionActive.value = false;
  }, 600);
};

const prevSlide = () => {
  if (transitionActive.value) return;
  transitionActive.value = true;
  activeIndex.value = activeIndex.value === 0 
    ? groupedStudents.value.length - 1 
    : activeIndex.value - 1;
  setTimeout(() => {
    transitionActive.value = false;
  }, 600);
};

const startAutoplay = () => {
  stopAutoplay();
  autoplayInterval.value = setInterval(() => {
    nextSlide();
  }, 4000);
};

const stopAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value);
    autoplayInterval.value = null;
  }
};

// Start autoplay when component mounts
onMounted(() => {
  startAutoplay();
});

// Clean up on component unmount
onBeforeUnmount(() => {
  stopAutoplay();
});
</script>

<template>
  <div class="honor-hall-container">
    <!-- Hall of Honor Content -->
    <div class="hall-content">
      <div class="flex flex-column md:flex-row justify-content-between align-items-center mb-4">
        <div class="flex flex-column align-items-start">
          <h1 class="text-black text-5xl font-bold text-center m-0 sm:text-left mb-3">Sala de Honor</h1>
          <div class="bg-white border-round-3xl p-2 px-4 flex flex-row justify-content-center">
            <img src="/assets/mundo.svg" class="mr-3 mt-1" alt="world icon" style="width: 1.5rem; height: 1.5rem;" />
            <p class="text-xl">Estudiantes destacados</p>
          </div>
        </div>
      </div>

      <!-- Carousel -->
      <div class="carousel-container mt-4 relative">
        <button @click="prevSlide" class="carousel-control prev-btn">
          <i class="pi pi-chevron-left"></i>
        </button>
        
        <div class="carousel-wrapper">
          <div 
            class="carousel-slide-container" 
            :style="{transform: `translateX(-${activeIndex * 100}%)`}"
            :class="{'transition-transform': transitionActive}"
          >
            <div 
              v-for="(group, groupIndex) in groupedStudents" 
              :key="groupIndex"
              class="carousel-slide flex justify-content-center gap-6"
            >
              <div 
                v-for="student in group" 
                :key="student.id"
                class="student-card surface-card p-5 border-round shadow-2 flex flex-column align-items-center"
                :class="{'slide-enter-active': transitionActive}"
              >
                <div class="img-container mb-4">
                  <img 
                    :src="student.photoURL || '/assets/lego.jpg'"
                    :alt="`Foto de ${student.name}`"
                    class="border-circle border-gold" 
                  />
                </div>
                <h3 class="text-2xl font-bold mb-2 text-center name-container">{{ formatName(student.name) }}</h3>
                <p class="text-600 mb-3 text-center">{{ student.career }}</p>
                <div class="flex align-items-center justify-content-center gap-2 mb-4">
                  <i class="pi pi-star-fill text-yellow-500"></i>
                  <p class="font-bold text-primary text-xl m-0">{{ student.points }} EXP</p>
                </div>
                
                <div class="achievements mt-2 w-full">
                  <span 
                    v-for="(achievement, i) in student.achievements" 
                    :key="i"
                    class="achievement-badge bg-primary-100 text-primary border-round-2xl px-3 py-1 mr-2 mb-2 inline-block"
                  >
                    <i class="pi pi-check-circle mr-1"></i>
                    {{ achievement }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button @click="nextSlide" class="carousel-control next-btn">
          <i class="pi pi-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.honor-hall-container {
  padding: 2.5rem;
  min-height: 100vh;
}

/* Name container to ensure consistent spacing */
.name-container {
  min-height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  display: -webkit-box;
}

/* Carousel styles */
.carousel-container {
  position: relative;
  overflow: hidden;
  padding: 2rem 0;
}

.carousel-wrapper {
  overflow: hidden;
  width: 100%;
  border-radius: 1rem;
}

.carousel-slide-container {
  display: flex;
  width: 100%;
  transition-duration: 0.6s;
  transition-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
}

.carousel-slide {
  flex: 0 0 100%;
  padding: 1.5rem 0;
}

.student-card {
  flex: 1;
  max-width: 320px;
  transition: all 0.5s ease;
  position: relative;
  overflow: hidden;
}

.student-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.img-container {
  position: relative;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.img-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.student-card:hover .img-container img {
  transform: scale(1.08);
}

.carousel-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: white;
  border: none;
  border-radius: 50%;
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.carousel-control:hover {
  background-color: #3B82F6;
  color: white;
  transform: translateY(-50%) scale(1.1);
}

.prev-btn {
  left: 15px;
}

.next-btn {
  right: 15px;
}

.border-gold {
  border: 4px solid #FFD700;
}

/* Animation classes */
.transition-transform {
  transition: transform 0.6s cubic-bezier(0.33, 1, 0.68, 1);
}

.slide-enter-active {
  animation: slide-in 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.achievement-badge {
  transition: all 0.3s ease;
}

.achievement-badge:hover {
  background-color: #dbeafe;
  transform: translateY(-2px);
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Add responsive styles */
@media (max-width: 768px) {
  .carousel-slide {
    padding: 1rem 0;
  }
  
  .student-card {
    max-width: 280px;
  }
  
  .img-container {
    width: 120px;
    height: 120px;
  }
  
  .carousel-control {
    width: 3rem;
    height: 3rem;
  }
}

@media (max-width: 576px) {
  .honor-hall-container {
    padding: 1.5rem;
  }
  
  .carousel-slide {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .student-card {
    margin-bottom: 1.5rem;
  }
}
</style>