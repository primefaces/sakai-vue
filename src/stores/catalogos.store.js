import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';

// const baseUrl = `http://localhost:3000/`;
const baseUrl = `https://api-sello.herokuapp.com/`;
export const useCatalogosStore = defineStore({
    id: 'catalogos',
    state: () => ({
        loading: false,
        errord: {},
        catalogos: [],
        catalogo: {}
    }),
    getters: {
        dataCatalog(state) {
            return state.catalogos;
        },
        isError(state){
            return state.catalogo
        },
        isLoading(state){
            return state.loading
        }
    },
    actions: {
        async register(frgm, catalogo) {
            await fetchWrapper.post(`${baseUrl}`, catalogo);
        },
        async getAll(frgm) {
            this.loading = true;

            try {
                let s = await fetchWrapper.get(`${baseUrl}${frgm}`);
                // console.log(s)
                this.catalogos = s
            } catch (error) {
                this.errord = { error };
            }
            finally {
                this.loading = false;
                // console.log(this.catalogos)
            }
        },
        async getById(frgm) {
            this.loading = true;

            this.catalogo = { loading: true };
            try {
                this.catalogo = await fetchWrapper.get(`${baseUrl}${frgm}/${id}`);
            } catch (error) {
                this.catalogo = { error };
            }
            this.loading = false;

        },
        async update(frgm, id, params) {
            this.catalogo = { loading: true };
            try {
                this.catalogo = await fetchWrapper.put(`${baseUrl}${frgm}/${id}`, params);
            } catch (error) {
                this.catalogo = { error };
            }
            this.loading = false;

        },
        async delete(frgm,id) {
            this.loading = true;

            this.catalogos.find(x => x.id === id).isDeleting = true;
            await fetchWrapper.delete(`${baseUrl}${frgm}/${id}`);
            this.catalogos = this.catalogos.filter(x => x.id !== id);
            this.loading = false;
        }
    }
});