import {defineStore} from 'pinia';

import {fetchWrapper} from '@/helpers';
// import moment from "moment";
moment.locale('es-mx')
console.log('----',moment().format());
// const baseUrl = `http://localhost:3000/`;
const baseUrl = import.meta.env.VITE_BASE_URL;
const documentStyle = getComputedStyle(document.documentElement);
const textColor = documentStyle.getPropertyValue('--text-color');
const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
// const documentStyle = getComputedStyle(document.documentElement);
// const textColor = documentStyle.getPropertyValue('--text-color');
// const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
// const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

const colors = ['#3E7874', '#4EA39E', '#71BDB8', '#55A39E', '#7AEAE3', '#58B8A5']
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
                    backgroundColor: colors[0],
                    data: [0, 0, 0, 0, 0, 0]
                }
            ]
        },
        storeBarChartOptions: {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    labels: {
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
            plugins: {
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    labels: {
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

        productsTop:[]
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
        async setOperationsVentas() {
            const itmBase = []
            const startW = moment().startOf('week')
            console.log('Start of week   ', startW)


            const itemsOperations = await fetchWrapper.get(baseUrl + 'operations/ventas');
        itemsOperations.forEach(it => {
            console.log(it.dte);
        });
            let agrupadoPorRepartidor = itemsOperations.reduce((result, {no_ruta, dte, klt}) => {
                const dayPos = moment(dte).add(1,'days').diff(startW, 'days');
                console.log('dayPos',dayPos);
                console.log('.weekday',moment(dte).add(1,'days').weekday());
            // console.log(dayPos);
                if (!result[no_ruta])
                    result[no_ruta] = [0, 0, 0, 0, 0, 0, 0];
                
            // console.log(dayPos);
                result[no_ruta][dayPos] = klt;
                return result;
            }, {});

        // console.log('\t[dashboardStore::getOperationsVentas] ', itemsOperations)
        // console.log('\t[dashboardStore::getOperationsVentas->porRepartidor] ', agrupadoPorRepartidor)

            for (const aKey in agrupadoPorRepartidor) {
            // console.log('aKey', aKey, agrupadoPorRepartidor[aKey])
                itmBase.push({
                    label: 'Ruta ' + aKey,
                    data: agrupadoPorRepartidor[aKey].filter((a, i) => i !== 1),
                    fill: false,
                    borderColor: colors[itmBase.length],
                    tension: 0.4
                })
            }
        // console.log('\t[dashboardStore::getOperationsVentas->Final] ', itmBase)
            setTimeout(() => {
            this.storeChartData = {
                labels: ['Sabado', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'],
                datasets: itmBase
            }
                this.isLoading = false
            }, 1000)
        },
        async setOperationsCierres() {
            const cierres = await fetchWrapper.get(baseUrl + 'operations/cobros');
            const startW = moment().startOf('week')

        // console.log('Start of week   ', startW)
        // console.log(baseUrl + 'operations/cobros')
        // console.log('\t[dashboardStore::getOperationsCierres] ', cierres)
            let agrupadoPorRepartidor = cierres.reduce((result, elemento) => {
                const {repartidor, DATE, cobro} = elemento;
                const dayPos = moment(DATE).add(1,'days').diff(startW, 'days');

                if (!result[repartidor])
                    result[repartidor] = [0, 0, 0, 0, 0, 0, 0];
                result[repartidor][dayPos] = cobro;
                return result;
            }, {});
        // console.log('\t[dashboardStore::getOperationsCierres-agropF] ', agrupadoPorRepartidor)
            const info = []
            for (const aKey in agrupadoPorRepartidor) {
                console.log('aKey', aKey, agrupadoPorRepartidor[aKey])
                info.push({
                        label: 'Ruta ' + aKey,
                        data: agrupadoPorRepartidor[aKey].filter((a, i) => i !== 1),
                        type: 'bar',
                        backgroundColor: colors[info.length],
                    }
                )
            }
            setTimeout(() => {
                this.storeBarChartData =  {
                    labels: ['Sabado', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'],
                    datasets: info
                }
                this.isLoading = false
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