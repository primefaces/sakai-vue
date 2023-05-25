import { defineStore } from "pinia";
import json from "./../views/utilities/products.json";
export const useCaptuas = defineStore("capturas", {
  state: () => ({
    products: json,
    tipyng: String,
  }),
  getters: {
    getAcrtive(state) {
      return state.products.length;
    },
    productsSearchCode(state, code) {
      return code =>
            state.products.filter((product) => product.code.startsWith(code));
    },
    productsCheaperThan(state) { 
        return (price) =>
            state.products.filter((product) => product.price < price);
    },
  },
  actions: {
    addProduct(product) {
      this.products.push(product);
    },

    sendSearchCode(typed) {
      this.tipyng = typed;
    },
  },
});
