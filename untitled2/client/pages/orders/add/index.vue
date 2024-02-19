<template>
  <div class="container" v-if="getUserData?.role_id!==null">
    <NavHeader :activeIndex="12" />
    <div class="background">
      <div class="formBackground">
        <h1 class="titleadd" >Formularz Zgłoszenia</h1>
    <form v-if="!orderSubmitted" class="form" @submit.prevent="submitOrder">
      <div class="form-group">
        <label for="deviceType">Typ urządzenia:</label>
        <select id="deviceType" v-model="deviceType" required @change="updateDeviceList">
          <option value="Laptop">Laptop</option>
          <option value="Tablet">Tablet</option>
          <option value="Komputer">Komputer stacjonarny</option>
          <option value="Smartfon">Smartfon</option>
          <option value="Modem">Modem WiFi</option>
          <option value="Samochod">Samochód służbowy</option>
        </select>
      </div>
      <div class="form-group">
        <label for="deviceName">Nazwa urządzenia:</label>
        <select id="deviceName" v-model="deviceName" required>
          <option v-for="device in deviceList" :key="device">{{ device }}</option>
        </select>
      </div>
      <button class="submit-button" type="submit">Złóż Zamówienie</button>
    </form>
      </div>
      <div class="notificationBackground" v-if="orderSubmitted">
        <div class="notificationBody">
        <h2 class="title2">Zgłoszenie zostało złożone!</h2>
        <div>
          <p>Typ: {{ deviceType }}</p>
          <p>Nazwa: {{ deviceName }}</p>
        </div>
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
import axios from "axios";
import Vue from 'vue';
import VueCookies from 'vue-cookies';
import Vuex, { mapGetters, mapState } from "vuex";
require('dotenv').config();
Vue.use(Vuex)

Vue.use(VueCookies);

export default {
  data() {
    return {
      deviceType: "",
      deviceName: "",
      orderSubmitted: false,
      deviceList: [],
      errorPath: '/error',
    };
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
    async submitOrder() {
      const [deviceBrand, ...deviceModelArr] = this.deviceName.split(' ');
      const deviceModel = deviceModelArr.join(' ');

      try {
        const response = await axios.post(`${process.env.SERVER_IP}/v1/orders/add`, {
          deviceType: this.deviceType,
          deviceBrand: deviceBrand,
          deviceModel: deviceModel,
          uid: this.getUserData?.id
        });
        if (response.status === 200) {
          this.orderSubmitted = true;
        } else {
          console.error('Wystąpił błąd podczas wysyłania zamówienia.');
        }
      } catch (error) {
        console.error('Błąd podczas wysyłania zamówienia:', error);
      }
    },
    updateDeviceList() {
      switch (this.deviceType) {
        case "Laptop":
          this.deviceList = ["Dell XPS 13", "HP Spectre x360", "Lenovo ThinkPad X1 Carbon"];
          break;
        case "Tablet":
          this.deviceList = ["Apple iPad Pro", "Samsung Galaxy Tab S7", "Microsoft Surface Pro"];
          break;
        case "Komputer":
          this.deviceList = ["Apple iMac", "Dell Inspiron", "HP Pavilion"];
          break;
        case "Smartfon":
          this.deviceList = ["Apple iPhone 13", "Samsung Galaxy S21", "Google Pixel 6"];
          break;
        case "Modem":
          this.deviceList = ["TP-Link Archer C4000", "Netgear Nighthawk AX12", "Asus RT-AX88U"];
          break;
        case "Samochod":
          this.deviceList = ["Toyota Camry", "Ford Fusion", "Honda Accord"];
          break;
        default:
          this.deviceList = [];
          break;
      }
      this.deviceName = "";
    },
  }
};
</script>

<style scoped>
.titleadd{
  margin-left: 5rem;


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
.formBackground {
  position: relative;
  border-radius: 5px 20px 5px;
  font-weight: 700;
  max-width: 40%;
  padding-top: 2%;
  margin-left: 5rem;
  min-height: 41vh;
  margin-top: 5rem;
  font-size: large;
  background: #eeeeee;
  box-shadow: 5px 5px 10px 2px rgba(0,0,0,.2);
  color: black;

}

.form{
  margin-top: 2rem;
  position: relative;
}



.submit-button {

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
.submit-button:hover {
  color: black;
  background-color: lightblue;


}
.notificationBackground{
  position: absolute;
  background: #7197ff;
  width: 30%;
  height: 20%;
  text-align: center;
  justify-content: center;
  margin: auto;
  bottom: 1rem;
  right: 1rem;
  border-radius: 20px 20px 20px;
  box-shadow: 5px 5px 10px 2px rgba(0,0,0,.2);


}
.title2{
  color: black;
  display: flex;
  justify-content: center;
  font-family: 'Open Sans', sans-serif;
  white-space: nowrap;


}

.form-group {
  margin-bottom: 20px;
  margin-top: 5rem;
  margin-left: 5rem;
}
</style>
