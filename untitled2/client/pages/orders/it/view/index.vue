<template>
  <div class="container" v-if="getUserData?.role_id!==null">
    <NavHeader :activeIndex="1" />

    <div class="background">
      <div class="menuOrders">
        <ul>
          <li><h1 class="orderTittleIT" v-if="showOrders">Zamówienia</h1></li>
          <li ><h1 class="orderTittleIT" v-if="showDevices">Urządzenia</h1></li>
          <li> <button class="element" @click="showOrdersTable">Pokaż Zamówienia</button></li>
          <li> <button class="element" @click="showDevicesTable">Pokaż Urządzenia</button></li>
        </ul>
      </div>
    <div class="tableContainer" v-if="showOrders">
    <table class="table" v-if="showOrders">
      <thead>
      <tr>
        <th class="th" @click="sortTable('id')" v-if="this.sortBy==='id' && this.sortDirection===1">ID rosnąco</th>
        <th class="th" @click="sortTable('id')" v-else-if="this.sortBy==='id' && this.sortDirection===-1">ID malejąco</th>
        <th class="th" @click="sortTable('id')" v-else>ID</th>
        <th class="th" @click="sortTable('user_id')" v-if="this.sortBy==='user_id' && this.sortDirection===1">Użytkownik rosnąco</th>
        <th class="th" @click="sortTable('user_id')" v-else-if="this.sortBy==='user_id' && this.sortDirection===-1">Użytkownik malejąco</th>
        <th class="th" @click="sortTable('user_id')" v-else>Użytkownik</th>
        <th class="th" @click="sortTable('brand')" v-if="this.sortBy==='brand' && this.sortDirection===1">Marka rosnąco</th>
        <th class="th" @click="sortTable('brand')" v-else-if="this.sortBy==='brand' && this.sortDirection===-1">Marka malejąco</th>
        <th class="th" @click="sortTable('brand')" v-else>Marka</th>
        <th class="th" @click="sortTable('model')" v-if="this.sortBy==='model' && this.sortDirection===1">Model rosnąco</th>
        <th class="th" @click="sortTable('model')" v-else-if="this.sortBy==='model' && this.sortDirection===-1">Model malejąco</th>
        <th class="th" @click="sortTable('model')" v-else>Model</th>
        <th class="th" @click="sortTable('type')" v-if="this.sortBy==='type' && this.sortDirection===1">Typ rosnąco</th>
        <th class="th" @click="sortTable('type')" v-else-if="this.sortBy==='type' && this.sortDirection===-1">Typ malejąco</th>
        <th class="th" @click="sortTable('type')" v-else>Typ</th>
        <th class="th" @click="sortTable('completed')" v-if="this.sortBy==='completed' && this.sortDirection===1">Status zamówienia rosnąco</th>
        <th class="th" @click="sortTable('completed')" v-else-if="this.sortBy==='completed' && this.sortDirection===-1">Status zamówienia malejąco</th>
        <th class="th" @click="sortTable('completed')" v-else>Status zamówienia</th>
        <th class="th">Akcje</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="order in orders" :key="order.id">
        <td>{{ order.id }}</td>
        <td>(id:{{ order.user_id }}) {{getUserDetails(order.user_id).name}} {{getUserDetails(order.user_id).surname}}</td>
        <td>{{ order.brand }}</td>
        <td>{{ order.model }}</td>
        <td>{{ order.type }}</td>
        <td>{{ order.completed }}</td>
        <td>
          <button v-if="order.completed===0" @click="approveOrder(order.id)">
            <i class="fas fa-check"></i>
          </button>
          <button @click="rejectOrder(order.id)">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
      </tbody>
    </table>
    </div>

    <div class="tableContainer" v-if="showDevices">
    <table class="table" v-if="showDevices">
      <thead>
      <tr>
        <th class="th" @click="sortDevicesTable('id')" v-if="this.sortBy==='id' && this.sortDirection===1">ID rosnąco</th>
        <th class="th" @click="sortDevicesTable('id')" v-else-if="this.sortBy==='id' && this.sortDirection===-1">ID malejąco</th>
        <th class="th" @click="sortDevicesTable('id')" v-else>ID</th>
        <th class="th" @click="sortDevicesTable('brand')" v-if="this.sortBy==='brand' && this.sortDirection===1">Marka rosnąco</th>
        <th class="th" @click="sortDevicesTable('brand')" v-else-if="this.sortBy==='brand' && this.sortDirection===-1">Marka malejąco</th>
        <th class="th" @click="sortDevicesTable('brand')" v-else>Marka</th>
        <th class="th" @click="sortDevicesTable('model')" v-if="this.sortBy==='model' && this.sortDirection===1">Model rosnąco</th>
        <th class="th" @click="sortDevicesTable('model')" v-else-if="this.sortBy==='model' && this.sortDirection===-1">Model malejąco</th>
        <th class="th" @click="sortDevicesTable('model')" v-else>Model</th>
        <th class="th" @click="sortDevicesTable('quantity')" v-if="this.sortBy==='quantity' && this.sortDirection===1">Ilość rosnąco</th>
        <th class="th" @click="sortDevicesTable('quantity')" v-else-if="this.sortBy==='quantity' && this.sortDirection===-1">Ilość malejąco</th>
        <th class="th" @click="sortDevicesTable('quantity')" v-else>Ilość</th>
        <th class="th" @click="sortDevicesTable('type')" v-if="this.sortBy==='type' && this.sortDirection===1">Typ rosnąco</th>
        <th class="th" @click="sortDevicesTable('type')" v-else-if="this.sortBy==='type' && this.sortDirection===-1">Typ malejąco</th>
        <th class="th" @click="sortDevicesTable('type')" v-else>Typ</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="device in devices" :key="device.id">
        <td>{{ device.id }}</td>
        <td>{{ device.brand }}</td>
        <td>{{ device.model }}</td>
        <td>{{ device.quantity }}</td>
        <td>{{ device.type }}</td>
      </tr>
      </tbody>
    </table>
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
import { mapGetters, mapState } from "vuex";

