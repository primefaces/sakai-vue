import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';

const baseUrl = `http://localhost:3000/ums`;
export const useRepartidoresStore = defineStore({
    id: 'repartidores',
    state: () => ({
        repartidores: {},
        repartidore: {}
    }),
    actions: {
        async register(repartidore) {
            await fetchWrapper.post(`${baseUrl}`, repartidore);
        },
        async getAll() {
            this.repartidores = { loading: true };
            try {
                this.repartidores = await fetchWrapper.get(baseUrl);
            } catch (error) {
                this.repartidores = { error };
            }
        },
        async getById(id) {
            this.repartidore = { loading: true };
            try {
                this.repartidore = await fetchWrapper.get(`${baseUrl}/${id}`);
            } catch (error) {
                this.repartidore = { error };
            }
        },
        async update(id, params) {
            await fetchWrapper.put(`${baseUrl}/${id}`, params);
        },
        async delete(id) {
            this.repartidores.find(x => x.id === id).isDeleting = true;
            await fetchWrapper.delete(`${baseUrl}/${id}`);
            this.repartidores = this.repartidores.filter(x => x.id !== id);
        }
    }
});