import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  // arrow function recommended for full type inference
  state: () => ({
    count: 10,

    otherObject: 'sjhadjhasjdha',
  }),

  getters: {
    oddOrEven: (state) => {
        if(state.count % 2 === 0) return 'even'
        return 'odd'
    }
  },

  actions: {
    increaseCount() {
        this.count++
    },
    decreaseCount() {
        this.count--
    } 
  }
})