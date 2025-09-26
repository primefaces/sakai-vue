<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';

// Carousel data and controls
const activeIndex = ref(0);
const autoplayInterval = ref(null);
const transitionActive = ref(false);

// Honor students data
const honorStudents = ref([
  { 
    id: 1, 
    name: 'Juan Pablo Vargas', 
    photoURL: null, 
    description: 'Borrego de Oro, Precursor de la antigua pagina'
  }, 
  { 
    id: 2, 
    name: 'Bernardo de la Sierra y Jinelle Flores', 
    photoURL: '/assets/BernayJinelle.jpg', 
    description: 'Desarrollador y diseñador de la página, Ganadores de Expoingenerias Dic 2024'
  }, 
  { 
    id: 3, 
    name: 'Luis Angel Guzmán', 
    photoURL: null, 
    description: 'Precursor de la página actual, Desarrolló el sistema de base de datos'
  }, 
  { 
    id: 4, 
    name: 'Rodrigo Arroyo', 
    photoURL: '/assets/Rodri.jpg', 
    description: 'Mejor mae 2 años seguidos, Mejor coordinador 2 años seguidos'
  }, 
  { 
    id: 5, 
    name: 'Diego Rodriguez', 
    photoURL: null, 
    description: 'Mejor mae de Ingenería durante varios años, Tester de la página antigua'
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
  }, 7000); // 7 seconds as requested
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
    <h2 class="hall-title">Sala de honor</h2>
    
    <!-- Carousel -->
    <div class="carousel-container">
      <button @click="prevSlide" class="carousel-control prev-btn">
        <span class="control-icon">&lt;</span>
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
            class="carousel-slide"
          >
            <div 
              v-for="student in group" 
              :key="student.id"
              class="student-card"
            >
              <div class="img-container">
                <img 
                  :src="student.photoURL || '/assets/lego.jpg'"
                  :alt="`Foto de ${student.name}`"
                  class="student-photo"
                />
              </div>
              <div class="student-info">
                <h3 class="student-name">{{ student.name }}</h3>
                <p class="student-description">{{ student.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <button @click="nextSlide" class="carousel-control next-btn">
        <span class="control-icon">&gt;</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.honor-hall-container {
  padding: 2rem;
  width: 100%;
}

.hall-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
  padding-left: 0.5rem;
}

/* Carousel styles */
.carousel-container {
  position: relative;
  overflow: hidden;
  padding: 0.5rem 0;
}

.carousel-wrapper {
  overflow: hidden;
  width: 100%;
}

.carousel-slide-container {
  display: flex;
  width: 100%;
  transition-duration: 0.6s;
  transition-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
}

.carousel-slide {
  flex: 0 0 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: flex-start;
}

.student-card {
  background-color: white;
  border-radius: 12px;
  overflow: auto;
  width: calc(33.33% - 1rem);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  min-width: 200px;
  padding: 25px;
}

.img-container {
  width: 100%;
  height: auto;
  padding-top: 100%; /* 1:1 Aspect Ratio */
  position: relative;
  border-radius: 8px;

}

.student-photo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;

}

.student-info {
  padding-top: 1rem;
}

.student-name {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.7rem 0;
}

.student-description {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

.carousel-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: white;
  border: none;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.carousel-control:hover {
  background-color: #f0f0f0;
}

.control-icon {
  font-size: 1.2rem;
  font-weight: bold;
}

.prev-btn {
  left: 10px;
}

.next-btn {
  right: 10px;
}

/* Animation classes */
.transition-transform {
  transition: transform 0.6s cubic-bezier(0.33, 1, 0.68, 1);
}

@media (max-width: 768px) {
  .student-card {
    width: calc(50% - 0.75rem);
  }
}

@media (max-width: 576px) {
  .student-card {
    width: 100%;
  }
}
</style>