<template class="template">
  <div
    class="container"
    v-if="(getUserData?.role_id !== 0) & (getUserData?.role_id !== null)"
  >
    <NavHeader :activeIndex="8" />
    <div class="background">
      <div class="mainbody">
        <div class="menuHelpdesk">
          <ul class="elementList">
            <li><h1 class="titleViewTickets">Zgłoszenia IT</h1></li>
            <li>
              <select class="element" v-if="getUserData?.role_id === 2 || getUserData?.role_id === 4" @change="handleTicketTypeChange">
                <option value="my" @click="showMyTickets" v-if="getUserData?.role_id !== 0">Moje Tickety</option>
                <option value="all" @click="showAllTickets" v-if="getUserData?.role_id === 2">Wszystkie Tickety</option>
                <option value="pc" @click="showPCTickets" v-if="getUserData?.role_id === 2">Tickety - Problem z komputerem</option>
                <option value="printer" @click="showPrinterTickets" v-if="getUserData?.role_id === 2">Tickety - Problem z drukarką</option>
                <option value="other" @click="showOtherTickets" v-if="getUserData?.role_id === 2">Tickety - Inny problem</option>
              </select>
            </li>
            <li v-if="getUserData?.role_id === 2 || getUserData?.role_id === 4">
              <input
                class="element"
                v-if="getUserData?.role_id !== 0"
                type="number"
                placeholder="Wprowadź ID użytkownika"
                @input="handleUserIdInput"
              />
            </li>
            <li ><a href="addticket/">
              <button class="element">Utwórz Zgłoszenie</button>
            </a>
           </li>
           <li class="tooltip" v-if="this.showDetails===true && getUserData?.role_id === 2"> POMOC
            <span class="tooltiptext">{{ selectedTicket.gpt_ans }}> </span>
           </li>
             <li  class="button-backPosition" v-if="this.showDetails===true"><button class="buttonBack"  @click="goBack()">Wróć</button></li>
          </ul>

        </div>
      <div v-if="showAll">

          <div class="tableContainerTickets">
            <table class="tableTickets">
              <thead class="theadusers">
              <tr>
                <th scope="col" class="th">ID Ticketu</th>
                <th scope="col" class="th">Pracownik</th>
                <th scope="col" class="th">Typ zgłoszenia</th>
                <th scope="col" class="th">Akcje</th>
              </tr>
              </thead>
              <tbody>
              <tr class="trit" v-for="ticket in allTickets" :key="ticket.id">

                <td>{{ ticket.id }}</td>
                <td>ID: {{ ticket.user_id }}, {{ticket.name}} {{ticket.surname}}</td>
                <td>{{ ticket.category }} - {{ticket.problem }}</td>
                <td>
                  <button @click="showTicketDetails(ticket)">
                    <i class="fas fa-search"></i>
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      <div v-if="showPC">
        <div>
          <div class="tableContainerTickets">
            <table class="tableTickets">
              <thead >
              <tr>
                <th scope="col" class="th">ID Ticketu</th>
                <th scope="col" class="th">ID Pracownika</th>
                <th scope="col" class="th">Typ zgłoszenia</th>
                <th scope="col" class="th">Akcje</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="ticket in PCTickets" :key="ticket.id">
                <td>{{ ticket.id }}</td>
                <td>ID: {{ ticket.user_id }}, {{ticket.name}} {{ticket.surname}}</td>
                <td>{{ ticket.problem }}</td>
                <td>
                  <button @click="showTicketDetails(ticket)">
                    <i class="fas fa-search"></i>
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div v-if="showPrinter">


        <div class="tableContainerTickets">
          <table class="tableTickets">
            <thead>
            <tr>
              <th class="th">ID Ticketu</th>
              <th class="th">ID Pracownika</th>
              <th class="th">Typ zgłoszenia</th>
              <th class="th">Akcje</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="ticket in PrinterTickets" :key="ticket.id">
              <td>{{ ticket.id }}</td>
              <td>ID: {{ ticket.user_id }}, {{ticket.name}} {{ticket.surname}}</td>
              <td>{{ ticket.problem }}</td>
              <td>
                <button @click="showTicketDetails(ticket)">
                  <i class="fas fa-search"></i>
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-if="showOther">


        <div class="tableContainerTickets">
          <table class="tableTickets">
            <thead >
            <tr>
              <th class="th">ID Ticketu</th>
              <th class="th">ID Pracownika</th>
              <th class="th">Typ zgłoszenia</th>
              <th class="th">Akcje</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="ticket in OtherTickets" :key="ticket.id">
              <td>{{ ticket.id }}</td>
              <td>ID: {{ ticket.user_id }}, {{ticket.name}} {{ticket.surname}}</td>
              <td>{{ ticket.problem }}</td>
              <td>
                <button @click="showTicketDetails(ticket)">
                  <i class="fas fa-search"></i>
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-if="showMy">
        <div class="tableContainerTickets">
          <table class="tableTickets">
            <thead>
            <tr>
              <th class="th">ID</th>
              <th class="th">Typ zgłoszenia</th>
              <th class="th">Akcje</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="ticket in myTickets" :key="ticket.id">
              <td>{{ ticket.id }}</td>
              <td>{{ ticket.category }}</td>
              <td>
                <button @click="showTicketDetails(ticket)">
                  <i class="fas fa-search"></i>
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-if="showUserId">
          <div class="tableContainerTickets">
            <table class="tableTickets">
              <thead>
              <tr>
                <th class="th">ID</th>
                <th class="th">Typ zgłoszenia</th>
                <th class="th">Akcje</th>
              </tr>
              </thead>
              <tbody>
              <!-- Pętla wyświetlająca wszystkie wnioski -->
              <tr v-for="ticket in UserTickets" :key="ticket.id">
                <td>{{ ticket.id }}</td>
                <td>{{ ticket.category }}</td>
                <td>
                  <button @click="showTicketDetails(ticket)">
                    <i class="fas fa-search"></i>
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
      </div>
      </div>
      <div v-if="showDetails">
        <div>
          <div class="requestDetailsBackground">
            <table class="requestDetails">
              <tbody>
              <tr style="border: black 1px">
                <th class="th">ID: </th>
                <td> {{ selectedTicket.id }}</td>
              </tr>
              <tr>
                <th class="th">ID pracownika:</th>
                <td> {{ selectedTicket.user_id }}</td>
              </tr>
              <tr>
                <th class="th">ID osoby obsługującej ticket:</th>
                <td> {{ selectedTicket.supervisor_id }} </td>
              </tr>
              <tr>
                <th class="th">Kategoria:</th>
                <td>{{ selectedTicket.category }} </td>
              </tr>
              <tr>
                <th class="th">Typ problemu:</th>
                <td>{{ selectedTicket.problem }} </td>
              </tr>
              <tr>
                <th class="th">Status ticketu:</th>
                <td><span v-if="selectedTicket.closed === 0">W trakcie</span>
                  <span v-else-if="selectedTicket.closed === 1">Zamknięty</span>
                  <span v-else-if="selectedTicket.closed === null">Oczekuje</span></td>
              </tr>
              <tr >
                <th class="th">Podsumowanie</th>
                <td class="trdetail">{{ selectedTicket.additional_info }}</td>
              </tr>
              </tbody>
            </table>
          </div>
          <Chat :id="selectedTicket.id"/>
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
import { mapGetters, mapState } from 'vuex'
Vue.use(VueCookies)
import Chat from "@/components/Chat.vue";

