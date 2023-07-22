import {defineStore} from 'pinia';

import {fetchWrapper} from '@/helpers';

// const baseUrl = `http://localhost:3000/`;
const baseUrl = import.meta.env.VITE_BASE_URL;

export const useReportStore = defineStore({
    id: 'report',
    state: () => ({
        loading: false,
        repartidores: [],
        operaciones: [],
        operaciones_hoy: 0
    }),
    getters: {
        getRepartidores(state) {
            return state.repartidores;
        },
        getOperaciones(state) {
            console.log(state.operaciones)
            return state.operaciones;
        },
        getOperacionesCount(state) {
            return state.operaciones_hoy;
        },
        getTotalOperacionesUtilidad(state) {
            return state.operaciones.map(o => o.utilidad).reduce((a, b) => {
                return a + b;
            }, 0)
        },getTotalOperacionesCobro(state) {
            return state.operaciones.map(o => o.cobro).reduce((a, b) => {
                return a + b;
            }, 0)
        },getTotalKlts(state) {
            return state.operaciones.map(o => o.klts).reduce((a, b) => {
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
            this.operaciones = []

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
        async setOperaciones(start, end, idRepartidor) {
            this.loading = true;
            let URL = `${baseUrl}operations/ruta?start=${start}&end=${end}`
            if (idRepartidor)
                URL += `&idRuta=${idRepartidor}`;
            try {
                let s = await fetchWrapper.get(URL);
                console.log('Operaciones response->',s)
                this.operaciones = s
            } catch (error) {
                this.operaciones = []
                this.errord = {error};
                return false;
            } finally {
                this.loading = false;
                return !!this.operaciones.length;

                // console.log(this.catalogos)
            }
        },
        async setOperacionesCount(start, end, idRepartidor) {
            this.loading = true;
            let URL = `${baseUrl}operations/ruta/count?start=${start}&end=${end}`
            if (idRepartidor)
                URL += `&idRuta=${idRepartidor}`;
            try {
                let s = await fetchWrapper.get(URL);
                console.log('Operaciones count response->', s[0]?.operaciones_hoy)
                this.operaciones_hoy = s[0]?.operaciones_hoy
            } catch (error) {
                this.operaciones_hoy = 0
                this.errord = {error};
            } finally {
                this.loading = false;
                // console.log(this.catalogos)
            }
        },
    }
});