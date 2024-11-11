<script setup>
import { getTotalAsesorias, getAsesoriasCountByUser, getAsesoriasCountByArea } from '../firebase/db/asesorias';
import { getTotalMaes } from '../firebase/db/users';
import { ref, onMounted } from 'vue';

const totalAsesorias = ref(0);
const totalMaes = ref(0);
const totalUsers = ref(0);
const totalUsersArea = ref([]);

// Cargar los datos cuando el componente se monta
onMounted(async () => {
    const [asesorias, maes, users, usersArea] = await Promise.all([
        getTotalAsesorias(),
        getTotalMaes(),
        getAsesoriasCountByUser(),
        getAsesoriasCountByArea()
    ]);
    
    totalAsesorias.value = asesorias;
    totalMaes.value = maes;
    totalUsers.value = users;
    totalUsersArea.value = usersArea;
    
    // Actualizar los datos de la gráfica una vez se haya cargado totalUsersArea
    barChartData.value = {
        labels: totalUsersArea.value.map(item => item.area), // Áreas
        datasets: [
            {
                label: 'Alumnos atendidos',
                backgroundColor: '#67C7E0', 
                borderRadius: 8,
                data: totalUsersArea.value.map(item => item.totalUniqueUsers) 
            },
            {
                label: 'Asesorías',
                backgroundColor: '#0156A9',
                borderRadius: 8,
                data: totalUsersArea.value.map(item => item.totalAsesorias) 
            },
            
        ]
    };
});

// Definir barChartData como un ref vacío inicialmente
const barChartData = ref({});

const barChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top'
        },
        tooltip: {
            callbacks: {
                label: function(tooltipItem) {
                    return tooltipItem.raw.toLocaleString(); // Formato de números en el tooltip
                }
            }
        }
    },
    scales: {
        x: {
            beginAtZero: true,
            grid: {
                color: '#FFFFFF' 
            }
        },
        y: {
            beginAtZero: true,
            grid: {
                color: '#FFFFFF' 
            }
        }
    }
};
</script>

<template>
    <div>
        <h1 class="text-black text-6xl font-bold mb-5 text-center sm:text-left">Estadísticas</h1>
    </div>
    <div class="w-full gap-8 flex flex-row">
        <div class="w-3 card p-4 flex flex-row h-8rem align-items-center ">
            <img src="/assets/mentoringAdmin.svg" class="border-circle h-4rem w-4rem p-3 mb-2 mr-3 " alt="flag icon"
                :style="{ background: '#DCFAF8' , }"/>
            <div>
                <p :class="['text-base font-bold m-0 text-black' ]">
                    Total de asesorías
                </p>
                <p class='text-xl font-medium m-0 text-black'>
                    {{ totalAsesorias }}
                </p>
            </div>
        </div>

        <div class="w-3 card p-4 flex flex-row h-8rem align-items-center ">
            <img src="/assets/gradAdmin.svg" class="border-circle h-4rem w-4rem p-3 mb-2 mr-3 " alt="flag icon"
                :style="{ background: '#FFE0EB' , }"/>
            <div>
                <p :class="['text-base font-bold m-0 text-black' ]">
                    Total de MAEs
                </p>
                <p class='text-xl font-medium m-0 text-black'>
                    {{ totalMaes }}
                </p>
            </div>
        </div>

        <div class="w-3 card p-4 flex flex-row h-8rem align-items-center ">
            <img src="/assets/heartAdmin.svg" class="border-circle h-4rem w-4rem p-3 mb-2 mr-3 " alt="flag icon"
                :style="{ background: '#E7EDFF' , }"/>
            <div>
                <p :class="['text-base font-bold m-0 text-black' ]">
                    Alumnos atendidos
                </p>
                <p class='text-xl font-medium m-0 text-black'>
                    {{ totalUsers }}
                </p>
            </div>
        </div>
    </div>
    <div class="card mt-5 p-4 w-6">
        <h3 class="text-black text-2xl font-bold mb-4">Asesorías y alumnos atendidos por área</h3>
        <Chart type="bar" :data="barChartData" :options="barChartOptions" />
    </div>
</template>

<style scoped>

</style>
