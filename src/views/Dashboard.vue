<script setup>
import { getTotalAsesorias, getAsesoriasCountByUser, getAsesoriasCountByArea, getAsesoriasCountByCampus } from '../firebase/db/asesorias';
import { getTotalMaes } from '../firebase/db/users';
import { ref, onMounted } from 'vue';

const totalAsesorias = ref(0);
const totalMaes = ref(0);
const totalUsers = ref(0);
const totalUsersArea = ref([]);
const totalAsesoriasCampus = ref([]);
const loading = ref(true);

onMounted(async () => {
    const [asesorias, maes, users, usersArea, asesoriasCampus] = await Promise.all([
        getTotalAsesorias(),
        getTotalMaes(),
        getAsesoriasCountByUser(),
        getAsesoriasCountByArea(),
        getAsesoriasCountByCampus()
    ]);
    
    totalAsesorias.value = asesorias;
    totalMaes.value = maes;
    totalUsers.value = users;
    totalUsersArea.value = usersArea;
    totalAsesoriasCampus.value = asesoriasCampus;
    
    barChartData.value = {
        labels: totalUsersArea.value.map(item => item.area),
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

    barChartData2.value = {
        labels: totalAsesoriasCampus.value.map(item => item.campus),
        datasets: [
            {
                label: 'Total de Asesorías',
                backgroundColor: totalAsesoriasCampus.value.map((_, index) => {
                    const colors = ['#0156A9', '#1D7EBE', '#3AA2D3', '#67C7E0'];
                    return colors[index % colors.length];
                }),
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#003A6E',
                data: totalAsesoriasCampus.value.map(item => item.totalAsesorias)
            }
        ]
    };

    loading.value = false;  // Cambia el estado a falso una vez que los datos están listos
});


// Definir barChartData como un ref vacío inicialmente
const barChartData = ref({});
const barChartData2 = ref({});

const barChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top'
        },
        tooltip: {
            callbacks: {
                label: function(tooltipItem) {
                    return tooltipItem.raw.toLocaleString(); 
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

const barChartOptions2 = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
            labels: {
                font: {
                    size: 14
                }
            }
        },
        // Aquí agregamos el plugin datalabels para mostrar etiquetas fijas
        datalabels: {
            anchor: 'end',
            align: 'right', // Puedes cambiarlo a 'start' o 'center' según la preferencia
            color: '#000', // Cambia el color según tu diseño
            font: {
                weight: 'bold',
                size: 12
            },
            formatter: function(value) {
                return value.toLocaleString(); // Formatear el número
            },
            clip: false // Esto asegura que el número no sea recortado si la barra es corta
        }
    },
    scales: {
        x: {
            beginAtZero: true,
            grid: {
                color: '#FFFFFF' 
            },
            ticks: {
                display: true,
                font: {
                    size: 12
                }
            }
        },
        y: {
            grid: {
                color: '#FFFFFF' 
            },
            ticks: {
                display: true,
                font: {
                    size: 12,
                    autoSkip: false // Esto asegurará que todas las etiquetas sean visibles
                }
            }
        }
    }
};


</script>

<template>
    <div>
        <h1 class="text-black text-6xl font-bold mb-5 text-center sm:text-left">Estadísticas</h1>
    </div>

    <div v-if="loading" class="w-full h-screen flex justify-content-center ">
        <ProgressSpinner style="width: 60px; height: 60px; animation: spin-fast 0.5s linear infinite;" strokeWidth="6" fill="var(--surface-ground)" />
    </div>

    <div v-else class="w-full gap-8 flex flex-row">
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

    <div v-if="!loading"  class="flex flex-row gap-8">
        <div class="card mt-5 p-4 w-6">
            <h3 class="text-black text-2xl font-bold mb-4">Asesorías y alumnos atendidos por área</h3>
            <Chart type="bar" :data="barChartData" :options="barChartOptions" />
        </div>

        <div class="card mt-5 p-4 w-6">
            <h3 class="text-black text-2xl font-bold mb-4">Estadísticas de asesorías por campus</h3>
            <Chart type="bar" :data="barChartData2" :options="barChartOptions2" />
        </div>
    </div>
</template>
