import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';

const baseUrl = `http://localhost:3000/ums`;
export const useUmStore = defineStore({
    id: 'ums',
    state: () => ({
        ums: {},
        um: {}
    }),
    actions: {
        async register(um) {
            await fetchWrapper.post(`${baseUrl}`, um);
        },
        async getAll() {
            this.ums = { loading: true };
            try {
                this.ums = await fetchWrapper.get(baseUrl);
            } catch (error) {
                this.ums = { error };
            }
        },
        async getById(id) {
            this.um = { loading: true };
            try {
                this.um = await fetchWrapper.get(`${baseUrl}/${id}`);
            } catch (error) {
                this.um = { error };
            }
        },
        async update(id, params) {
            await fetchWrapper.put(`${baseUrl}/${id}`, params);
        },
        async delete(id) {
            this.ums.find(x => x.id === id).isDeleting = true;
            await fetchWrapper.delete(`${baseUrl}/${id}`);
            this.ums = this.ums.filter(x => x.id !== id);
        }
    }
});