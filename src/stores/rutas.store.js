// eslint-disable-next-line
import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';

const baseUrl = `http://localhost:3000/rutas`;
export const useRutaStore = defineStore({
    id: 'rutas',
    state: () => ({
        rutas: {},
        ruta: {}
    }),
    actions: {
        async register(ruta) {
            await fetchWrapper.post(`${baseUrl}`, ruta);
        },
        async getAll() {
            this.rutas = { loading: true };
            try {
                this.rutas = await fetchWrapper.get(baseUrl);
            } catch (error) {
                this.rutas = { error };
            }
        },
        async getById(id) {
            this.ruta = { loading: true };
            try {
                this.ruta = await fetchWrapper.get(`${baseUrl}/${id}`);
            } catch (error) {
                this.ruta = { error };
            }
        },
        async update(id, params) {
            await fetchWrapper.put(`${baseUrl}/${id}`, params);
        },
        async delete(id) {
            this.rutas.find(x => x.id === id).isDeleting = true;
            await fetchWrapper.delete(`${baseUrl}/${id}`);
            this.rutas = this.rutas.filter(x => x.id !== id);
        }
    }
});