export default {
  components: {
    Chat,
  },
  data() {
    return {
      allTickets: [{}],
      PCTickets: [],
      PrinterTickets: [],
      OtherTickets: [],
      myTickets: [{}],
      UserTickets: [{}],
      showAll: false,
      showPC: false,
      showPrinter: false,
      showOther: false,
      showMy: true,
      showUserId: false,
      user_id: null,
      showDetails: false,
      selectedTicket: {},
      showAll_old: false,
      showPC_old: false,
      showPrinter_old: false,
      showOther_old: false,
      showMy_old: true,
      showUserId_old: false,
      showDetails_old: false,
      errorPath: '/error',
    }
  },
  mounted() {
    this.idFromCookies()
    this.$store.dispatch('fetchUserData')
    this.$store.dispatch('idFromCookies')
    if(this.getUserData?.role_id===null || this.getUserData?.role_id===0) {
      this.$router.push(this.errorPath);
    }
    this.fetchMyTickets()
    if(this.getUserData.role_id===2) {
      this.fetchAllTickets()
      this.fetchPCTickets()
      this.fetchPrinterTickets()
      this.fetchOtherTickets()
    }
  },
  methods: {
    async idFromCookies() {
      this.user_id = Vue.$cookies.get('userId')
    },
    async showAllTickets() {
      this.showAll = true
      this.showPC = false
      this.showPrinter = false
      this.showMy = false
      this.showDetails = false
      this.showOther = false
      this.showUserId = false
      this.showOther_old = this.showOther
      this.showAll_old = this.showAll
      this.showPC_old = this.showPC
      this.showPrinter_old = this.showPrinter
      this.showMy_old = this.showMy
      this.showDetails_old = this.showDetails
      this.showUserId_old = this.showUserId
    },
    async showPCTickets() {
      this.showAll = false
      this.showPC = true
      this.showPrinter = false
      this.showMy = false
      this.showDetails = false
      this.showOther = false
      this.showUserId = false
      this.showOther_old = this.showOther
      this.showAll_old = this.showAll
      this.showPC_old = this.showPC
      this.showPrinter_old = this.showPrinter
      this.showMy_old = this.showMy
      this.showDetails_old = this.showDetails
      this.showUserId_old = this.showUserId
    },
    async showPrinterTickets() {
      this.showAll = false
      this.showPC = false
      this.showPrinter = true
      this.showMy = false
      this.showDetails = false
      this.showOther = false
      this.showUserId = false
      this.showOther_old = this.showOther
      this.showAll_old = this.showAll
      this.showPC_old = this.showPC
      this.showPrinter_old = this.showPrinter
      this.showMy_old = this.showMy
      this.showDetails_old = this.showDetails
      this.showUserId_old = this.showUserId
    },
    async showOtherTickets() {
      this.showAll = false
      this.showPC = false
      this.showPrinter = false
      this.showMy = false
      this.showDetails = false
      this.showOther = true
      this.showUserId = false
      this.showOther_old = this.showOther
      this.showAll_old = this.showAll
      this.showPC_old = this.showPC
      this.showPrinter_old = this.showPrinter
      this.showMy_old = this.showMy
      this.showDetails_old = this.showDetails
      this.showUserId_old = this.showUserId
    },
    async showMyTickets() {
      this.showAll = false
      this.showPC = false
      this.showPrinter = false
      this.showMy = true
      this.showDetails = false
      this.showOther = false
      this.showUserId = false
      this.showOther_old = this.showOther
      this.showAll_old = this.showAll
      this.showPC_old = this.showPC
      this.showPrinter_old = this.showPrinter
      this.showMy_old = this.showMy
      this.showDetails_old = this.showDetails
      this.showUserId_old = this.showUserId
    },
    async showUserIdTickets(user_id) {
      await this.fetchUserIdTickets(user_id)
      this.showAll = false
      this.showPC = false
      this.showPrinter = false
      this.showMy = false
      this.showUserId = true
      this.showDetails = false
      this.showOther = false
      this.showUserId_old = this.showUserId
      this.showOther_old = this.showOther
      this.showAll_old = this.showAll
      this.showPC_old = this.showPC
      this.showPrinter_old = this.showPrinter
      this.showMy_old = this.showMy
      this.showDetails_old = this.showDetails
    },
    showTicketDetails: async function (ticket) {
      this.showAll = false
      this.showPC = false
      this.showPrinter = false
      this.showMy = false
      this.showOther = false
      this.showUserId = false
      this.selectedTicket = ticket
      console.log(ticket)
      this.showDetails = true
    },
    async goBack() {
      this.showUserId = this.showUserId_old
      this.showAll = this.showAll_old
      this.showPC = this.showPC_old
      this.showPrinter = this.showPrinter_old
      this.showMy = this.showMy_old
      this.showDetails = this.showDetails_old
    },

    fetchMyTickets: async function () {
      try {
        const response = await axios.get(
          `${process.env.SERVER_IP}/v1/helpdesk/viewTickets/myTickets/${this.user_id}`
        )
        for(const ticket of response.data) {
          const nameSurname = await axios.get(`${process.env.SERVER_IP}/v1/users/${ticket.user_id}`)
          ticket.name = nameSurname.data.name
          ticket.surname = nameSurname.data.surname
        }
        this.myTickets = response.data
      } catch (error) {
        console.error('Błąd podczas pobierania danych:', error)
      }
    },
    fetchAllTickets: async function () {
      try {
        const response = await axios.get(
          `${process.env.SERVER_IP}/v1/helpdesk/viewTickets/`
        )
        for(const ticket of response.data) {
          const nameSurname = await axios.get(`${process.env.SERVER_IP}/v1/users/${ticket.user_id}`)
          ticket.name = nameSurname.data.name
          ticket.surname = nameSurname.data.surname
        }
        this.allTickets = response.data
      } catch (error) {
        console.error('Błąd podczas pobierania danych:', error)
      }
    },
    fetchPCTickets: async function () {
      try {
        const response = await axios.get(
          `${process.env.SERVER_IP}/v1/helpdesk/viewTickets/category/Komputer`
        )
        for(const ticket of response.data) {
          const nameSurname = await axios.get(`${process.env.SERVER_IP}/v1/users/${ticket.user_id}`)
          ticket.name = nameSurname.data.name
          ticket.surname = nameSurname.data.surname
        }
        this.PCTickets = response.data
      } catch (error) {
        console.error('Błąd podczas pobierania danych:', error)
      }
    },
    fetchPrinterTickets: async function () {
      try {
        const response = await axios.get(
          `${process.env.SERVER_IP}/v1/helpdesk/viewTickets/category/Drukarka`
        )
        for(const ticket of response.data) {
          const nameSurname = await axios.get(`${process.env.SERVER_IP}/v1/users/${ticket.user_id}`)
          ticket.name = nameSurname.data.name
          ticket.surname = nameSurname.data.surname
        }
        this.PrinterTickets = response.data
      } catch (error) {
        console.error('Błąd podczas pobierania danych:', error)
      }
    },
    fetchOtherTickets: async function () {
      try {
        const response = await axios.get(
          `${process.env.SERVER_IP}/v1/helpdesk/viewTickets/category/Inne`
        )
        for(const ticket of response.data) {
          const nameSurname = await axios.get(`${process.env.SERVER_IP}/v1/users/${ticket.user_id}`)
          ticket.name = nameSurname.data.name
          ticket.surname = nameSurname.data.surname
        }
        this.OtherTickets = response.data
      } catch (error) {
        console.error('Błąd podczas pobierania danych:', error)
      }
    },
    fetchUserIdTickets: async function (user_id) {
      try {
        const response = await axios.get(`${process.env.SERVER_IP}/v1/helpdesk/viewTickets/myTickets/${user_id}`)
        for(const ticket of response.data) {
          const nameSurname = await axios.get(`${process.env.SERVER_IP}/v1/users/${ticket.user_id}`)
          ticket.name = nameSurname.data.name
          ticket.surname = nameSurname.data.surname
        }
        this.UserTickets = response.data
      } catch (e){
        console.error('Błąd podczas pobierania ticketów danego usera:', e)
      }
    },
    async handleUserIdInput(event) {
      const userId = event.target.value;
      setTimeout(async () => {
        await this.showUserIdTickets(userId);
      }, 3000)

    },
    handleTicketTypeChange(event) {
      const selectedValue = event.target.value;
      switch (selectedValue) {
        case "my":
          this.showMyTickets();
          break;
        case "all":
          this.showAllTickets();
          break;
        case "pc":
          this.showPCTickets();
          break;
        case "printer":
          this.showPrinterTickets();
          break;
        case "other":
          this.showOtherTickets();
          break;
        default:
          break;
      }
    }
  },
  computed: {
    ...mapState(['users']),
    ...mapGetters(['getUserData']),
  },
}
</script>
<script setup>
</script>
<style>

