<template>

<div class="backgroundLost">
  <p class="lostmessage">Ups... Chyba zabłądziłeś</p>
  <a v-if="this.getUserData?.role_id!==null" href="/dashboard">kliknij tutaj aby wrócić do strony głównej</a>
  <a v-else href="/">kliknij tutaj aby wrócić do logowania</a>
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
    };
  },
  async mounted() {
    this.token = Vue.$cookies?.get('token');
    await this.$store?.dispatch('idFromCookies');
    await this.$store?.dispatch('fetchUserData');
  }
};
</script>

<style>
.backgroundLost{

  position: absolute;
  margin-left: 70vh;
  margin-top: 40vh;
}
.lostmessage{
  color: black;
  font-weight: bold;
  font-size: 5rem;
}
</style>
