<template>
  <div class="container">
    <NavHeader :activeIndex="1" />
    <div class="background">
      <div class="login" v-if="getUserData?.role_id === 2">
        <h1 class="useraddtitle">Rejestracja nowego użytkownika</h1>
        <form method="POST" @submit.prevent="login">
          <div>
            <label class="label" for="username">Login: </label>
            <input class="input" type="text" id="username" v-model="username" required />
          </div>
          <div>
            <label class="label" for="email">Email: </label>
            <input class="input"
              type="text"
              id="email"
              v-model="email"
              placeholder="example@gmail.com"
              pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
              required
            />
          </div>
          <div>
            <label class="label" for="password">Hasło: </label>
            <input class="input"
              type="password"
              id="password"
              v-model="password"
              pattern="{5,}"
              required
            />
          </div>
          <div>
            <label class="label" for="name">Imię: </label>
            <input class="input"
              type="text"
              id="name"
              v-model="name"
              placeholder="Jan"
              required
            />
          </div>
          <div>
            <label class="label" for="surname">Nazwisko: </label>
            <input class="input"
              type="text"
              id="surname"
              v-model="surname"
              placeholder="Kowalski"
              required
            />
          </div>
          <div>
            <label class="label" for="phone">Numer Telefonu: </label>
            <input class="input"
              type="tel"
              id="phone"
              v-model="phone"
              placeholder="123456789"
              pattern="[0-9]{9}"
              required
            />
          </div>
          <div>
            <button class="submit" type="submit">Utwórz konto</button>
          </div>
        </form>

        <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
      </div>
      <div class="login" v-else>
        <NavHeader :activeIndex="1" />
        <a>
          Nie masz dostępu do tej strony.
        </a>
      </div>
    </div>
  </div>

</template>

<script>
import axios from 'axios'
import Vue from 'vue'
import VueCookies from 'vue-cookies'
import Vuex, { mapGetters, mapState } from 'vuex'
require('dotenv').config()
const serverip = process.env.SERVER_IP
Vue.use(Vuex)

Vue.use(VueCookies)

export default {
  name: 'login',
  data() {
    return {
      token: null,
      username: '',
      email: '',
      password: '',
      name: '',
      surname: '',
      phone: '',
      role_id: 0,
      errorMessage: '',
      errorPath: '/error'
    }
  },
  computed: {
    ...mapGetters(['getUserData']),
    ...mapState(['users']),
    isUserLoggedIn() {
      return this.token
    },
  },
  mounted() {
    this.token = Vue.$cookies?.get('token')
    this.$store?.dispatch('fetchUserData')
    if(this.getUserData?.role_id!==2) {
      this.$router.push(this.errorPath);
    }
  },
  methods: {
    login(event) {
      event.preventDefault()
      event.stopPropagation()

      const registerData = {
        username: this.username,
        password: this.password,
        email: this.email,
        name: this.name,
        surname: this.surname,
        phone: this.phone,
        role_id: 0,
      }

      axios
        .post(`${process.env.SERVER_IP}/v1/register`, registerData)
        .then(() => {
          setTimeout(() => {
            this.$router.push('/users')
          }, 3000)
        })
        .catch((error) => {
          // Błąd logowania
          this.errorMessage = error.response.data.error
        })
    },
  },
}
</script>

<style scoped>
.noPrivilagesBackground{
  border-radius: 5px 20px 5px;
  width: 90%;
  height: 80vh;
  background: #eeeeee;
  box-shadow: 5px 5px 10px 2px rgba(0,0,0,.2);
  margin-left: 5rem;
  margin-top: 5rem;
  padding-top: 5rem;
}
.noPrivilageMessage{
  font-size: xxx-large;
  font-weight: bold;
  color: black;
  margin-left: 5rem;
  margin-top: 30rem;
}
.noPrivilageMessageButton{

  background: #7197ff;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  margin-top: 1rem;
  margin-left: 5rem;
  box-shadow: 5px 5px 10px 2px rgba(0, 0, 0, 0.2);
  border-radius: 10%;
}
.noPrivilageMessageButton:hover {
  color: black;
  background-color: lightblue;
}
.useraddtitle{
  margin-left: 3rem;
  margin-bottom: 1rem;

}

.background{
  width: 90%;
  color: white;
  background: linear-gradient(135deg, cornflowerblue, rgba(150, 129, 149, 0.98));
  display: block;
  justify-content: center;
  border-radius: 5px 20px 5px;
  box-shadow: 5px 5px 10px 2px rgba(0,0,0,.2);
  min-height: 90vh;
  padding-top: 1rem;
  margin-top: 2rem;

}
.login {
  color: black;
  position: relative;
  border-radius: 5px 20px 5px;
  font-weight: 700;
  max-width: 40%;
  padding-top: 2%;
  margin-left: 5rem;
  height: 45vh;
  margin-top: 5rem;
  font-size: large;
  background: #eeeeee;
  box-shadow: 5px 5px 10px 2px rgba(0,0,0,.2);
}

.label {
  font-size: x-large;
  font-family: Serif;
  margin-left: 3rem;

}
.submit {
  position: absolute;
  right: 3rem;
  background: #7197ff;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin-top: 5%;
  margin-bottom: 5%;
  border-radius: 10%;
  box-shadow: 5px 5px 10px 2px rgba(0,0,0,.2);
}

.submit:hover {
  color: black;
  background-color: lightblue;
}


.input{
  float: right;
  padding-left: 1%;
  margin-top: 0.7rem;
  margin-right: 3rem;
  width: 65%;
}



</style>
