<template class="template">
  <div class="container" v-if="getUserData?.role_id !== null">
    <NavHeader :activeIndex="1" />

    <div class="background">
      <div v-if="showAll">
        <div class="mainbody">
          <div class="menuRequests">
            <ul>
              <li>
                <h2 class="requesttitle">Wszystkie Wnioski</h2>
              </li>
              <li>
                <button
                  class="element"
                  v-if="
                    getUserData?.role_id === 4 || getUserData?.role_id === 3
                  "
                  @click="showAllRequests"
                >
                  Wszystkie wnioski
                </button>
              </li>
              <li>
                <button
                  class="element"
                  v-if="getUserData?.role_id !== 0"
                  @click="showMyRequests"
                >
                  Moje wnioski
                </button>
              </li>
              <li>
                <a href="./addRequest">
                  <button class="element">
                    Złóż Wniosek
                  </button>
                </a>

              </li>
              <li>
                <button
                  class="element"
                  v-if="
                    getUserData?.role_id === 4 || getUserData?.role_id === 3
                  "
                  @click="showArchivedRequests"
                >
                  Archiwum
                </button>
              </li>
            </ul>
          </div>

          <div class="tableContainerRequests">
            <table class="tableRequests">
              <thead>
                <tr>
                  <th class="th">ID</th>
                  <th class="th">Imię i nazwisko</th>
                  <th class="th">Typ wniosku</th>
                  <th class="th">Akcje</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="request in allRequests" :key="request.id">
                  <td>{{ request.type }}:{{ request.id }}</td>
                  <td>{{ request.name }} {{ request.surname }}</td>
                  <td>
                    {{ getCategoryName(request.category_id, request.type) }}
                  </td>
                  <td>
                    <button @click="showRequestDetails(request)">
                      <i class="fas fa-search"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div v-if="showArchived">
        <div class="mainbody">
          <div class="menuRequests">
            <ul>
              <li>
                <h2 class="requesttitle">Wszystkie Wnioski</h2>
              </li>
              <li>
                <button
                  class="element"
                  v-if="
                    getUserData?.role_id === 4 || getUserData?.role_id === 3
                  "
                  @click="showAllRequests"
                >
                  Wszystkie wnioski
                </button>
              </li>
              <li>
                <button
                  class="element"
                  v-if="getUserData?.role_id !== 0"
                  @click="showMyRequests"
                >
                  Moje wnioski
                </button>
              </li>
              <li>
                <a href="./addRequest">
                  <button class="element">
                    Złóż Wniosek
                  </button>
                </a>
              </li>
              <li>
                <button
                  class="element"
                  v-if="
                    getUserData?.role_id === 4 || getUserData?.role_id === 3
                  "
                  @click="showArchivedRequests"
                >
                  Archiwum
                </button>
              </li>
            </ul>
          </div>

          <div class="tableContainerRequests">
            <table class="tableRequests">
              <thead>
              <tr>
                <th class="th">ID</th>
                <th class="th">Imię i nazwisko</th>
                <th class="th">Typ wniosku</th>
                <th class="th">Akcje</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="request in archivedRequests" :key="request.id">
                <td>{{ request.type }}:{{ request.id }}</td>
                <td>{{ request.name }} {{ request.surname }}</td>
                <td>
                  {{ getCategoryName(request.category_id, request.type) }}
                </td>
                <td>
                  <button @click="showRequestDetails(request)">
                    <i class="fas fa-search"></i>
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div v-if="showMy">
        <div class="mainbody">
          <div class="menuRequests">
            <ul>
              <li><h2 class="requesttitle">Moje Wnioski</h2></li>
              <li>
                <button
                  class="element"
                  v-if="
                    getUserData?.role_id === 4 || getUserData?.role_id === 3
                  "
                  @click="showAllRequests"
                >
                  Wszystkie wnioski
                </button>
              </li>
              <li>
                <button
                  class="element"
                  v-if="getUserData?.role_id !== 0"
                  @click="showMyRequests"
                >
                  Moje wnioski
                </button>
              </li>
              <li>
                <a href="./addRequest">
                  <button class="element">
                    Złóż Wniosek
                  </button>
                </a>
              </li>
              <li v-if="getUserData.role_id>=3">
                <button
                  class="element"
                  @click="showArchivedRequests"
                >
                  Archiwum
                </button>
              </li>
            </ul>
          </div>
          <div class="tableContainerRequests">
            <table class="tableRequests">
              <thead>
                <tr>
                  <th class="th">ID</th>
                  <th class="th">Typ wniosku</th>
                  <th class="th">Akcje</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="request in myRequests" :key="request.id">
                  <td>{{ request.id }}</td>
                  <td>
                    {{ getCategoryName(request.category_id, request.type) }}
                  </td>
                  <td>
                    <button @click="showRequestDetails(request)">
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
        <div class="requestDetailsBackground">
          <div class="menu1">
            <ul>
              <li>
                <h2 class="requesttitle">
                  Wniosek nr {{ selectedRequest.id }}
                </h2>
              </li>
              <li>
                <button
                  class="element"
                  v-if="
                    getUserData?.role_id === 4 || getUserData?.role_id === 3
                  "
                  @click="showAllRequests"
                >
                  Wszystkie wnioski
                </button>
              </li>
              <li>
                <button
                  class="element"
                  v-if="getUserData?.role_id !== 0"
                  @click="showMyRequests"
                >
                  Moje wnioski
                </button>
              </li>
              <li>
                <a href="./addRequest">
                  <button class="element">
                    Złóż Wniosek
                  </button>
                </a>
              </li>
              <li>
                <button class="button-back" @click="goBack()">Wróć</button
                ><br />
              </li>
              <li>
                <button
                  class="button-back1"
                  v-if="selectedRequest.acceptedByBoss===1 && getUserData.role_id===3"
                  @click="acceptRequest(selectedRequest)"
                >
                  Akceptuj</button
                >
                <button
                  class="button-back1"
                  v-if="selectedRequest.acceptedByBoss===null && getUserData.role_id===4"
                  @click="bossAccept(selectedRequest)"
                >
                  Akceptuj
                </button><br />
              </li>
              <li>
                <button
                  class="button-back2"
                  v-if="selectedRequest.acceptedByBoss===1 && getUserData.role_id===3"
                  @click="rejectRequest(selectedRequest)"
                >
                  Odrzuć</button
                >
                <button
                  class="button-back2"
                  v-if="selectedRequest.acceptedByBoss===null && getUserData.role_id===4"
                  @click="bossReject(selectedRequest)"
                >
                  Odrzuć
                </button><br />
              </li>
            </ul>
          </div>
          <table class="requestDetails">
            <tbody>
              <tr style="border: black 1px">
                <th class="th">ID:</th>
                <td>{{ selectedRequest.id }}</td>
              </tr>
              <tr>
                <th class="th">ID pracownika:</th>
                <td>{{ selectedRequest.user_id }}</td>
              </tr>
              <tr>
                <th class="th">Typ:</th>
                <td>{{ selectedRequest.type }}</td>
              </tr>
              <tr>
                <th class="th">ID kategoria:</th>
                <td>{{ selectedRequest.category_id }}</td>
              </tr>
              <tr>
                <th class="th">Kategoria:</th>
                <td>
                  {{
                    getCategoryName(
                      selectedRequest.category_id,
                      selectedRequest.type
                    )
                  }}
                </td>
              </tr>
              <tr
                v-if="
                  (selectedRequest.from_date !== null) &
                  (selectedRequest.from_date !== '')
                "
              >
                <th class="th">Od dnia:</th>
                <td>{{ selectedRequest.from_date.slice(0, 10) }}</td>
              </tr>
              <tr
                v-if="
                  (selectedRequest.to_date !== null) &
                  (selectedRequest.to_date !== '')
                "
              >
                <th class="th">Do dnia:</th>
                <td>{{ selectedRequest.to_date.slice(0, 10) }}</td>
              </tr>
              <tr>
                <th class="th">dodatkowe info</th>
                <td>{{ selectedRequest.additional_info }}</td>
              </tr>
              <tr>
                <th class="th">status przełożony</th>
                <td>
                  <span v-if="selectedRequest.acceptedByBoss===1"
                    >Zaakceptowany</span
                  >
                  <span v-else-if="selectedRequest.acceptedByBoss===0"
                    >Odrzucony</span
                  >
                  <span v-else-if="selectedRequest.acceptedByBoss === null"
                    >Oczekuje na rozpatrzenie</span
                  >
                </td>
              </tr>
              <tr>
                <th class="th">status</th>
                <td>
                  <span v-if="selectedRequest.accepted===1">Zaakceptowany</span>
                  <span v-else-if="selectedRequest.accepted===0">Odrzucony</span>
                  <span v-else-if="selectedRequest.accepted === null"
                    >Oczekuje na rozpatrzenie</span
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <div
    class="container"
    v-else-if="getUserData?.role_id === 0 || getUserData?.role_id === null"
  >
    <NavHeader :activeIndex="1" />
    <div style="width: 100%; height: 100vh; color: #6628a9">
      <a> Nie masz dostępu do tej strony. </a>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import Vue from 'vue'