export default {
  data() {
    return {
      orders: [],
      devices: [],
      showOrders: true,
      showDevices: false,
      response: "",
      user: {},
      sortBy: '',
      errorPath: '/error',
      sortDirection: 1
    };
  },
  computed: {
    ...mapState(['users']),
    ...mapGetters(['getUserData'])
  },
  async mounted() {
    await this.$store.dispatch('idFromCookies');
    await this.$store.dispatch('fetchUserData');
    if(this.getUserData?.role_id===null || this.getUserData?.role_id===0) {
      await this.$router.push(this.errorPath);
    }
    await this.fetchTables();
    this.orders.forEach((order) => {
      this.fetchUsers(order.user_id);
    });
  },
  methods: {
    showOrdersTable() {
      this.showOrders = true;
      this.showDevices = false;
    },
    showDevicesTable() {
      this.showOrders = false;
      this.showDevices = true;
    },
    async approveOrder(orderId) {
      this.showOrders = true;
      this.showDevices = false;
      const res = await axios.put(`${process.env.SERVER_IP}/v1/orders/upd/${orderId}`);
      this.response = res.data.message
      await this.fetchTables();
    },
    async rejectOrder(orderId) {
      this.showOrders = true;
      this.showDevices = false;
      const res = await axios.delete(`${process.env.SERVER_IP}/v1/orders/del/${orderId}`);
      this.response = res.data.message
      await this.fetchTables();
    },
    async fetchTables() {
      try {
        const ordersResponse = await axios.get(`${process.env.SERVER_IP}/v1/orders`);
        if (ordersResponse.status === 200) {
          this.orders = ordersResponse.data;
        }

        const devicesResponse = await axios.get(`${process.env.SERVER_IP}/v1/devices`);
        if (devicesResponse.status === 200) {
          this.devices = devicesResponse.data;
        }
      } catch (error) {
        console.error("Błąd podczas pobierania danych:", error);
      }
    },
    async fetchUsers(id) {
      try {
        return new Promise(async (resolve) => {
          const detailsResponse = await axios.get(`${process.env.SERVER_IP}/v1/users/${id}`);
          this.$set(this.user, id, detailsResponse.data)
          resolve(detailsResponse.data)
        }, 60)
      }
      catch (e) {
        console.error("Błąd podczas pobierania danych:", e);
      }
    },
    getUserDetails(userId) {
      return this.user[userId] || {};
    },
    sortTable(field) {
      if (this.sortBy === field) {
        this.sortDirection *= -1
      } else {
        this.sortBy = field
        this.sortDirection = 1
      }
      this.sortOrders();
    },
    sortOrders() {
      this.orders.sort((a, b) => {
        const valueA = this.getValueByField(a, this.sortBy);
        const valueB = this.getValueByField(b, this.sortBy);
        const isText = typeof valueA === 'string' && typeof valueB === 'string';
        const lowerValueA = isText ? valueA.toLowerCase() : valueA;
        const lowerValueB = isText ? valueB.toLowerCase() : valueB;
        if(lowerValueA < lowerValueB) {
          return -1 * this.sortDirection;
        } else if(lowerValueA > lowerValueB) {
          return this.sortDirection;
        } else {
          return 0;
        }
      });
    },
    sortDevicesTable(field) {
      if (this.sortBy === field) {
        this.sortDirection *= -1
      } else {
        this.sortBy = field
        this.sortDirection = 1
      }
      this.sortDevices();
    },
    sortDevices() {
      this.devices.sort((a, b) => {
        const valueA = this.getValueByField(a, this.sortBy);
        const valueB = this.getValueByField(b, this.sortBy);
        const isText = typeof valueA === 'string' && typeof valueB === 'string';
        const lowerValueA = isText ? valueA.toLowerCase() : valueA;
        const lowerValueB = isText ? valueB.toLowerCase() : valueB;
        if(lowerValueA < lowerValueB) {
          return -1 * this.sortDirection;
        } else if(lowerValueA > lowerValueB) {
          return this.sortDirection;
        } else {
          return 0;
        }
      });
    },
    getValueByField(obj, field) {
      const fields = field.split('.');
      let value = obj;
      for (const f of fields) {
        value = value[f];
      }
      return value;
    }
  }
};
</script>

