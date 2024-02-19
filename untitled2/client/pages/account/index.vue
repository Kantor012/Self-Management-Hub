<template>
  <div class="container" v-if="getUserData?.role_id!==null">
    <NavHeader :activeIndex="4" />

<div class="background">

    <div class="infoBackground">
      <h1 class="titleacc">Konto</h1>
      <div>
        <p class="photo">
          <img
            id="userPhoto"
            class="photosize"
            :src="profileImageUrl"
            alt="Obrazek ze zdjęciem użytkownika"
          />
        </p>
        <input type="file" id="file" ref="fileInput" @change="handleFileChange" hidden="hidden"/>
        <button class="changePhotoButton" @click="openFileInput">Zmień zdjęcie</button>
        <table class="datatable">
          <tr class="tracc">
            <th class="thacc">Imię:</th>
            <td class="tdacc">{{ getUserData?.name }}</td>
          </tr>
          <tr class="tracc">
            <th class="thacc">Nazwisko:</th>
            <td class="tdacc">{{ getUserData?.surname }}</td>
          </tr>
          <tr class="tracc">
            <th class="thacc">E-mail:</th>
            <td class="tdacc">{{ getUserData?.email }}</td>
          </tr>
          <tr class="tracc">
            <th class="thacc">Telefon:</th>
            <td class="tdacc">{{ getUserData?.phone }}</td>
          </tr>
          <tr class="tracc">
            <th class="thacc">Rola:</th>
            <td class="tdacc">{{ getUserData?.role_name }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
  </div>
  <div class="container" v-else-if="true">
    <NavHeader :activeIndex="1" />
    <a>
      Nie masz dostępu do tej strony.
    </a>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import axios from "axios";
require('dotenv').config();
const serverip = process.env.SERVER_IP;
export default {
  name: 'dashboardPage',
  data() {
    return {
      imageUrl: '',
      profileImageUrl: '',
      errorPath: '/error',
    };
  },
  computed: {
    ...mapState(['users']),
    ...mapGetters(['getUserData'])
  },
  methods: {
    async getUserPhotoPath(userId) {
      try {
        const response = await axios.get(`${process.env.SERVER_IP}/v1/user/photo/${userId}`)
        console.log(response.data)
        this.profileImageUrl = response.data
      } catch (e) {
        console.log(e)
      }
    },
    async uploadImage(file) {
      try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await axios.post("https://api.imgur.com/3/image/", formData, {
          headers: {
            Authorization: "Client-ID 7e179e81e21bd34"
          }
        });
        this.imageUrl = response.data.data.link;
        await axios.post(`${process.env.SERVER_IP}/v1/user/photo/${this.getUserData.id}`, {link: this.imageUrl})
      } catch (error) {
        console.error('Błąd:', error);
      }
    },

    handleFileChange(event) {
      const fileInput = event.target;

      // Sprawdź, czy wybrano plik
      if (fileInput.files.length > 0) {
        // Pobierz pierwszy plik
        const file = fileInput.files[0];

        this.uploadImage(file);
      } else {
        console.error('Nie wybrano pliku.');
      }
    },
    openFileInput() {
      this.$refs.fileInput.click();
    },
  },
  async mounted() {
    await this.$store.dispatch('idFromCookies');
    await this.$store.dispatch('fetchUserData');
    if(this.getUserData?.role_id==null) {
      await this.$router.push(this.errorPath);
    }
    await this.getUserPhotoPath(this.$store.state.users.user.id)
  },
};
</script>

<style>
.changePhotoButton{
  color: black;
  font-weight: bold;
}
.background{
  width: 90%;
  color: white;
  background: linear-gradient(135deg, cornflowerblue, rgba(150, 129, 149, 0.98));
  display: block;
  justify-content: center;
  margin: 0 auto;
  border-radius: 5px 20px 5px;
  box-shadow: 5px 5px 10px 2px rgba(0,0,0,.2);
  min-height: 90vh;
  padding-top: 1rem;
  margin-top: 2rem;

}
.titleacc{
  color: black;
  margin-left: 3rem;

}
.photo{
  display: inline-block;
  padding: 1rem 1rem;
  vertical-align: middle;

}
.photosize{
  width:250px;
  height:250px;
  border-radius: 30%;
  border: 3px solid black;
  box-shadow: 5px 5px 10px 2px rgba(0,0,0,.2);

}
.thacc{

  margin-right: 2rem;
  padding-right: 1rem;
  width: 150px;

}
.tracc{
  display: block;
  padding: 1rem;
}
.tdacc{
  color: black;
  background-color: #e5e5e5;
  right: 0;
  width: 300px;
  padding-left: 1rem;
  border-radius: 3px;
  box-shadow: 5px 5px 10px 2px rgba(0,0,0,.2);
}
.datatable{
  position: relative;
  background: 0;
  box-shadow: none;
  display: inline-block;
  padding: 1rem 1rem;
  vertical-align: middle;
  width: 500px;
  overflow: hidden;

}
.infoBackground{
  padding-left: 3rem;
  border-radius: 5px 20px 5px;
  font-weight: 700;
  max-width: 60%;
  padding-top: 2%;
  margin-left: 3rem;
  height: 57vh;
  margin-top: 5rem;
  font-size: large;
  background: #eeeeee;
  box-shadow: 5px 5px 10px 2px rgba(0,0,0,.2);
}
</style>
