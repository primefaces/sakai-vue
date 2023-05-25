import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';

const baseUrl = `http://localhost:3000/itemOperacions`;
export const useItemOperacionStore = defineStore({
    id: 'itemOperacions',
    state: () => ({
        itemOperacions: {},
        itemOperacion: {}
    }),
    actions: {
        async register(itemOperacion) {
            await fetchWrapper.post(`${baseUrl}`, itemOperacion);
        },
        async getAll() {
            this.itemOperacions = { loading: true };
            try {
                this.itemOperacions = await fetchWrapper.get(baseUrl);
            } catch (error) {
                this.itemOperacions = { error };
            }
        },
        async getById(id) {
            this.itemOperacion = { loading: true };
            try {
                this.itemOperacion = await fetchWrapper.get(`${baseUrl}/${id}`);
            } catch (error) {
                this.itemOperacion = { error };
            }
        },
        async update(id, params) {
            await fetchWrapper.put(`${baseUrl}/${id}`, params);
        },
        async delete(id) {
            this.itemOperacions.find(x => x.id === id).isDeleting = true;
            await fetchWrapper.delete(`${baseUrl}/${id}`);
            this.itemOperacions = this.itemOperacions.filter(x => x.id !== id);
        }
    }
});