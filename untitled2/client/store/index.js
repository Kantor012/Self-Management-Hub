import Vue from 'vue'
import VueCookies from 'vue-cookies'
import Vuex from 'vuex'
import axios from 'axios';
require('dotenv').config();
const serverip = process.env.SERVER_IP;
Vue.use(Vuex)
Vue.use(VueCookies)
Vue.$cookies.config('1h') // Set cookie expiration time, e.g., 7 days

const info = {
  user: {
    id: null,
    name: null,
    surname: null,
    email: null,
    phone: null,
    role_id: null,
    role_name: null,
    token: null,
    isUserLoggedIn: false,
  },


};
export const state = () => ({
  users: { ...info },
  notifications: [],
});

export const getters = {
  // userLoggedIn(state) {
  //   return state.users.user.isUserLoggedIn;
  // },
  getUserData(state) {
    return state.users.user;
  }
};

export const mutations = {
  setUser(state, user) {
    //console.log("user: "+JSON.stringify(user));
    state.users.user = user;
    state.users.user.isUserLoggedIn = true;
  },
  setToken(state, token) {
    state.users.user.token = token;
  },
  clearUser(state) {
    const userData = {
      id: null,
      name: null,
      surname: null,
      email: null,
      phone: null,
      role_id: null,
      role_name: null,
      token: null,
      isUserLoggedIn: false,
    }
    state.users.user = userData;
  },
  ADD_NOTIFICATION(state, notification) {
    state.notifications.push(notification);
  },
  REMOVE_NOTIFICATION(state, id) {
    state.notifications = state.notifications.filter((notification) => notification.id !== id);
  },
};
export const actions = {
  async fetchUserData({ commit }) {
    const userId = Vue.$cookies.get('userId');
    if (userId!=null) {
      try {
        const response = await axios.get(
          `${process.env.SERVER_IP}/v1/users/${userId}`,
          {
            headers: {
              Authorization: Vue.$cookies.get('token'),
            },
          }
        )
        const response_role = await axios.get(`${process.env.SERVER_IP}/v1/roles/${response.data.role_id}`);
        if (response_role) {
          response.data.role_name = response_role.data.role_name
        }
        commit('setUser', response.data)
      } catch (error) {
        console.error('Błąd podczas pobierania danych użytkownika:', error)
      }
    }
  },
  async idFromCookies({ commit }) {
    const userId = Vue.$cookies.get('userId');
    if(userId!=null) {
      const response = await axios.get(`${process.env.SERVER_IP}/v1/users/${userId}`);
      if (response) {
        const userData = {
          id: response.data.id,
          name: response.data.name,
          surname: response.data.surname,
          email: response.data.email,
          phone: response.data.phone,
          role_id: response.data.role_id,
          role_name: null,
        }
        const response_role = await axios.get(`${process.env.SERVER_IP}/v1/roles/${userData.role_id}`);
        if (response_role) {
          userData.role_name = response_role.data.role_name
        }
        commit('setUser', userData);
      }
    }
  },
  addNotification({ commit }, notification) {
    // Przykład użycia: this.$store.dispatch('addNotification', { id: 1, message: 'Nowe powiadomienie' });
    commit('ADD_NOTIFICATION', notification);
  },
}


