import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';

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
        isLoading(state){
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
                this.errord = { error };
            }
            finally {
                this.loading = false;
                // console.log(this.catalogos)
            }
        },
        async setOperaciones(id,start, end) {
            this.loading = true;

            try {
                let s = await fetchWrapper.get(`${baseUrl}operations/ruta/${id}`);
                console.log(s)
                this.operaciones = s
            } catch (error) {
                this.operaciones = []
                this.errord = {  error };
            }
            finally {
                this.loading = false;
                // console.log(this.catalogos)
            }
        },
    }
});