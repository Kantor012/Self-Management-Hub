<template>
  <div class="container" v-if="getUserData?.role_id!==null">
    <NavHeader :activeIndex=6 />
<div class="background">
    <div class="formBackground">
      <h1 class="addhr">Składanie Wniosku</h1>
    <form method="POST"  @submit.prevent="submitApplication">
      <div  >
        <label class="label" for="category">Kategoria Wniosku:</label>
        <select class="select" id="category" v-model="selectedCategory" required>
          <option value="" disabled>Wybierz kategorię</option>
          <option value="hr">Wniosek do HR</option>
        </select>
      </div>
      <div class="lableBackground" v-if="selectedCategory === 'hr'">
        <label class="label" for="hrCategory">Kategoria Wniosku do HR:</label>
        <select class="select" id="hrCategory" v-model="selectedHRCategory" required>
          <option value='0' disabled>Wybierz kategorię</option>
          <option value='1'>Wniosek o urlop</option>
          <option value='2'>Wniosek o delegację</option>
          <option value='3'>Rozliczenie z delegacji</option>
          <option value='4'>Inne</option>
        </select>
        <div class="lableBackground" v-if="selectedHRCategory === '1' || selectedHRCategory === '2'">
          <label class="label" for="from_date">Data rozpoczęcia:</label>
          <input class="input" id="from_date" type="date" v-model="from_date" required />

          <label class="label" for="to_date">Data zakończenia:</label>
          <input class="input" id="to_date" type="date" v-model="to_date" required />
        </div>
      </div>
      <div v-if="selectedHRCategory !== ''">
        <div class="lableBackground">
          <label class="label" for="additionalInfo">Dodatkowe informacje:</label>
          <textarea class="additionalInfo" id="additionalInfo" v-model="additionalInfo" rows="4"></textarea>
        </div>
      </div>
      <div class="buttonBackground">
        <button class="submit-button" type="submit">Złóż Wniosek</button>
      </div>
    </form>
    </div>
</div>
  </div>
  <div class="container" v-else-if="getUserData?.role_id===0 || getUserData?.role_id===null">
    <NavHeader :activeIndex="1" />
    <a>
      Nie masz dostępu do tej strony.
    </a>
  </div>
</template>

<script>
import axios from 'axios'
import Vue from 'vue';
import VueCookies from 'vue-cookies';
import Vuex, { mapGetters, mapState } from "vuex";
require('dotenv').config();
const serverip = process.env.SERVER_IP;
Vue.use(Vuex)

Vue.use(VueCookies);

export default {
  name: "application",
  data() {
    return {
      selectedCategory: '',
      selectedHRCategory: '',
      additionalInfo: '',
      from_date: null,
      to_date: null,
      errorPath: '/error',
    }
  },
  computed: {
    ...mapState(['users']),
    ...mapGetters(['getUserData'])

  },
  mounted() {
    this.$store.dispatch('idFromCookies');
    this.$store.dispatch('fetchUserData');
    if(this.getUserData?.role_id===null || this.getUserData?.role_id===0) {
      this.$router.push(this.errorPath);
    }
  },
  methods: {
    submitApplication(event) {
      event.preventDefault();
      event.stopPropagation();

      const applicationDataHR = {
        user_id: Vue.$cookies.get('userId'),
        supervisor_id: null,
        category_id: this.selectedHRCategory,
        from_date: this.from_date,
        to_date: this.to_date,
        additional_Info: this.additionalInfo,
      }
      let Data = {}
      const endpoint =  '/addRequestHR';
      Data = applicationDataHR;
      axios.post(`${process.env.SERVER_IP}/v1${endpoint}`, Data)
        .then(response => {
          console.log('Wniosek został pomyślnie złożony: ', response.data);
          this.selectedHRCategory = '';
          this.selectedCategory = '';
          this.additionalInfo = '';
          this.from_date = null;
          this.to_date = null;
        })
        .catch(error => {
          console.error('Błąd podczas składania wniosku: ', error);
        });
    },
    getCategoryName(category_id, type) {
      if (type === 'hr') {
        switch (category_id) {
          case 1:
            return 'Wniosek o urlop';
          case 2:
            return 'Wniosek o delegację';
          case 3:
            return 'Rozliczenie z delegacji';
          case 4:
            return 'Inne';
          default:
            return 'Nieznany';
        }
      } else {
        return 'Nieznany';
      }
    },
  },

}
</script>

<style scoped>
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
.formBackground {
  position: relative;
  border-radius: 5px 20px 5px;
  font-weight: 700;
  max-width: 40%;
  padding-top: 2%;
  margin-left: 5rem;
  min-height: 50vh;
  margin-top: 5rem;
  font-size: large;
  background: #eeeeee;
  box-shadow: 5px 5px 10px 2px rgba(0, 0, 0, 0.2);
  color: black;

}
.lableBackground{
margin-top: 3rem;
}
.label{
  margin-bottom: 20px;
  margin-top: 5rem;
  margin-left: 5rem;
}

.submit-button {
  position: absolute;
  right:3rem;
  bottom: 0;
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
.submit-button:hover {
  color: black;
  background-color: lightblue;

}

.addhr{
  margin-left: 5rem;

}

.select {
  width: 100%;
  min-width: 15ch;
  max-width: 30ch;
  border: 1px solid;
  border-radius: 0.25em;
  padding: 0.25em 0.5em;
  font-size: 1.25rem;
  cursor: pointer;
  line-height: 1.1;
  background-color: #fff;
  background-image: linear-gradient(to top, #f9f9f9, #fff 33%);
  margin-left: 1%;
  justify-content: center;
}

.input{
  width: 15%;
  box-sizing: border-box;

}

.additionalInfo{
  margin-top: 1%;
  width: 80%;
  margin-left: 5rem;
}

.tr{
 border: 1px solid black;
  background: white;

}

.choice{
  color: black;
}
</style>
