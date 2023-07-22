import {defineStore} from "pinia";
import json from "./../views/utilities/products.json";
import {fetchWrapper} from "@/helpers";

// const baseUrl = `http://localhost:3000/`;
// const baseUrl = `https://api-sello.herokuapp.com/`;
const baseUrl = import.meta.env.VITE_BASE_URL;

export const useCaptuaraStore = defineStore("capturas", {
    state: () => ({
        products: [],
        rutas: [],
        loading: false,
        currentOperation:{},
        operations:[],
        repartidores: [],
        procuct: {},
        salidaCajas: 0,
        salidaPiezas: 0,
        regresoCajas: 0,
        regresoPiezas: 0,
        typing: '',
    }),
    getters: {

        getRutas(state) {
            return state.rutas;
        },
        isLoading(state) {
            return state.loading;
        },
        getRepartidores(state) {
            return state.repartidores;
        },
        getProducts(state) {
            return state.products;
        },
        getActive(state) {
            return state.products.length;
        },
        getSalidaCajas(state) {
            return state.salidaCajas;
        },
        getSalidaPiezas(state) {
            return state.salidaPiezas;
        },

        getProducto(state) {
            return state.procuct
        },
        getSalidaTotal(state) {
            const {salidaPiezas, salidaCajas, product} = state;
            if (!product) {
                return 0;
            }
            const cantCaja = product.cant_caja ?? 0;

            return salidaPiezas + (salidaCajas * cantCaja);
        },
        getRegresoCajas(state) {
            return state.regresoCajas;
        },
        getRegresoPiezas(state) {
            return state.regresoPiezas;
        },
        getRegresoTotal(state) {
            const {regresoPiezas, regresoCajas, product} = state;

            if (!product) {
                return 0;
            }

            const cantCaja = product.cant_caja ?? 0;

            return regresoPiezas + (regresoCajas * cantCaja);
        },
        getProductsSearchCode({products}, tipingStr) {
            return code => {
                const searchStr = tipingStr.toLowerCase();

                return products.filter(({code, description}) => {
                    const lowerCaseCode = code.toLowerCase();
                    const lowerCaseDescription = description.toLowerCase();

                    return lowerCaseCode.startsWith(code) || lowerCaseDescription.startsWith(searchStr);
                });
            };
        },
        getVentaSaldoTotal(state) {
            const {SalidaPiezas, SalidaCajas, RegresoPiezas, RegresoCajas, product} = state;

            if (!product) {
                return 0;
            }

            const {cant_caja, precio_lista} = product;

            const totalSalida = (SalidaPiezas + (SalidaCajas * cant_caja));
            const totalRegreso = (RegresoPiezas + (RegresoCajas * cant_caja));

            return (totalSalida + totalRegreso) * precio_lista;
        },

        async searchCode(event) {
            if (!event.query.trim().length) {
                return this.products.slice(0, 4);
            } else {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        const filtered = this.products.filter((p) => {
                            return (
                                p.code.toLowerCase().startsWith(event.query.toLowerCase()) ||
                                p.descripcion.toLowerCase().startsWith(event.query.toLowerCase())
                            );
                        });
                        resolve(filtered);
                    }, 300);
                });
            }
        },

    },
    actions: {
        async setProducts(frgm) {
            this.loading = true;

            try {
                let data = await fetchWrapper.get(`${baseUrl}${frgm}`);
                this.products = data.map(d => ({...d, nameCode: `[${d.code}] ${d.description.trim()}`}));
                // console.log(this.products)
                // this.products = data.map(d => Object.assign(d, {nameCode: `[${d.code}] ${d.description} caja X${d.cant_caja}`}))
            } catch (error) {
                this.errord = {error};
            } finally {
                this.loading = false;
                // console.log(this.catalogos)
            }
        },
        quitProd(product) {
                const i = this.products.indexOf(product)
            // console.log(                    this.products[i])
            this.products.splice(i,1)
            //
            // console.log('new length qui', this.products.length)
        },
        addProd(product) {
            this.products.unshift(product)// console.log('new length add', this.products.unshift(product))
        },
        async setRutas(frgm) {
            this.loading = true;

            try {
                let data = await fetchWrapper.get(`${baseUrl}${frgm}`);
                // console.log(s)
                this.rutas = data
            } catch (error) {
                this.errord = {error};
            } finally {
                this.loading = false;
                // console.log(this.catalogos)
            }
        },
        async setRepartidores(frgm) {
            // console.log(' setRepartidores')
            this.loading = true;

            try {
                console.log(`${baseUrl}${frgm}`)
                let data = await fetchWrapper.get(`${baseUrl}${frgm}`);
                // console.log(data)|
                this.repartidores = data
            } catch (error) {
                // console.log(error)
                this.errord = {error};
            } finally {
                this.loading = false;
                // console.log(this.catalogos)
            }
        },
        async saveOperation(operation) {
            this.loading = true;
            console.log(operation)
            try {
                let {data} = await fetchWrapper.post(`${baseUrl}operations/complete`, operation);
                console.log('-',data)
                let resp
                if(data){
                    resp = await fetchWrapper.get(`${baseUrl}operations/${data}`);
                }
                else
                    throw new Error('No se guardo')
                    console.log(resp)
                return true
            } catch (error) {
                this.errord = {error};
                console.log(error)
            } finally {
                setTimeout(()=>{
                this.loading = false;
                    return true
                }, 2000)
                // console.log(this.catalogos)
            }
        },
        async updateOperation(operation) {
            this.loading = true;
            console.log(operation)
            try {
                let {data} = await fetchWrapper.put(`${baseUrl}operations/complete/${operation.id}`, operation);
                console.log('-',data)
                return true
            } catch (error) {
                this.errord = {error};
                console.log(error)
            } finally {
                setTimeout(()=>{
                this.loading = false;
                    return true
                }, 2000)
                // console.log(this.catalogos)
            }
        },
    },
});
