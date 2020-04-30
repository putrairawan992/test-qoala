import Vue from 'vue';
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export const store = new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    cardArr: null
  },
  mutations: {
    saveCardArr(state, card) {
      console.log('card', card);
      
      state.cardArr = card;
    }
  }
})