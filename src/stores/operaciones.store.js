import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';

// const baseUrl = `http://localhost:3000/`;
const baseUrl = import.meta.env.VITE_BASE_URL;



export const useOperacionStore = defineStore({
    id: 'operacions',
    state: () => ({
        operacions: {},
        operacion: {},
        itemsOperacion:[]
    }),
    actions: {
        async register(operacion) {
            await fetchWrapper.post(`${baseUrl}`, operacion);
        },
        async getAll() {
            this.operacions = { loading: true };
            this.itemsOperacion = [];

            try {
                this.operacions = await fetchWrapper.get(`${baseUrl}operations` );
            } catch (error) {
                this.operacions = { error };
            }
        },

        async getItemsById(opn) {
            this.operacion = opn
            this.itemsOperacion = [];
            try {
                // this.itemsOperacion = await fetchWrapper.get(`${baseUrl}item_operacion/byOperacion/${opn.id}`);
                this.itemsOperacion = this.operacions.find(o => o.id === opn.id).items;
            console.log( this.itemsOperacion)
            } catch (error) {
                this.itemsOperacion = [];
            }
        },
        async getById(id) {
            this.operacion = { loading: true };
            try {
                this.operacion = await fetchWrapper.get(`${baseUrl}operations/${id}`);
            } catch (error) {
                this.operacion = { error };
            }
        },
        async update(id, params) {
            await fetchWrapper.put(`${baseUrl}operations/${id}`, params);
        },
        async delete(id) {
            this.operacions.find(x => x.id === id).isDeleting = true;
            await fetchWrapper.delete(`${baseUrl}operations/${id}`);
            this.operacions = this.operacions.filter(x => x.id !== id);
        }
    }
});