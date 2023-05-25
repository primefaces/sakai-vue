import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';

const baseUrl = `http://localhost:3000/familias`;
export const useFamiliaStore = defineStore({
    id: 'familias',
    state: () => ({
        familias: {},
        familia: {}
    }),
    actions: {
        async register(familia) {
            await fetchWrapper.post(`${baseUrl}`, familia);
        },
        async getAll() {
            this.familias = { loading: true };
            try {
                this.familias = await fetchWrapper.get(baseUrl);
            } catch (error) {
                this.familias = { error };
            }
        },
        async getById(id) {
            this.familia = { loading: true };
            try {
                this.familia = await fetchWrapper.get(`${baseUrl}/${id}`);
            } catch (error) {
                this.familia = { error };
            }
        },
        async update(id, params) {
            await fetchWrapper.put(`${baseUrl}/${id}`, params);
        },
        async delete(id) {
            this.familias.find(x => x.id === id).isDeleting = true;
            await fetchWrapper.delete(`${baseUrl}/${id}`);
            this.familias = this.familias.filter(x => x.id !== id);
        }
    }
});