import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';

const baseUrl = `http://localhost:3000/grupos`;
export const useGrupoStore = defineStore({
    id: 'grupos',
    state: () => ({
        loading:true,
        grupos: {},
        grupo: {}
    }),
    actions: {
        async register(grupo) {
            await fetchWrapper.post(`${baseUrl}`, grupo);
        },
        async getAll() {
            this.grupos = { loading: true };
            try {
                this.grupos = await fetchWrapper.get(baseUrl);    
            } catch (error) {
                this.grupos = { error };
            }
        },
        async getById(id) {
            this.grupo = { loading: true };
            try {
                this.grupo = await fetchWrapper.get(`${baseUrl}/${id}`);
            } catch (error) {
                this.grupo = { error };
            }
        },
        async update(id, params) {
            await fetchWrapper.put(`${baseUrl}/${id}`, params);
        },
        async delete(id) {
            this.grupos.find(x => x.id === id).isDeleting = true;
            await fetchWrapper.delete(`${baseUrl}/${id}`);
            this.grupos = this.grupos.filter(x => x.id !== id);
        }
    }
});