<style scoped>
.fas {
  color: black;
}
.fas:hover{
 color: #0f89ec;
}
.orderTittleIT{
  color: black;
}
.theadusers th:hover {
  color: red;
  cursor: pointer;
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

.menuOrders{
  float: left;
  display: inline-block;
  padding: 1rem 1rem;
  margin-top: 3.5rem;
  margin-left: 1rem;
  vertical-align: middle;
  background-color: white;
  border: 2px solid black;
  height: 780px;
  box-shadow: 5px 5px 10px 2px rgba(0,0,0,.2);
  border-collapse: collapse;
  border-radius: 5px 20px 5px;
  width:250px;
}

.tableContainer{
  text-align: center;
  display: inline-block;
  padding: 1rem 1rem;

  vertical-align: middle;
  width: 82%;

}
.table{
  display: block;
  height: 780px;
  overflow-y: scroll;
  overflow-x: hidden;
  width: 100%;
  background-color: white;
  color: black;
}
.tableContainer thead th{
  position: sticky;
  top: 0;

}
table {
  border-collapse: collapse;
  width: 100%;
}
.chat th {
  background-color: #f2f2f2;
}

.chat td {
  padding: 8px;
  border-bottom: 1px solid #ddd;
  width: 30%;
}

.th{
  text-align: center;
  color: white;
  background-color: black;
  width: 350px;

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
.button{

}
</style>
