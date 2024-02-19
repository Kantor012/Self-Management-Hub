<template>
  <div class="container" v-if="getUserData?.role_id !== null">
    <NavHeader :activeIndex="9" />
    <div class="background">
      <div class="formBackground">
        <h1 v-if="!isSubmitted" class="tittlehelpdesk">Tworzenie Zgłoszenia</h1>
        <form
          method="POST"
          class="form"
          @submit.prevent="submitApplication"
          v-if="!isSubmitted"
        >
          <div class="noideawhatdoesitdoes" v-if="selectedCategory === 'it'">
            <label class="label" for="itCategory"
              >Jakiego urządzenia dotyczy problem:</label
            >
            <select
              class="select"
              id="itCategory"
              v-model="selectedITCategory"
              required
            >
              <option value="0" disabled>Wybierz kategorię</option>
              <option value="1">Komputer</option>
              <option value="2">Drukarka</option>
              <option value="3">Inne</option>
            </select>
            <div class="lableBackground" v-if="selectedITCategory === '1'">
              <label class="label" for="itCategory">Jaki typ problemu?</label>
              <select
                class="select"
                id="itCategory"
                v-model="selectedITCategory1"
                required
              >
                <option value="0" disabled>Wybierz kategorię</option>
                <option value="1">Komputer nie działa</option>
                <option value="2">Problem z aplikacją</option>
                <option value="3">Brak internetu</option>
                <option value="4">Inny problem</option>
              </select>
            </div>
            <div class="lableBackground" v-if="selectedITCategory === '2'">
              <label class="label" for="itCategory">Jaki typ problemu?</label>
              <select
                class="select"
                id="itCategory"
                v-model="selectedITCategory1"
                required
              >
                <option value="0" disabled>Wybierz kategorię</option>
                <option value="1">Problem z podłączeniem drukarki</option>
                <option value="2">Brak tuszu/tonera</option>
                <option value="3">Nie włącza się / Zawiesiła się</option>
                <option value="4">Inny problem</option>
              </select>
            </div>
            <div class="lableBackground" v-if="selectedITCategory === '3'">
              <label class="label" for="itCategory">Jaki typ problemu?</label>
              <select
                class="select"
                id="itCategory"
                v-model="selectedITCategory1"
                required
              >
                <option value="0" disabled>Wybierz kategorię</option>
                <option value="1">Inny problem</option>
              </select>
            </div>
            <div class="lableBackground" v-if="selectedITCategory1">
              <label class="label" for="additionalInfo"
                >Dodatkowe informacje:</label
              >
              <textarea
                class="additionalInfo"
                id="additionalInfo"
                v-model="additionalInfo"
                rows="4"
              ></textarea>
            </div>
          </div>

          <button class="submit-button" type="submit">Złóż Wniosek</button>
        </form>
        <div v-else>
          <h2 v-if="isSubmitted" class="tittlehelpdesk">Zgłoszenie przekazane do zespołu IT</h2>
        </div>
      </div>
    </div>
  </div>
  <div
    class="container"
    v-else-if="getUserData?.role_id === 0 || getUserData?.role_id === null"
  >
    <NavHeader :activeIndex="1" />
    <a> Nie masz dostępu do tej strony. </a>
  </div>
</template>

<script>
import axios from 'axios'
import Vue from 'vue'
import VueCookies from 'vue-cookies'
import Vuex, { mapGetters, mapState } from 'vuex'
import io from 'socket.io-client'

require('dotenv').config()
Vue.use(Vuex)
Vue.use(VueCookies)

