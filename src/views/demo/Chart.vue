<template>
    <div class="grid p-fluid">
        <div class="col-12 lg:col-6">
            <div class="card">
                <h5>Linear Chart</h5>
                <Chart type="line" :data="lineData" :options="lineOptions" />
            </div>

            <div class="card flex flex-column align-items-center">
                <h5 class="align-self-start">Pie Chart</h5>
                <Chart type="pie" :data="pieData" :options="pieOptions" style="width: 50%" />
            </div>

            <div class="card flex flex-column align-items-center">
                <h5 class="align-self-start">Polar Area Chart</h5>
                <Chart type="polarArea" :data="polarData" :options="polarOptions" style="width: 50%" />
            </div>
        </div>
        <div class="col-12 lg:col-6">
            <div class="card">
                <h5>Bar Chart</h5>
                <Chart type="bar" :data="barData" :options="barOptions" />
            </div>

            <div class="card flex flex-column align-items-center">
                <h5 class="align-self-start">Doughnut Chart</h5>
                <Chart type="doughnut" :data="pieData" :options="pieOptions" style="width: 50%" />
            </div>

            <div class="card flex flex-column align-items-center">
                <h5 class="align-self-start">Radar Chart</h5>
                <Chart type="radar" :data="radarData" :options="radarOptions" style="width: 50%" />
            </div>
        </div>
    </div>
</template>

<script>
import EventBus from '@/AppEventBus';

export default {
    themeChangeListener: null,
    mounted() {
        this.themeChangeListener = (event) => {
            if (event.dark) this.applyDarkTheme();
            else this.applyLightTheme();
        };
        EventBus.on('change-theme', this.themeChangeListener);

        if (this.isDarkTheme()) {
            this.applyDarkTheme();
        } else {
            this.applyLightTheme();
        }
    },
    beforeUnmount() {
        EventBus.off('change-theme', this.themeChangeListener);
    },
    data() {
        return {
            lineData: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                    {
                        label: 'First Dataset',
                        data: [65, 59, 80, 81, 56, 55, 40],
                        fill: false,
                        backgroundColor: '#2f4860',
                        borderColor: '#2f4860',
                        tension: 0.4
                    },
                    {
                        label: 'Second Dataset',
                        data: [28, 48, 40, 19, 86, 27, 90],
                        fill: false,
                        backgroundColor: '#00bb7e',
                        borderColor: '#00bb7e',
                        tension: 0.4
                    }
                ]
            },
            pieData: {
                labels: ['A', 'B', 'C'],
                datasets: [
                    {
                        data: [300, 50, 100],
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
                    }
                ]
            },
            polarData: {
                datasets: [
                    {
                        data: [11, 16, 7, 3, 14],
                        backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB'],
                        label: 'My dataset'
                    }
                ],
                labels: ['Red', 'Green', 'Yellow', 'Grey', 'Blue']
            },
            barData: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                    {
                        label: 'My First dataset',
                        backgroundColor: '#2f4860',
                        data: [65, 59, 80, 81, 56, 55, 40]
                    },
                    {
                        label: 'My Second dataset',
                        backgroundColor: '#00bb7e',
                        data: [28, 48, 40, 19, 86, 27, 90]
                    }
                ]
            },
            radarData: {
                labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
                datasets: [
                    {
                        label: 'My First dataset',
                        backgroundColor: 'rgba(179,181,198,0.2)',
                        borderColor: 'rgba(179,181,198,1)',
                        pointBackgroundColor: 'rgba(179,181,198,1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(179,181,198,1)',
                        data: [65, 59, 90, 81, 56, 55, 40]
                    },
                    {
                        label: 'My Second dataset',
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        pointBackgroundColor: 'rgba(255,99,132,1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(255,99,132,1)',
                        data: [28, 48, 40, 19, 96, 27, 100]
                    }
                ]
            },
            lineOptions: null,
            pieOptions: null,
            polarOptions: null,
            barOptions: null,
            radarOptions: null
        };
    },
    methods: {
        isDarkTheme() {
            return this.$appState.darkTheme === true;
        },
        applyLightTheme() {
            this.lineOptions = {
                plugins: {
                    legend: {
                        labels: {
                            color: '#495057'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#495057'
                        },
                        grid: {
                            color: '#ebedef'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#495057'
                        },
                        grid: {
                            color: '#ebedef'
                        }
                    }
                }
            };

            this.barOptions = {
                plugins: {
                    legend: {
                        labels: {
                            color: '#495057'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#495057'
                        },
                        grid: {
                            color: '#ebedef'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#495057'
                        },
                        grid: {
                            color: '#ebedef'
                        }
                    }
                }
            };

            this.pieOptions = {
                plugins: {
                    legend: {
                        labels: {
                            color: '#495057'
                        }
                    }
                }
            };

            this.polarOptions = {
                plugins: {
                    legend: {
                        labels: {
                            color: '#495057'
                        }
                    }
                },
                scales: {
                    r: {
                        grid: {
                            color: '#ebedef'
                        }
                    }
                }
            };

            this.radarOptions = {
                plugins: {
                    legend: {
                        labels: {
                            color: '#495057'
                        }
                    }
                },
                scales: {
                    r: {
                        grid: {
                            color: '#ebedef'
                        }
                    }
                }
            };
        },
        applyDarkTheme() {
            this.lineOptions = {
                plugins: {
                    legend: {
                        labels: {
                            color: '#ebedef'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#ebedef'
                        },
                        grid: {
                            color: 'rgba(160, 167, 181, .3)'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#ebedef'
                        },
                        grid: {
                            color: 'rgba(160, 167, 181, .3)'
                        }
                    }
                }
            };

            this.barOptions = {
                plugins: {
                    legend: {
                        labels: {
                            color: '#ebedef'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#ebedef'
                        },
                        grid: {
                            color: 'rgba(160, 167, 181, .3)'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#ebedef'
                        },
                        grid: {
                            color: 'rgba(160, 167, 181, .3)'
                        }
                    }
                }
            };

            this.pieOptions = {
                plugins: {
                    legend: {
                        labels: {
                            color: '#ebedef'
                        }
                    }
                }
            };

            this.polarOptions = {
                plugins: {
                    legend: {
                        labels: {
                            color: '#ebedef'
                        }
                    }
                },
                scales: {
                    r: {
                        grid: {
                            color: 'rgba(160, 167, 181, .3)'
                        }
                    }
                }
            };

            this.radarOptions = {
                plugins: {
                    legend: {
                        labels: {
                            color: '#ebedef'
                        }
                    }
                },
                scales: {
                    r: {
                        grid: {
                            color: 'rgba(160, 167, 181, .3)'
                        }
                    }
                }
            };
        }
    }
};
</script>
