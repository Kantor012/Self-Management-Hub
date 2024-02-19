<template>
  <header class="header">
    <nav class="navbar">
      <router-link v-if="isUserLoggedIn" :to="{ path: '/dashboard' }" class="header__link__dashboard" :class="{ 'header__link--active': activeIndex === 2 }">
        <i class="fa-solid fa-star"></i>
        <span>Self Management Hub</span>
      </router-link>
      <router-link v-if="!isUserLoggedIn" :to="{ path: '/' }" class="header__login" :class="{ 'header__login--active': activeIndex === 1 }">
        <i class="fa-solid fa-gears"></i>
        <span>Login</span>
      </router-link>

      <button v-if="isUserLoggedIn && this.getUserData?.role_id!==0" class="header__link" :class="{ 'header__link--active': activeIndex === 5 }" @mouseover.stop="toggleWorktableNavbar">
        Zespół
      </button>
      <button v-if="isUserLoggedIn && this.getUserData?.role_id!==0" class="header__link" :class="{ 'header__link--active': activeIndex === 7  }" @mouseover.stop="toggleRequestNavbar">
        HR
      </button>
      <button v-if="isUserLoggedIn && this.getUserData?.role_id!==0" class="header__link" :class="{ 'header__link--active': activeIndex === 8  }" @mouseover.stop="toggleITNavbar">
        IT
      </button>


      <router-link v-show="isUserLoggedIn" :to="{ path: '/account' }" class="header__link__account" :class="{ 'header__link--active': activeIndex === 4 }" @click="account">
        <i class="fa-solid fa-star"></i>
        <span>Konto</span>
      </router-link>
      <router-link v-show="isUserLoggedIn" :to="{ path: '/logout' }" class="header__login" :class="{ 'header__login--active': activeIndex === 3 }" @click="logout">
        <i class="fa-solid fa-star"></i>
        <span>Wyloguj</span>
      </router-link>
    </nav>

    <nav v-if="this.showWorktableNavbar" class="second-navbar" @mouseleave="showWorktableNavbar = false">
      <router-link v-if="isUserLoggedIn && this.getUserData?.role_id!==0" :to="{ path: '/Worktable' }" class="header__link" :class="{ 'header__link--active': activeIndex === 5 }">
        <i class="fa-solid fa-gauge-high"></i>
        <span>harmonogram</span>
      </router-link>
    </nav>
    <nav v-if="this.showRequestNavbar" class="second-navbar" @mouseleave="showRequestNavbar = false">

      <router-link v-if="isUserLoggedIn && this.getUserData?.role_id!==0" :to="{ path: '/requests/viewRequests' }" class="header__link" :class="{ 'header__link--active': activeIndex === 7 }">
        <i class="fa-solid fa-gauge-high"></i>
        <span>Wyświetl Wnioski</span>
      </router-link>
    </nav>
    <nav v-if="this.showITNavbar" class="second-navbar" @mouseleave="showITNavbar = false">
      <router-link v-if="isUserLoggedIn && this.getUserData?.role_id!==0" :to="{ path: '/helpdesk/viewtickets' }" class="header__link" :class="{ 'header__link--active': activeIndex === 8 }">
        <i class="fa-solid fa-gauge-high"></i>
        <span>Wyświetl zgłoszenia</span>
      </router-link>

      <router-link v-if="isUserLoggedIn && this.getUserData?.role_id!==0" :to="{ path: '/orders/view' }" class="header__link" :class="{ 'header__link--active': activeIndex === 11 }">
        <i class="fa-solid fa-gauge-high"></i>
        <span>Sprzęt</span>
      </router-link>
      <router-link v-if="isUserLoggedIn && this.getUserData?.role_id === 2" :to="{ path: '/users' }" class="header__link" :class="{ 'header__link--active': activeIndex === 13 }">
        <i class="fa-solid fa-gauge-high"></i>
        <span>Użytkownicy</span>
      </router-link>
    </nav>
  </header>
</template>

<script>
import account from "@/pages/account/index.vue";

require('dotenv').config();
const serverip = process.env.SERVER_IP;
import { mapMutations, mapGetters, mapActions, mapState } from 'vuex';
import Vuex from 'vuex'
Vue.use(Vuex)
import axios from "axios";
import Vue from 'vue';
import VueCookies from 'vue-cookies';

