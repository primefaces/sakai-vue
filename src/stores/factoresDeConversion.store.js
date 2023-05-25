import { fetchWrapper } from '@/helpers';
import {defineStore} from "pinia";

const baseUrl = `http://localhost:3000/factoresDeConversions`;
export const useFactoresDeConversionStore = defineStore({
    id: 'factoresDeConversions',
    state: () => ({
        factoresDeConversions: {},
        factoresDeConversion: {}
    }),
    actions: {
        async register(factoresDeConversion) {
            await fetchWrapper.post(`${baseUrl}`, factoresDeConversion);
        },
        async getAll() {
            this.factoresDeConversions = { loading: true };
            try {
                this.factoresDeConversions = await fetchWrapper.get(baseUrl);
            } catch (error) {
                this.factoresDeConversions = { error };
            }
        },
        async getById(id) {
            this.factoresDeConversion = { loading: true };
            try {
                this.factoresDeConversion = await fetchWrapper.get(`${baseUrl}/${id}`);
            } catch (error) {
                this.factoresDeConversion = { error };
            }
        },
        async update(id, params) {
            await fetchWrapper.put(`${baseUrl}/${id}`, params);
        },
        async delete(id) {
            this.factoresDeConversions.find(x => x.id === id).isDeleting = true;
            await fetchWrapper.delete(`${baseUrl}/${id}`);
            this.factoresDeConversions = this.factoresDeConversions.filter(x => x.id !== id);
        }
    }
});