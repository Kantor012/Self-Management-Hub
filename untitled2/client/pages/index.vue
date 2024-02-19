<template>
  <div class="containerLogin" v-if="getUserData?.role_id==null">

    <div class="LoginFormBackground">
      <div class="loginFirst">
      <div class="bccolor">
        <form method="POST" class="formLogin" @submit.prevent="login">
          <div class="form2">
          <div>
            <label class="label" for="username">Username:</label>
            <input type="text" id="username" v-model="username" required />
          </div>
          <div>
            <label class="label" for="password">Password:  </label>
            <input type="password" id="password" v-model="password" required />
          </div>

            <button class="submit" type="submit">Login</button>
          </div>
                  </form>
        <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Vue from 'vue';
import VueCookies from 'vue-cookies';
import Vuex, { mapGetters, mapState } from "vuex";
require('dotenv').config();
Vue.use(Vuex)

Vue.use(VueCookies);

export default {
  name: 'indexPage',
  components: [
    'ItemTile',
    'NavHeader',
  ],
  data() {
    return {
      token: null,
      breadcrumbItems: {
        'index': { 'label': 'Index', 'url': '/' },
      },
      username: '',
      password: '',
      errorMessage: '',
      errorPath: '/error',
    };

  },
  computed: {
    ...mapGetters(['getUserData']),
    ...mapState(['users']),
    isUserLoggedIn() {
      return this.token;
    },
  },
  mounted() {
    this.token = Vue.$cookies?.get('token');
    this.$store?.dispatch('idFromCookies');
    this.$store?.dispatch('fetchUserData');
    if(this.getUserData?.role_id!==null) {
      this.$router.push(this.errorPath);
    }
  },
  methods: {
    login(event) {
      event.preventDefault()
      event.stopPropagation()

      const loginData = {
        username: this.username,
        password: this.password,
      }

      axios
        .post(`${process.env.SERVER_IP}/v1/login`, loginData)
        .then((response) => {
          // Zalogowano pomyślnie
          const user = response.data.user;
          const token = response.data.token;
          console.log(response.data.user.id);
          const id = response.data.user.id;
          this.$store.commit('setUser', user);
          this.$store.commit('setToken', token);
          Vue.$cookies.set('token', token, '2h');
          Vue.$cookies.set('userId', id, '2h');
          setTimeout(() => {
            this.$router.push('/dashboard')
          }, 3000)
        })
        .catch((error) => {
          // Błąd logowania
          this.errorMessage = error.response.data.error
        })
    },
  },
};
</script>

<style scoped>
.error{
  background-color: white;
  border: red;
  position: absolute;
  bottom: 1rem;
  font-size: large;
  color: red;
}

.bccolor{
  background-color: #eeeeee;
  display: flex;
  margin: 0 auto;
  margin-top: 8px;
  justify-content: center;
  width: 95%;
  height: 95%;
  border-radius: 5px 20px 5px;
  position: relative;
}
.form2{


  width: 80%;
  margin: 5rem auto;

}
.loginFirst{

  font-weight: 700;
  position: absolute;
  top:0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 5px 20px 5px;
  margin: auto;
  font-family: Serif;
  justify-content: center;
  text-align:center;
  width: 20%;
  height: 40%;
  color: cornflowerblue;
  border-collapse: collapse;
  background: linear-gradient(135deg, cornflowerblue, rgba(150, 129, 149, 0.98));
  box-shadow: 5px 5px 10px 2px rgba(0,0,0,.2);
}
.label{
  font-size: x-large;
  font-family: serif;
}
.submit{

  background: linear-gradient(135deg, cornflowerblue, rgba(150, 129, 149, 0.98));
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;

  font-size: 16px;
  border-radius: 10%;
  box-shadow: 5px 5px 10px 2px rgba(0,0,0,.2);
  justify-content: center;
  margin-top: 5rem;

}
.submit:hover{

  background-color: lightblue;
  font-size: 20px;
}

.containerLogin{
  justify-content: center;
  display: flex;
  max-height: 80%;

}

</style>