export default {
  name: 'application',
  beforeDestroy() {
    this.socket.disconnect()
  },
  data() {
    return {
      selectedCategory: 'it',
      selectedITCategory: '',
      selectedITCategory1: '',
      additionalInfo: '', // Dodatkowe informacje
      isSubmitted: false,
      errorPath: '/error',
    }
  },
  computed: {
    ...mapState(['users']),
    ...mapGetters(['getUserData']),
  },
  mounted() {
    this.$store.dispatch('idFromCookies')
    this.$store.dispatch('fetchUserData')
    if(this.getUserData?.role_id===null || this.getUserData?.role_id===0) {
      this.$router.push(this.errorPath);
    }
    this.socket = io(`${process.env.SERVER_IP}`)
  },
  methods: {
    async submitApplication(event) {
      event.preventDefault()
      event.stopPropagation()
      this.isSubmitted = true
      const applicationDataIT = {
        user_id: Vue.$cookies.get('userId'),
        supervisor_id: null,
        category: this.selectedITCategory,
        problem: this.selectedITCategory1,
        additional_info: this.additionalInfo,
      }
      switch (applicationDataIT.category) {
        case 1:
          applicationDataIT.category = 'Komputer'
          switch (applicationDataIT.problem) {
            case 1:
              applicationDataIT.problem = 'Komputer nie działa'
              break
            case 2:
              applicationDataIT.problem = 'Problem z aplikacją'
              break
            case 3:
              applicationDataIT.problem = 'Brak internetu'
              break
            case 4:
              applicationDataIT.problem = 'Inny problem'
              break
            default:
              break
          }
          break
        case 2:
          applicationDataIT.category = 'Drukarka'
          switch (applicationDataIT.problem) {
            case 1:
              applicationDataIT.problem = 'Problem z podłączeniem drukarki'
              break
            case 2:
              applicationDataIT.problem = 'Brak tuszu/tonera'
              break
            case 3:
              applicationDataIT.problem = 'Nie włącza się / Zawiesiła się'
              break
            case 4:
              applicationDataIT.problem = 'Inny problem'
              break
            default:
              break
          }
          break
        case 3:
          applicationDataIT.category = 'Inne'
          switch (applicationDataIT.problem) {
            case 1:
              applicationDataIT.problem = 'Inny problem'
              console.log(applicationDataIT.category)
              console.log(applicationDataIT.problem)
              break
            default:
              break
          }
          break
      }
      let Data = {}
      Data = applicationDataIT
      Data.gpt_ans = await this.gptAnswer(Data.additional_info)
      this.socket.emit('new-ticket', {
        type: 'IT Ticket',
        message: 'Nowe zgłoszenie zostało dodane.',
        senderId: Data.user_id,
      })
      axios
        .post(`${process.env.SERVER_IP}/v1/helpdesk/addTicket`, Data)
        .then((response) => {
          console.log('Wniosek został pomyślnie złożony: ', response.data)
        })
        .catch((error) => {
          console.error('Błąd podczas składania wniosku: ', error)
        })
    },
    gptAnswer: async function (info) {
      const data =
        'Napisz o co może chodzić w tym problemie: \n\n' +
        info +
        '\n\n Zaproponuj kilka przykładów jak rozwiązać ten problem'
      try {
        const response = await axios.post(
          `${process.env.SERVER_IP}/v1/helpdesk/gpt/${data}`
        )
        return response.data.res
      } catch (error) {
        console.error('Błąd podczas pobierania danych:', error)
      }
    },
  },
}
</script>

<style scoped>
.tittlehelpdesk {
  margin-left: 5rem;
  margin-bottom: 1rem;
  color: black;

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

.form {
  padding-left: 5rem;
}

.noideawhatdoesitdoes {
  position: relative;
}

.lableBackground {
  margin-bottom: 20px;
  margin-top: 5rem;
}

.background {
  width: 90%;
  color: white;
  background: linear-gradient(
    135deg,
    cornflowerblue,
    rgba(150, 129, 149, 0.98)
  );
  display: block;
  justify-content: center;
  border-radius: 5px 20px 5px;
  box-shadow: 5px 5px 10px 2px rgba(0, 0, 0, 0.2);
  min-height: 90vh;
  padding-top: 1rem;
  margin-top: 2rem;
}

.submit-button {
  position: absolute;
  right: 3rem;
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
  box-shadow: 5px 5px 10px 2px rgba(0, 0, 0, 0.2);
}

.submit-button:hover {
  color: black;
  background-color: lightblue;
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

.additionalInfo {
  margin-top: 1%;
  width: 80%;
}
</style>
