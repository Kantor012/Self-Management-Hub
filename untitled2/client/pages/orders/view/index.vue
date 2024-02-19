<template class="template">
  <div class="container" v-if="getUserData?.role_id!==null">
    <NavHeader :activeIndex="11" />
    <div class="background">
      <div class="mainbody">
        <div class="menuOrders">
          <ul>
            <li><h1 class="ordersTitle">Moje Zamówienia</h1></li>
            <li ><a href="add/">
              <button class="element">Dodaj zamówienie</button></a></li>
            <li v-if="getUserData?.role_id === 2"><a href="it/add/">
              <button class="elementit1">Dodaj sprzęt</button> </a></li>
            <li v-if="getUserData?.role_id === 2"><a href="it/view">
              <button class="elementit2">Przeglądaj zamówienia</button> </a></li>
          </ul>
        </div>
       <div class="tableContainerOrders">
      <table class="tableorders">
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
      </tr>
      </thead>
      <tbody>
      <tr v-for="order in orders" :key="order.id">
        <td>{{ order.id }}</td>
        <td>ID {{ order.user_id }}: {{order.name}} {{order.surname}}</td>
        <td>{{ order.brand }}</td>
        <td>{{ order.model }}</td>
        <td>{{ order.type }}</td>
        <td v-if="order.completed===1">Zrealizowane</td>
        <td v-if="order.completed===0">W realizacji</td>
        </tr>
       </tbody>
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

export default {
  name: "index",
  data () {
    return {
      orders: [],
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
  },
  methods: {
    async fetchTables() {
      try {
        const ordersResponse = await axios.get(`${process.env.SERVER_IP}/v1/orders/${this.getUserData?.id}`);
        if (ordersResponse.status === 200) {
          for(const ticket of ordersResponse.data) {
            const nameSurname = await axios.get(`${process.env.SERVER_IP}/v1/users/${ticket.user_id}`)
            ticket.name = nameSurname.data.name
            ticket.surname = nameSurname.data.surname
          }
          this.orders = ordersResponse.data;
        }
      }
      catch (e) {
        console.error("Błąd podczas pobierania danych:", e);
      }
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



<style>
.ordersTitle{
  color: black;
  font-size: x-large;
}
.theadusers th:hover {
  color: red;
  cursor: pointer;
}
.menuOrders{
  position: relative;
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

.tableContainerOrders{
  text-align: center;
  display: inline-block;
  padding: 1rem 1rem;
  vertical-align: middle;
  width: 75%;
}

.tableorders{
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
.th:hover{
  color: #0f89ec;
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
.elementit1{
  color: black;
  border: black 1px solid;
  padding: 1%;
  margin: 1%;
  list-style-type: none;
  font-size: large;
  white-space: nowrap;
  width: 94%;
  text-align: left;
  position: absolute;
  bottom: 0;
}
.elementit2{
  color: black;
  border: black 1px solid;
  padding: 1%;
  margin: 1%;
  list-style-type: none;
  font-size: large;
  white-space: nowrap;
  width: 94%;
  text-align: left;
  position: absolute;
  bottom: 4rem;
}
</style>
