<template>
  <div class="container" v-if="getUserData?.role_id!==null">
    <NavHeader :activeIndex=2 />
<div class="background">

    <h1 class="title">Dashboard</h1>
    <br />
    <div class="login_info">
      <p v-if="isUserLoggedIn">Użytkownik jest zalogowany</p>
      <p v-else>Użytkownik nie jest zalogowany</p>
    </div>
  </div>
  </div>
  <div class="container" v-else-if="getUserData?.role_id===null">
    <NavHeader :activeIndex="1" />
    <a>
      Nie masz dostępu do tej strony.
    </a>
  </div>
</template>
<script>
import Vuex, { mapState } from "vuex";
require('dotenv').config();
const serverip = process.env.SERVER_IP;
Vue.use(Vuex)
import { mapGetters } from "vuex";
import Vue from "vue";

export default {
  name: 'dashboardPage',
  components: [
    'ItemTile',
    'NavHeader',
  ],
  computed: {
    ...mapGetters(['getUserData']),
    ...mapState(['users']),
    isUserLoggedIn() {
      return this.token;
    },
  },
  data() {
    return {
      userId: null,
      token: null,
      errorPath: '/error',
    };
  },
  async mounted() {
    this.token = Vue.$cookies?.get('token');
    await this.$store?.dispatch('idFromCookies');
    await this.$store?.dispatch('fetchUserData');
    if(this.getUserData?.role_id===null) {
      await this.$router.push(this.errorPath);
    }
  }
};
</script>

<style>
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
.title{

  margin-top: 5%;
  color: black;
  display: flex;
  justify-content: center;
  font-family: 'Open Sans', sans-serif;

  margin-bottom: 5%;
  width:100%;
  font-size: 400%;
}
.login_info{
  padding-left: 4%;
  padding-top: 1%;

}

</style>
