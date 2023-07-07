import {defineStore} from 'pinia';

import {fetchWrapper} from '@/helpers';
// import moment from "moment";
moment.locale('es-mx')
// const baseUrl = `http://localhost:3000/`;
const baseUrl = import.meta.env.VITE_BASE_URL;

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
        isLoading:true
    }),
    getters: {
        getDataFor(state) {
            return state.labels
        },
        getCobrosDia(state) {
            return state.totales.cobros
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
        }
    },
    actions: {
        async register(product) {
            await fetchWrapper.post(`${baseUrl}`, product);
        },
        async getAll() {
            // const documentStyle = getComputedStyle(document.documentElement);
            this.isLoading = true;
            this.operacions = {loading: true};
            try {
                // this.labels = []
                let totales = await fetchWrapper.get(baseUrl + 'operations/totales');
                let dats = await fetchWrapper.get(baseUrl + 'operations');
                console.log(dats)
                let agrupadoPorFecha = dats.reduce((result, elemento) => {
                    const date = moment(elemento.date).format('L');
                    if (!result[date])
                        result[date] = [];
                    result[date].push(elemento);
                    return result;
                }, {});
                console.log('dats', dats)
                let agrupadoPorRepartidor = dats.reduce((result, elemento) => {
                    const repartidor = elemento.repartidor;
                    if (!result[repartidor])
                        result[repartidor] = [0,0,0,0,0,0];
                    const dayPos = moment().diff(moment().startOf('week'), 'days');
                    result[repartidor][dayPos] = elemento.totalMl;
                    return result;
                }, {});
                let dataSemana = {}
                for (let i = 0; i < 8; i++) {
                    const currentLab = moment().startOf('week').add(i, 'days').format('L');
                    dataSemana[`${currentLab}`] = agrupadoPorFecha[`${currentLab}`] ? agrupadoPorFecha[`${currentLab}`] : []
                }
                console.log('---agrupadoPorRepartidor', agrupadoPorRepartidor)
                console.log('---fechas', dataSemana)
                console.log('---agrupadoPorFecha', agrupadoPorFecha)
                console.log('---sstartWeek', moment().diff(moment().startOf('week'), 'days'))


                let formated = []
                let formated2 = [
                    {
                        type: 'bar',
                        label: 'Costo',
                        backgroundColor: colors[0],
                        data: []
                    },
                    {
                        type: 'bar',
                        label: 'Utilidad',
                        backgroundColor: colors[2],
                        data: []
                    },
                    {
                        type: 'bar',
                        label: 'Comisiones',
                        backgroundColor: colors[4],
                        data: []
                    }
                ]
                for (const agrupadoKey in dataSemana) {
                    const s = dataSemana[agrupadoKey].map(a => {
                        return  a.items.map(i => i.precio_compra * i.ventaPz).reduce((a, z) => {
                            return a + z;
                        }, 0)
                    }).reduce((a, z) => {
                            return a + z;
                        }, 0)
                    formated2[0].data.push(s)
                    const ut = dataSemana[agrupadoKey].map(s => s.utilidad).reduce((a, z) => {
                        return a + z;
                    }, 0)
                    formated2[1].data.push(ut)
                    const com = dataSemana[agrupadoKey].map(s => s.comision).reduce((a, z) => {
                        return a + z;
                    }, 0)
                    formated2[2].data.push(com)
                    console.log('s',formated2)

                }
                let cd = [...colors]
                for (const agrupadoPorRepartidorKey in agrupadoPorRepartidor) {
                    const color = cd.pop()
                    formated.push({
                        label: 'Ruta ' + agrupadoPorRepartidorKey,
                        data: [...agrupadoPorRepartidor[agrupadoPorRepartidorKey]],
                        fill: false,
                        backgroundColor: color,
                        borderColor: color,
                        tension: 0.4
                    })
                }
                console.log('---FORMATED',[...formated])
                this.labels = [...formated];
                this.operacions = dats
                this.data2 = formated2
                this.totales = totales[0];
                this.isLoading = false
            } catch (error) {
                console.log('catch', error)
                this.operacions = {error};
                this.isLoading = false
            }
            finally {
                this.isLoading = true
                this.isLoading = false

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
        async update(id, params) {
            await fetchWrapper.put(`${baseUrl}/${id}`, params);
        },

    }
});