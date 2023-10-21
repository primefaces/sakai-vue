import {defineStore} from 'pinia';

import {fetchWrapper} from '@/helpers';
// import moment from "moment";
moment.locale('es-mx')
console.log('----', moment().format());
// const baseUrl = `http://localhost:3000/`;
const baseUrl = import.meta.env.VITE_BASE_URL;
const isProduction = baseUrl.includes('localhost') ? 0 : 1;
const documentStyle = getComputedStyle(document.documentElement);
const textColor = documentStyle.getPropertyValue('--text-color');
const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
// const documentStyle = getComputedStyle(document.documentElement);
// const textColor = documentStyle.getPropertyValue('--text-color');
// const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
// const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

const colors = [
    '#3E7874',
    '#4EA39E',
    '#71BDB8',
    '#55A39E',
    '#7AEAE3',
    '#58B8A5',
    '#43a047',
    '#388e3c',
    '#1b5e20',
    '#00e676',
    '#00c853',
    '#004d40',
    '#c8ff76',
    '#ddff00',
    '#aeff58',
    '#ffeb3b',
    '#fdd835',
    '#fbc02d'
]
const colors2 = [
    'rgba(62,120,116,0.44)',
    'rgba(78,163,158,0.48)',
    'rgba(113,189,184,0.45)',
    'rgba(85,163,158,0.47)',
    'rgba(122,234,227,0.48)',
    'rgba(88,184,165,0.47)',
    'rgba(67,160,71,0.47)',
    'rgba(56,142,60,0.5)',
    'rgba(27,94,32,0.45)',
    'rgba(0,230,118,0.42)',
    'rgba(0,200,83,0.44)',
    'rgba(0,77,64,0.45)',
    'rgba(200,255,118,0.5)',
    'rgba(221,255,0,0.5)',
    'rgba(174,255,88,0.51)',
    'rgba(255,235,59,0.45)',
    'rgba(253,216,53,0.49)',
    'rgba(251,192,45,0.45)'
]
export const useDashboardStore = defineStore({
    id: 'dashboard',
    state: () => ({
        operations: {},
        labels: [],
        data2: [],
        totales: {},
        modeCierres: 'semana',
        modeVentas: 'semana',
        isLoading: true,
        storeBarChartData: {
            labels: ['Sabado', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'],
            datasets: [
                {
                    type: 'bar',
                    label: 'Cobro',
                    backgroundColor: colors,
                    data: [0, 0, 0, 0, 0, 0]
                }
            ]
        },
        storeBarChartOptions: {
            maintainAspectRatio: false,
            aspectRatio: 0.9,
            interaction: {
                mode: 'x'
            },
            spanGaps: true,
            plugins: {
                tooltips: {
                    mode: 'index',
                    intersect: 'x'
                },
                legend: {
                    labels: {
                        boxWidth: 13,
                        boxHeight: 13,
                        font: {
                            size: 12
                        },
                        useBorderRadius: true,
                        borderRadius: 2,
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    stacked: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            },

        },
        storeChartData: {
            labels: ['Sabado', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'],
            datasets: []
        },
        storeChartOptions: {
            maintainAspectRatio: false,
            aspectRatio: 0.9,
            interaction: {
                mode: 'x'
            },
            plugins: {
                tooltips: {
                    mode: 'point',
                    intersect: 'x'
                },
                legend: {
                    labels: {
                        boxWidth: 8,
                        boxHeight: 8,
                        border:false,
                        font: {
                            size: 12
                        },
                        useBorderRadius: true,
                        borderRadius: 2,
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        },

        productsTop: []
    }),
    getters: {
        getDataFor(state) {
            return state.labels
        },
        getCobrosDia(state) {
            return state.totales.cobros
        },
        getKltsDia(state) {
            return state.totales.klts
        },
        getUtilidadDia(state) {
            return state.totales.utilidad
        },

        getComisionDia(state) {
            return state.totales.comision
        },

        getOperations(state) {
            return state.operations;
        },
        getLoading(state) {
            return state.isLoading
        },
        getProdTop(state) {
            return state.productsTop
        },
        getLineOptions(state) {
            return state.storeChartOptions;
        },
        getLineData(state) {
            return state.storeChartData;
        },
        getBarOptions(state) {
            return state.storeBarChartOptions;
        },
        getBarData(state) {
            return state.storeBarChartData;
        }
    },
    actions: {

        async register(product) {
            await fetchWrapper.post(`${baseUrl}`, product);
        },
        async getTopProducts() {
            const products = await fetchWrapper.get(baseUrl + 'operations/totales');
            console.log('\t[dashboardStore::getTopProducts] ', products)

        },
        async setOperationsVentas(dias) {
            const itmBase = []
            const info = []
            const itemsOperations = await fetchWrapper.get(baseUrl + 'operations/ventas?weekDesfase=' + dias);

            let agrupadoPorRepartidor = itemsOperations.reduce((result, {no_ruta, dte, total_klt}) => {

                const wd = moment(dte).add(isProduction, 'days').weekday()
                console.log('dayPos', no_ruta, wd, total_klt);
                if (!result[no_ruta])
                    result[no_ruta] = [0, 0, 0, 0, 0, 0, 0];

                result[no_ruta][wd] = total_klt;
                return result;
            }, {});


            // console.log('\t[dashboardStore::getOperationsVentas] ', itemsOperations)
            console.log('\t[dashboardStore::getOperationsVentas->porRepartidor] ', agrupadoPorRepartidor)

            for (const aKey in agrupadoPorRepartidor) {
                // console.log('aKey', aKey, agrupadoPorRepartidor[aKey])
                itmBase.push({
                    label: 'R-' + aKey,
                    data: agrupadoPorRepartidor[aKey].filter((a, i) => i !== 1),
                    fill: false,
                    borderColor: colors[itmBase.length],
                    backgroundColor: colors2[itmBase.length],
                    tension: 0.4
                })
                info.push({
                        label: 'R-' + aKey,
                        data: agrupadoPorRepartidor[aKey].filter((a, i) => i !== 1),
                        type: 'bar',
                        borderColor: colors[itmBase.length],
                        backgroundColor: colors[info.length],
                    }
                )
            }

            // console.log('\t[dashboardStore::getOperationsVentas->Final] ', itmBase)
            setTimeout(() => {
                this.storeChartData = {
                    labels: ['Sabado', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'],
                    datasets: itmBase
                }
                this.storeBarChartData = {
                    labels: ['Sabado', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'],
                    datasets: info
                }
                this.isLoading = false
                // console.log(this.storeBarChartData, this.st)
            }, 1000)
        },

        async getAll() {
            // const documentStyle = getComputedStyle(document.documentElement);
            this.isLoading = true;
            this.operacions = {loading: true};
            try {
                // this.labels = []
                let totales = await fetchWrapper.get(baseUrl + 'operations/totales');
                // let dats = await fetchWrapper.get(baseUrl + 'operations');
                console.log(totales)
                // let agrupadoPorFecha = dats.reduce((result, elemento) => {
                //     const date = moment(elemento.date).format('L');
                //     if (!result[date])
                //         result[date] = [];
                //     result[date].push(elemento);
                //     return result;
                // }, {});
                // console.log('dats', dats)
                // let agrupadoPorRepartidor = dats.reduce((result, elemento) => {
                //     const repartidor = elemento.repartidor;
                //     if (!result[repartidor])
                //         result[repartidor] = [0, 0, 0, 0, 0, 0];
                //     const dayPos = moment(elemento).diff(moment().startOf('week'), 'days');
                //     result[repartidor][dayPos] = elemento.totalMl;
                //     return result;
                // }, {});
                // let dataSemana = {}
                // let dataSemanaVentas = {}
                // for (let i = 0; i < 8; i++) {
                //     const currentLab = moment().startOf('week').add(i, 'days').format('L');
                //     console.log(currentLab, agrupadoPorFecha[`${currentLab}`])
                //
                //     dataSemanaVentas[`${currentLab}`] = agrupadoPorFecha[`${currentLab}`] ? agrupadoPorFecha[`${currentLab}`] : []
                // }
                // for (let i = 0; i < 8; i++) {
                //     console.log(agrupadoPorFecha[i])
                //     const currentLab = moment().startOf('week').add(i, 'days').format('L');
                //     dataSemana[`${currentLab}`] = agrupadoPorFecha[`${currentLab}`] ? agrupadoPorFecha[`${currentLab}`] : []
                // }
                // console.log('---agrupadoPorRepartidor', agrupadoPorRepartidor)
                // console.log('---fechas', dataSemana)
                // console.log('---agrupadoPorFecha', agrupadoPorFecha)
                // console.log('---sstartWeek', moment().diff(moment().startOf('week'), 'days'))
                //
                // // console.log(start)
                //
                // let formated = []
                // let formated2 = [
                //     {
                //         type: 'bar',
                //         label: 'Costo',
                //         backgroundColor: colors[0],
                //         data: []
                //     },
                //     {
                //         type: 'bar',
                //         label: 'Utilidad',
                //         backgroundColor: colors[2],
                //         data: []
                //     },
                //     {
                //         type: 'bar',
                //         label: 'Comisiones',
                //         backgroundColor: colors[4],
                //         data: []
                //     }
                // ]
                // for (const agrupadoKey in dataSemana) {
                //     const s = dataSemana[agrupadoKey].map(a => {
                //         return a.items.map(i => i.precio_compra * i.ventaPz).reduce((a, z) => {
                //             return a + z;
                //         }, 0)
                //     }).reduce((a, z) => {
                //         return a + z;
                //     }, 0)
                //     formated2[0].data.push(s)
                //     const ut = dataSemana[agrupadoKey].map(s => s.utilidad).reduce((a, z) => {
                //         return a + z;
                //     }, 0)
                //     formated2[1].data.push(ut)
                //     const com = dataSemana[agrupadoKey].map(s => s.comision).reduce((a, z) => {
                //         return a + z;
                //     }, 0)
                //     formated2[2].data.push(com)
                //     console.log('s', formated2)
                //
                // }
                // let cd = [...colors]
                // for (const agrupadoPorRepartidorKey in agrupadoPorRepartidor) {
                //     const color = cd.pop()
                //     formated.push({
                //         label: 'Ruta ' + agrupadoPorRepartidorKey,
                //         data: [...agrupadoPorRepartidor[agrupadoPorRepartidorKey]],
                //         fill: false,
                //         backgroundColor: color,
                //         borderColor: color,
                //         tension: 0.4
                //     })
                // }
                // console.log('---FORMATED', [...formated])
                // this.labels = [...formated];
                // this.operacions = dats
                // this.data2 = formated2
                this.totales = totales[0];
                setTimeout(() => {
                    this.isLoading = false
                }, 1000)
                console.log('isLoading')

            } catch (error) {
                console.log('catch', error)
                // this.operacions = {error};
                this.isLoading = false
                console.log('isLoading')
            } finally {
                this.isLoading = true
                setTimeout(() => {
                    this.isLoading = false
                }, 1000)
                console.log('isLoading')


            }
        },
        async getById(id) {
            this.product = {loading: true};
            try {
                this.product = await fetchWrapper.get(`${baseUrl}/${id}`);
            } catch (error) {
                this.product = {error};
            }
        },
        async setProductsTOP() {
            this.product = {loading: true};
            try {
                const respons = await fetchWrapper.get(`${baseUrl}productos/top`);
                console.log('...')
                console.log('....<.')
                console.log(respons)
                this.productsTop = respons
            } catch (error) {
                this.productsTop = [];
            }
        },
        async update(id, params) {
            await fetchWrapper.put(`${baseUrl}/${id}`, params);
        },

    }
});