import VueCookies from 'vue-cookies'
import { mapGetters, mapState } from 'vuex'
Vue.use(VueCookies)
import Chat from '@/components/Chat'

export default {
  components: {
    Chat,
  },
  data() {
    return {
      allRequests: [{}],
      myRequests: [{}],
      archivedRequests: [{}],
      showAll: false,
      showMy: true,
      showArchived: false,
      user_id: null,
      showDetails: false,
      selectedRequest: {},
      showAll_old: false,
      showMy_old: true,
      showDetails_old: false,
      showArchived_old: false,
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
    this.fetchMyRequests()
    this.fetchAllRequests()
    this.fetchArchivedRequests()
  },
  methods: {
    async bossAccept(request) {
      try {
        await axios.put(
          `${process.env.SERVER_IP}/v1/editRequests/idBoss/${request.id}`
        )
        await this.fetchAllRequests()
        await this.fetchMyRequests()
        this.selectedRequest = request
      } catch (error) {
        console.error('Błąd podczas aktualizowania danych:', error)
      }
    },
    async idFromCookies() {
      this.user_id = Vue.$cookies.get('userId')
    },
    async showAllRequests() {
      this.showAll = true
      this.showMy = false
      this.showDetails = false
      this.showArchived = false
      this.showAll_old = this.showAll
      this.showMy_old = this.showMy
      this.showDetails_old = this.showDetails
      await this.fetchAllRequests()
    },
    async showMyRequests() {
      this.showAll = false
      this.showMy = true
      this.showDetails = false
      this.showArchived = false
      this.showAll_old = this.showAll
      this.showMy_old = this.showMy
      this.showDetails_old = this.showDetails
      await this.fetchMyRequests()
    },
    async showArchivedRequests() {
      this.showAll = false
      this.showMy = false
      this.showDetails = false
      this.showArchived = true
      this.showAll_old = this.showAll
      this.showMy_old = this.showMy
      this.showDetails_old = this.showDetails
      this.showArchived_old = this.showArchived
      await this.fetchArchivedRequests()

    },
    async goBack() {
      this.showAll = this.showAll_old
      this.showMy = this.showMy_old
      this.showDetails = this.showDetails_old
      this.showArchived = this.showArchived_old
      await this.fetchAllRequests()
      await this.fetchMyRequests()
      await this.fetchArchivedRequests()
    },
    fetchMyRequests: async function () {
      try {
        const response = await axios.get(
          `${process.env.SERVER_IP}/v1/viewRequests/user/${this.user_id}`)
        this.myRequests = response.data
      } catch (error) {
        console.error('Błąd podczas pobierania danych:', error)
      }
    },
    async fetchAllRequests() {
      try {
        const response = await axios.get(
          `${process.env.SERVER_IP}/v1/viewRequests`)
        this.allRequests = response.data
      } catch (error) {
        console.error('Błąd podczas pobierania danych:', error)
      }
    },
    async fetchArchivedRequests() {
      try {
        const response = await axios.get(
          `${process.env.SERVER_IP}/v1/viewArchive`)
        this.archivedRequests = response.data
      } catch (error) {
        console.error('Błąd podczas pobierania danych:', error)
      }
    },
    getCategoryName(category_id, type) {
      if (type === 'hr') {
        switch (category_id) {
          case 1:
            return 'Wniosek o urlop'
          case 2:
            return 'Wniosek o delegację'
          case 3:
            return 'Rozliczenie z delegacji'
          case 4:
            return 'Inne'
          default:
            return 'Nieznany'
        }
      } else {
        return 'Nieznany'
      }
    },
    async showRequestDetails(request) {
      this.showAll = false
      this.showMy = false
      this.showArchived = false
      this.selectedRequest = request
      this.showDetails = true
    },
    acceptRequest: async function (request) {
      if (request.acceptedByBoss) {
        if (request.type === 'hr') {
          switch (request.category_id) {
            case 1:
            // 'Wniosek o urlop'
            case 2:
              // 'Wniosek o delegację'
              axios
                .post(
                  `${process.env.SERVER_IP}/v1/acceptRequest/hr/holidays/${request.id}`,
                  request
                )
                .catch((error) => {
                  // Błąd logowania
                  this.errorMessage = error.response.data.error
                })
              await this.fetchAllRequests()
              await this.fetchMyRequests()
              await this.fetchArchivedRequests()
              this.selectedRequest = request
              return 'Wniosek został zaakceptowany'
            case 3:
              axios
                .post(
                  `${process.env.SERVER_IP}/v1/acceptRequest/hr/delegation/${request.id}`,
                  request
                )
                .catch((error) => {
                  this.errorMessage = error.response.data.error
                })
              await this.fetchAllRequests()
              await this.fetchMyRequests()
              await this.fetchArchivedRequests()
              this.selectedRequest = request
              return 'Wniosek został zaakceptowany'
            case 4:
            // 'Inne'
            default:
            // 'Nieznany'
          }
        } else {
          // 'Nieznany'
        }
      } else {
        return 'Wniosek nie został jeszcze zaakceptowany przez przełożonego. Zaczekaj aż zostanie podjęta jakaś akcja.'
      }
    },
    async rejectRequest(request) {
      try {
        await axios.put(
          `${process.env.SERVER_IP}/v1/rejectRequests/hr/${request.id}`
        )
        await this.fetchAllRequests()
        await this.fetchMyRequests()
        await this.fetchArchivedRequests()
        this.selectedRequest = request
      } catch (error) {
        console.error('Błąd podczas aktualizowania danych:', error)
      }
    },
    async bossReject(request) {
      try {
        await axios.put(
          `${process.env.SERVER_IP}/v1/rejectRequests/idBoss/${request.id}`
        )
        await this.fetchAllRequests()
        await this.fetchMyRequests()
        await this.fetchArchivedRequests()
        this.selectedRequest = request
      } catch (error) {
        console.error('Błąd podczas aktualizowania danych:', error)
      }
    },
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
.fas{
  color: black;
}
.fas:hover{
  color: #0f89ec;
}
.theadusers th:hover {
  color: red;
  cursor: pointer;
}
.requesttitle {
  margin-top: 1rem;
  margin-bottom: 1rem;
  color: black;
}
.menuRequests {
  display: inline-block;
  padding: 1rem 1rem;
  margin-top: 2rem;
  margin-left: 1rem;
  vertical-align: middle;
  background-color: white;
  border: 2px solid black;
  height: 780px;
  box-shadow: 5px 5px 10px 2px rgba(0, 0, 0, 0.2);
  border-collapse: collapse;
  border-radius: 5px 20px 5px;
  width: 25rem;
}
.menu1 {
  display: inline-block;
  padding: 1rem 1rem;
  margin-top: 2rem;
  margin-left: 1rem;
  vertical-align: middle;
  background-color: white;
  border: 2px solid black;
  height: 780px;
  box-shadow: 5px 5px 10px 2px rgba(0, 0, 0, 0.2);
  border-collapse: collapse;
  border-radius: 5px 20px 5px;
  width: 25rem;
  position: absolute;
}
.mainbody {
  white-space: nowrap;
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
.tableContainerRequests {
  text-align: center;
  display: inline-block;
  padding: 1rem 1rem;
  vertical-align: middle;
  position: relative;
}
.tableRequests {
  display: block;
  height: 780px;
  overflow-y: scroll;
  overflow-x: hidden;
  width: 100%;
  background-color: white;
  color: black;
  right: 5rem;
}
.tableContainerRequests thead th {
  position: sticky;
  top: 0;
}

.chat th {
  background-color: #f2f2f2;
}

.chat td {
  padding: 8px;
  border-bottom: 1px solid #ddd;
  width: 30%;
}

.th {
  text-align: center;
  color: white;
  background-color: black;
  width: 350px;
}

.element {
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
.element:hover {
  background-color: lightgray;
}
.requestDetails {
  background-color: white;
  text-align: center;
  color: black;
  width: 80%;
  position: absolute;
  right: 5rem;
  height: 100%;
}
.requestDetailsBackground {
  position: relative;
}
.button-back {
  color: black;
  border: black 1px solid;
  padding: 1%;
  margin: 1%;
  list-style-type: none;
  font-size: large;
  white-space: nowrap;
  width: 93%;
  text-align: center;
  bottom: 1rem;
  position: absolute;
}
.button-back1 {
  color: black;
  border: black 1px solid;
  padding: 1%;
  margin: 1%;
  list-style-type: none;
  font-size: large;
  white-space: nowrap;
  width: 93%;
  text-align: center;
  bottom: 5rem;
  position: absolute;
}
.button-back2 {
  color: black;
  border: black 1px solid;
  padding: 1%;
  margin: 1%;
  list-style-type: none;
  font-size: large;
  white-space: nowrap;
  width: 93%;
  text-align: center;
  bottom: 9rem;
  position: absolute;
}
.button-back:hover {
  background-color: lightgray;
}
.button-back1:hover {
  background-color: #0f89ec;
}

.button-back2:hover {
  background-color: red;
}
</style>
