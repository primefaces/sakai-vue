import {defineStore} from 'pinia';

import {fetchWrapper} from '@/helpers';

// const baseUrl = `http://localhost:3000/`;
const baseUrl = `https://api-sello.herokuapp.com/`;
export const useReportStore = defineStore({
    id: 'report',
    state: () => ({
        loading: false,
        repartidores: [],
        operaciones: []
    }),
    getters: {
        getRepartidores(state) {
            return state.repartidores;
        },
        getOperaciones(state) {
            console.log(state.operaciones)
            return state.operaciones;
        },
        getTotalOperacionesUtilidad(state) {
            return state.operaciones.map(o => o.utilidad).reduce((a, b) => {
                return a + b;
            }, 0)
        },getTotalOperacionesCobro(state) {
            return state.operaciones.map(o => o.cobro).reduce((a, b) => {
                return a + b;
            }, 0)
        },getTotalOperacionesComision(state) {
            return state.operaciones.map(o => o.comision).reduce((a, b) => {
                return a + b;
            }, 0)
        },
        isLoading(state) {
            return state.loading
        }
    },
    actions: {

        async setRepartidores() {
            this.loading = true;

            try {
                let s = await fetchWrapper.get(`${baseUrl}repartidores`);
                console.log(s)
                this.repartidores = s
            } catch (error) {
                this.repartidores = []
                this.errord = {error};
            } finally {
                this.loading = false;
                // console.log(this.catalogos)
            }
        },
        async setOperaciones(id, start, end) {
            this.loading = true;

            try {
                let s = await fetchWrapper.get(`${baseUrl}operations/ruta?start=${start}&end=${end}&idRuta=${id}`);
                console.log(s)
                this.operaciones = s
            } catch (error) {
                this.operaciones = []
                this.errord = {error};
            } finally {
                this.loading = false;
                // console.log(this.catalogos)
            }
        },
    }
});