import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    token: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    clearUser(state) {
      state.user = null
    },
  },
  actions: {
    login({ commit }, user) {
      // Set the user data in the store
      commit('setUser', user)
    },
    logout({ commit }) {
      // Clear the user data in the store
      commit('clearUser')
    },
  },
  getters: {
    isUserLoggedIn(state) {
      return state.user;
    },
  },
})
