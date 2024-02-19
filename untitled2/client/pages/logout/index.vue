<template>
  <div class="container" v-if="getUserData?.role_id!==null">
    <NavHeader :activeIndex=3 />
<div class="background">
    <h2 class="titlelogout">Czy na pewno wylogować?</h2>
    <form method="POST" class="form" @submit.prevent="logout">
      <button class="logout" type="submit">Wyloguj</button>
    </form>
  </div>
  </div>
  <div class="container" v-else>
    <NavHeader :activeIndex="1" />
    <a>
      Nie masz dostępu do tej strony.
    </a>
  </div>
</template>
<script>
import Vue from 'vue';
import VueCookies from 'vue-cookies';
import Vuex, { mapGetters, mapMutations, mapState } from "vuex";
import axios from 'axios';
require('dotenv').config();
const serverip = process.env.SERVER_IP;
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
      userId: null,
      token: null,
      errorPath: '/error'
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
    if(this.getUserData?.role_id===null) {
      this.$router.push(this.errorPath);
    }
  },
  methods: {
    ...mapMutations(['clearUser', 'setUser']),
    ...mapState(["user"]),
    logout(e) {
      e.preventDefault();
      e.stopPropagation();
      const TokenData = {
        userToken: this.$cookies.get('token'),
        userId: this.$cookies.get('userId')
      }
      axios
        .post(`${process.env.SERVER_IP}/v1/logout`, TokenData)
        .then((response) => {
          this.$store.commit('clearUser');
          this.token = Vue.$cookies.remove('token');
          this.userId = Vue.$cookies.remove('userId');

          setTimeout(() => {
            this.$router.push('/');
          }, 3000)
        });
    }
  },
};


</script>

<style>
.background{
  position: relative;
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
.titlelogout{
  position: absolute;
  right: 3rem;

  top: 3rem;
}
.logout{
  position: absolute;
  right: 3rem;
  top: 3rem;
  background: #7197ff;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 10%;
  box-shadow: 5px 5px 10px 2px rgba(0,0,0,.2);
}

.logout:hover{
  color: black;
  background-color: lightblue;

}
.form{
  position: absolute;
  top: 7rem;
  right: 10rem;

}


</style>
