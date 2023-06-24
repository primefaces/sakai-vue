import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';

// const baseUrl = `http://localhost:3000/`;
const baseUrl = `https://api-sello.herokuapp.com/`;

export const useDashboardStore = defineStore({
    id: 'dashboard',
    state: () => ({
        operations: {}
    }),
    getters: {
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
                this.operacions = await fetchWrapper.get(baseUrl + 'operations');
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