import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';

const baseUrl = `http://localhost:3000/products`;
export const useProductStore = defineStore({
    id: 'products',
    state: () => ({
        products: {},
        product: {}
    }),
    actions: {
        async register(product) {
            await fetchWrapper.post(`${baseUrl}`, product);
        },
        async getAll() {
            this.products = { loading: true };
            try {
                this.products = await fetchWrapper.get(baseUrl);
            } catch (error) {
                this.products = { error };
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
        async delete(id) {
            this.products.find(x => x.id === id).isDeleting = true;
            await fetchWrapper.delete(`${baseUrl}/${id}`);
            this.products = this.products.filter(x => x.id !== id);
        }
    }
});