.trdetail{

  height: 80px;
  overflow-y: scroll;
}
.mainbody{
  white-space: nowrap;
}
.titleViewTickets{
  margin-left: 1rem;
  color: black;
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

.button-backPosition{
  justify-content: center;
  width: 93%;
  font-size: large;
  border-radius: 5px;
  display: block;
  position: absolute;
  bottom: 1rem;
  box-shadow: 5px 5px 10px 2px rgba(0,0,0,.2);

}
.buttonBack{
  color: black;
  border: black 1px solid;
  padding: 1%;
  margin: 1%;
  list-style-type: none;
  font-size: large;
  white-space: nowrap;
  width: 100%;
  text-align: center;
}
.buttonBack:hover{
  background-color: lightgray;
}
.tooltip {
  color: black;
  border: black 1px solid;
  padding: 1%;
  margin: 1%;
  list-style-type: none;
  font-size: large;
  white-space: nowrap;
  width: 93%;
  position: absolute;
  bottom: 5rem;
  text-align: center;
}

.tooltip .tooltiptext {

  visibility: hidden;
  border: 1px solid;
  background-color: #89a6ee;
  color: #020000;
  text-align: center;
  padding: 10px;
  border-radius: 6px;
  font-size: small;
  bottom: 100%;
  left: 100%;
  margin-left: -60px;
  min-width: 80vh;
  max-width: 100vh;
  max-height: 60vh;
  position: absolute;
  word-wrap: break-word;
  overflow: auto;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  position: absolute;
  word-wrap: break-word;
  white-space: pre-line;
  z-index: 1;
}

.element{
  color: black;
  border: black 1px solid;
  padding: 1%;
  margin: 1%;
  list-style-type: none;
  font-size: large;
  white-space: nowrap;
  width: 100%;
  text-align: left;
}
.element:hover{
  background-color: lightgray;
}

.menuHelpdesk{
  position: relative;
  float: left;
  display: inline-block;
  padding: 1rem 1rem;
  margin-top: 3.5rem;
  margin-left: 1rem;
  vertical-align: middle;
  background-color: white;
  border: 2px solid black;
  height: 790px;
  box-shadow: 5px 5px 10px 2px rgba(0,0,0,.2);
  border-collapse: collapse;
  border-radius: 5px 20px 5px;
}
.elementList{
  height: 100%;
}
.tableContainerTickets{
  float: left;
  text-align: center;
  display: inline-block;
  padding: 1rem 1rem;
  vertical-align: middle;
  width: 80%;

}
tr{
  max-height: 100px;
}
.tableTickets{
  display: block;
  height: 790px;
  overflow-y: scroll;
  overflow-x: hidden;
  width: fit-content;
  background-color: white;
  color: black;
}
.tableContainerTickets thead th{
  position: sticky;
  top: 0;

}


.chat th {
  background-color: #f2f2f2;
}

.chat td {
  padding: 8px;
  border-bottom: 1px solid #ddd;
  width: 100%;
}

.th{
  text-align: center;
  color: white;
  background-color: black;
  width: 350px;


}
.trit:Hover {
  background-color: lightgray;
}

.requestDetails{

  text-align: center;
  margin-left: 2rem;
  margin-top: 0;

}
td{
  background-color: white;
  color: black;
}
.requestDetailsBackground{
  display: flex;
  justify-content: center;
  width: 80%;

  margin-left: 2rem;
  position: relative;

}
.fa-search{
  color: black;
}

</style>
