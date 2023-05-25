import { defineStore } from "pinia";
export const useFlagsStore = defineStore("flags", {
  state: () => ({
    active: true 
  }),
  getters: {
    isShowSplash(status) {
      return status.active;
    }

  },
  actions: {
    setShowSplash(show) {
      console.log('\tsetShowSplash', show);
      this.active = show;
    }
  },
});
