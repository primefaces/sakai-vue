import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';

// const baseUrl = `http://localhost:3000/`;
const baseUrl = import.meta.env.VITE_BASE_URL;


export const useDashboardStore = defineStore({
    id: 'dashboard',
    state: () => ({
        operations: {},
        labels:[]
    }),
    getters: {
        getDataFor(state){


    return state.labels

        },
        getOperations(state) {
            return state.operations;
        },
        isLoading(state) {
            return state.loading
        }
    },
    actions: {
        async register(product) {
            await fetchWrapper.post(`${baseUrl}`, product);
        },
        async getAll() {
            this.operacions = { loading: true };
            try {
                let dats = await fetchWrapper.get(baseUrl + 'operations');
                console.log(dats.data.head)
                const agrupadoPorRepartidor = dats.data.head.reduce((result, elemento) => {
                    const repartidor = elemento.repartidor;
                    if (!result[repartidor]) {
                        result[repartidor] = [];
                    }
                    result[repartidor].push(elemento.cobro);
                    return result;
                }, {});
                console.log('---',agrupadoPorRepartidor)

                let formated = []
                for (const agrupadoPorRepartidorKey in agrupadoPorRepartidor) {
                    console.log(agrupadoPorRepartidorKey)
                    formated.push({
                        label:  'Ruta ' + agrupadoPorRepartidorKey,
                        data: agrupadoPorRepartidor[agrupadoPorRepartidorKey],
                        fill: false,
                        backgroundColor: 'rgba(28,206,138,0.46)',
                        borderColor: 'rgba(28,206,138,0.72)',
                        tension: 0.4
                    })
                }
                console.log('---',formated)
                this.operacions = dats.data.head

                this.labels = formated;
            } catch (error) {
                this.operacions = { error };
            }
        },
        async getById(id) {
            this.product = { loading: true };
            try {
                this.product = await fetchWrapper.get(`${baseUrl}/${id}`);
            } catch (error) {
                this.product = { error };
            }
        },
        async update(id, params) {
            await fetchWrapper.put(`${baseUrl}/${id}`, params);
        },

    }
});