Vue.use(VueCookies);
Vue.$cookies.config('2h');
export default {
  name: 'NavHeader',
  props: {
    activeIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      userId: null,
      token: null,
      showAccountNavbar: false,
      showWorktableNavbar: false,
      showRequestNavbar: false,
      showITNavbar: false,
    };
  },

  computed: {
    account() {
      return account
    },
    isUserLoggedIn() {
      return this.token;
    },
    ...mapState(['users']),
    ...mapGetters(['getUserData']),
  },
  async mounted() {
    this.token = Vue.$cookies.get('token');
    this.userId = Vue.$cookies.get('userId');
    await this.$store.dispatch('idFromCookies');
    await this.$store.dispatch('fetchUserData');
  },
  methods: {

    ...mapMutations(['clearUser', 'setUser']),
    //...mapActions(['logout']),
    ...mapState(["user"]),

    toggleWorktableNavbar() {
      this.showAccountNavbar = false;
      this.showRequestNavbar = false;
      this.showITNavbar = false;
      this.showWorktableNavbar = !this.showWorktableNavbar;
      console.log(this.showWorktableNavbar);
    },
    toggleRequestNavbar() {
      this.showWorktableNavbar = false;
      this.showAccountNavbar = false;
      this.showITNavbar = false;
      this.showRequestNavbar = !this.showRequestNavbar;
      console.log(this.showRequestNavbar);
    },
    toggleITNavbar() {
      this.showWorktableNavbar = false;
      this.showAccountNavbar = false;
      this.showRequestNavbar = false;
      this.showITNavbar = !this.showITNavbar;
      console.log(this.showRequestNavbar);
    },
    logout(e) {
      e.preventDefault();
      e.stopPropagation();
      const userToken = this.$cookies.get('token')
      console.log("token : " + userToken)
      axios
        .post(`${serverip}/v1/logout`, userToken)
        .then(() => {
          this.$store.commit('clearUser');
          this.userId = Vue.$cookies.remove('userId');
          this.token = Vue.$cookies.remove('token');

          setTimeout(() => {
            this.$router.push('/');
          }, 3000)
        });
    },
  },
}
</script>

<style scoped>


.header__link {
  color: black;
  font-weight: 700;
  display: block;
  padding: 1.6rem 2.4rem;
  transition: all 0.2s;
  width: fit-content;
  border-right: 1px solid black;
  border-left: 1px solid black;

}
.header__link__dashboard {
  color: black;
  font-weight: 700;
  display: block;
  padding: 1.6rem 2.4rem;
  transition: all 0.2s;
  width: fit-content;
  margin-right: 30rem;


}
.header__link__account {
  color: black;
  font-weight: 700;
  display: block;
  padding: 1.6rem 2.4rem;
  transition: all 0.2s;
  width: fit-content;
  margin-left: auto;
  margin-right: 0;
}
.header__link__dashboard:hover {
  background-color: black;
  color: white;


}
.header__link__account:hover {
  background-color: black;
  color: white;
}

.header__link:hover {
  background-color: black;
  color: white;
}

.header__link--active {
  background-color: black;
  color: white;
}

.header__login {
  color: black;
  font-weight: 700;
  //margin-left: 43.15%;
  padding: 1.6rem 2.4rem;
  display: block;
  transition: all 0.2s;
  right:0;
  margin-right: 0;
  justify-content: right;
}
.header__login:hover {
  background-color: black;
  color: white;
}

.header__login--active {
  background-color: black;
  color: white;
}
.navbar {
  width: 90%;
  height: 110%;
  display: flex;
  overflow: hidden;
  position: relative;
justify-content: center;
  border-radius: 5px;
  margin: 0 auto;
  background: linear-gradient(135deg, cornflowerblue, rgba(150, 129, 149, 0.98));

}
.navbar:hover{
  border-radius: unset;
}
.second-navbar  {
  background: linear-gradient(135deg, cornflowerblue, rgba(150, 129, 149, 0.98));
  overflow: hidden;
  justify-content: left;
  margin-left: 9.4rem;
  height: 50px;
  width: 90%;
  border-radius: 0 0 1rem 1rem;
  position: absolute;
  display: flex;
  border-bottom: 1px solid black;
  border-right: 1px solid black ;
  border-left: 1px solid black ;
  z-index: 1;
}
.second-navbar .header__link {
  color: black;
  font-weight: 700;
  display: block;
  transition: all 0.2s;
  overflow: unset;
  padding-bottom: 5%;
  top: 0;

}
.second-navbar .header__link:hover {
  background-color: black;
  color: white;
}
.second-navbar .header__link--active {
  background-color: black;
  color: white;
}
.header{
  position: relative;
}

@media (max-width: 768px) {
  .header {
    width: calc(100% - 2rem);

  }

  .header__link {
    width: 25%;
    text-align: center;

  }

  .header__link span {
    display: none;
  }

  .header__login {
    width: 25%;
    text-align: center;
    right: 17%;
  }
  .logo{
    width: 20px;
    height: 20px;
  }
}
</style>
